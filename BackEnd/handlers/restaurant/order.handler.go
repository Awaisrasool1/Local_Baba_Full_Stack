package restaurant

import (
	"context"
	"foodApp/database"
	"foodApp/envConfig"
	"foodApp/models"
	"foodApp/utils"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type OrderItem struct {
	Name     string  `json:"name"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price" bson:"price"`
}

type GroupedOrder struct {
	CreatedAt      time.Time      `json:"created_at"`
	UserID         string         `json:"user_id"`
	OrderId        string         `json:"orderId"`
	Name           string         `json:"name"`
	Image          string         `json:"image"`
	Email          string         `json:"email"`
	Phone          string         `json:"phone"`
	City           string         `json:"city"`
	Address        string         `json:"address"`
	RestaurantName string         `json:"restaurantName"`
	Status         string         `json:"status"`
	Orders         []models.Order `json:"orders"`
	OrderItem      []OrderItem    `json:"orderItem"`
	DeliveryFee    float64        `json:"deliveryFee"`
	TotalAmount    float64        `json:"total_amount"`
}

func GetOrdersByRestaurant(c *gin.Context) {
	token := c.GetHeader("Authorization")
	_, _, _, _, apiKey := envConfig.GetEnvVars()

	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token missing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "invalid token"})
		return
	}

	restaurantID := (*claim)["userId"].(string)
	ctx := context.Background()
	orderCollection := database.GetCollection("order")
	addressCollection := database.GetCollection("address")
	productCollection := database.GetCollection("product")
	userCollection := database.GetCollection("user")
	restaurantCollection := database.GetCollection("restaurants")

	fiveHoursAgo := time.Now().Add(-5 * time.Hour)
	updateFilter := bson.M{
		"restaurant_id": restaurantID,
		"status": bson.M{
			"$nin": []string{"Cancelled", "Delivered"},
		},
		"createdAt": bson.M{
			"$lt": fiveHoursAgo,
		},
	}

	update := bson.M{
		"$set": bson.M{
			"status": "Cancelled",
		},
	}

	_, err = orderCollection.UpdateMany(ctx, updateFilter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to update expired orders"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "5"))
	skip := (page - 1) * limit

	filter := bson.M{
		"restaurant_id": restaurantID,
		"status": bson.M{
			"$nin": []string{"Cancelled", "Delivered"},
		},
		"createdAt": bson.M{
			"$gte": fiveHoursAgo,
		},
	}

	opts := options.Find().SetLimit(int64(limit)).SetSkip(int64(skip))

	cursor, err := orderCollection.Find(ctx, filter, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch orders"})
		return
	}
	defer cursor.Close(ctx)

	var orders []models.Order
	if err := cursor.All(ctx, &orders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to decode orders"})
		return
	}

	restaurantData := bson.M{}
	restaurantName := ""
	if err := restaurantCollection.FindOne(ctx, bson.M{"_id": restaurantID}).Decode(&restaurantData); err == nil {
		restaurantName, _ = restaurantData["name"].(string)
	}

	groupedOrders := make(map[string]map[string]*GroupedOrder)
	for _, order := range orders {
		orderID := order.OrderID

		var user bson.M
		err := userCollection.FindOne(ctx, bson.M{"_id": order.UserID}).Decode(&user)
		if err != nil {
			log.Printf("Error fetching user details for ID %s: %v", order.UserID, err)
			continue
		}

		var city, fullAddress string
		if order.IsDefaultAddress {
			var address bson.M
			err := addressCollection.FindOne(ctx, bson.M{"userId": order.UserID, "isDefaultShipping": true}).Decode(&address)
			if err != nil {
				log.Printf("Error fetching address for user %s: %v", order.UserID, err)
				return
			}
			city = address["city"].(string)
			fullAddress = address["fullAddress"].(string)
		} else {
			city, fullAddress, err = utils.GetCityAndAddressFromLatLong(order.LatLong, apiKey)
			if err != nil {
				log.Printf("Error fetching address from LatLong: %v", err)
				continue
			}
		}

		if _, exists := groupedOrders[order.UserID]; !exists {
			groupedOrders[order.UserID] = make(map[string]*GroupedOrder)
		}

		if _, exists := groupedOrders[order.UserID][orderID]; !exists {
			groupedOrders[order.UserID][orderID] = &GroupedOrder{
				CreatedAt:      order.CreatedAt,
				UserID:         order.UserID,
				OrderId:        order.OrderID,
				City:           city,
				Address:        fullAddress,
				Email:          user["email"].(string),
				Image:          user["image"].(string),
				Name:           user["name"].(string),
				Phone:          user["phone"].(string),
				RestaurantName: restaurantName,
				Status:         order.Status,
				Orders:         []models.Order{},
				OrderItem:      []OrderItem{},
				TotalAmount:    0.0,
				DeliveryFee:    order.DeliveryFee,
			}
		}

		var product struct {
			Title string `bson:"title"`
		}
		err = productCollection.FindOne(ctx, bson.M{"_id": order.ProductID}).Decode(&product)
		if err != nil {
			log.Printf("Error fetching product details for ID %s: %v", order.ProductID, err)
			continue
		}

		groupedOrder := groupedOrders[order.UserID][orderID]
		groupedOrder.Orders = append(groupedOrder.Orders, order)
		groupedOrder.TotalAmount += order.TotalBill

		itemMatched := false
		for i := range groupedOrder.OrderItem {
			if groupedOrder.OrderItem[i].Name == product.Title {
				groupedOrder.OrderItem[i].Quantity += order.Quantity
				itemMatched = true
				break
			}
		}

		if !itemMatched {
			groupedOrder.OrderItem = append(groupedOrder.OrderItem, OrderItem{
				Name:     product.Title,
				Quantity: order.Quantity,
				Price:    order.Price,
			})
		}
	}

	var response []GroupedOrder
	for _, userGroups := range groupedOrders {
		for _, groupedOrder := range userGroups {
			groupedOrder.TotalAmount = groupedOrder.TotalAmount + groupedOrder.DeliveryFee
			response = append(response, *groupedOrder)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   response,
	})
}

func GetNonPendingOrdersByRestaurant(c *gin.Context) {
	token := c.GetHeader("Authorization")
	_, _, _, _, apiKey := envConfig.GetEnvVars()

	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token missing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "invalid token"})
		return
	}

	restaurantID := (*claim)["userId"].(string)
	ctx := context.Background()
	orderCollection := database.GetCollection("order")
	productCollection := database.GetCollection("product")
	userCollection := database.GetCollection("user")
	addressCollection := database.GetCollection("address")
	restaurantCollection := database.GetCollection("restaurants")

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "5"))
	skip := (page - 1) * limit

	filter := bson.M{
		"restaurant_id": restaurantID,
		"status":        bson.M{"$in": []string{"Cancelled", "Delivered"}},
	}

	opts := options.Find().SetLimit(int64(limit)).SetSkip(int64(skip))
	cursor, err := orderCollection.Find(ctx, filter, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch orders"})
		return
	}
	defer cursor.Close(ctx)

	var orders []models.Order
	if err := cursor.All(ctx, &orders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to decode orders"})
		return
	}

	userCache := make(map[string]bson.M)
	productCache := make(map[string]string)
	restaurantData := bson.M{}
	restaurantName := ""

	if err := restaurantCollection.FindOne(ctx, bson.M{"_id": restaurantID}).Decode(&restaurantData); err == nil {
		restaurantName, _ = restaurantData["name"].(string)
	}

	groupedOrders := make(map[string]map[string]*GroupedOrder)

	for _, order := range orders {
		orderID := order.OrderID

		// Fetch user data
		userData, exists := userCache[order.UserID]
		if !exists {
			err := userCollection.FindOne(ctx, bson.M{"_id": order.UserID}).Decode(&userData)
			if err != nil {
				log.Printf("Error fetching user details for ID %s: %v", order.UserID, err)
				continue
			}
			userCache[order.UserID] = userData
		}

		// Fetch product data
		productName, exists := productCache[order.ProductID]
		if !exists {
			var product struct {
				Title string `bson:"title"`
			}
			err := productCollection.FindOne(ctx, bson.M{"_id": order.ProductID}).Decode(&product)
			if err != nil {
				log.Printf("Error fetching product details for ID %s: %v", order.ProductID, err)
				continue
			}
			productName = product.Title
			productCache[order.ProductID] = productName
		}

		var city, fullAddress string
		if order.IsDefaultAddress {
			var address bson.M
			err := addressCollection.FindOne(ctx, bson.M{"userId": order.UserID, "isDefaultShipping": true}).Decode(&address)
			if err != nil {
				log.Printf("Error fetching address for user %s: %v", order.UserID, err)
				return
			}
			city = address["city"].(string)
			fullAddress = address["fullAddress"].(string)
		} else {
			city, fullAddress, err = utils.GetCityAndAddressFromLatLong(order.LatLong, apiKey)
			if err != nil {
				log.Printf("Error fetching address from LatLong: %v", err)
				continue
			}
		}
		if _, exists := groupedOrders[order.UserID]; !exists {
			groupedOrders[order.UserID] = make(map[string]*GroupedOrder)
		}
		if _, exists := groupedOrders[order.UserID][orderID]; !exists {
			groupedOrders[order.UserID][orderID] = &GroupedOrder{
				CreatedAt:      order.CreatedAt,
				UserID:         order.UserID,
				OrderId:        order.OrderID,
				City:           city,
				Address:        fullAddress,
				Email:          userData["email"].(string),
				Image:          userData["image"].(string),
				Name:           userData["name"].(string),
				Phone:          userData["phone"].(string),
				RestaurantName: restaurantName,
				Status:         order.Status,
				Orders:         []models.Order{},
				OrderItem:      []OrderItem{},
				TotalAmount:    0.0,
				DeliveryFee:    order.DeliveryFee,
			}
		}

		groupedOrder := groupedOrders[order.UserID][orderID]
		groupedOrder.Orders = append(groupedOrder.Orders, order)
		groupedOrder.TotalAmount += order.TotalBill

		itemMatched := false
		for i := range groupedOrder.OrderItem {
			if groupedOrder.OrderItem[i].Name == productName {
				groupedOrder.OrderItem[i].Quantity += order.Quantity
				itemMatched = true
				break
			}
		}

		if !itemMatched {
			groupedOrder.OrderItem = append(groupedOrder.OrderItem, OrderItem{
				Name:     productName,
				Quantity: order.Quantity,
				Price:    order.Price,
			})
		}
	}

	var response []GroupedOrder
	for _, userGroups := range groupedOrders {
		for _, groupedOrder := range userGroups {
			groupedOrder.TotalAmount = groupedOrder.TotalAmount + groupedOrder.DeliveryFee
			response = append(response, *groupedOrder)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   response,
	})
}

func UpdateOrderStatus(c *gin.Context) {
	var body struct {
		Id     string `json:"id"`
		Status string `json:"status"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if body.Status != "Accepted" && body.Status != "Cancelled" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status. Allowed values: 'Accepted', 'Cancelled'"})
		return
	}

	collection := database.GetCollection("order")
	ctx := context.Background()

	update := bson.M{
		"$set": bson.M{
			"status": body.Status,
		},
	}

	result, err := collection.UpdateMany(ctx, bson.M{"orderId": body.Id}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Order status updated successfully"})
}
