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

	firebase "firebase.google.com/go"
	"firebase.google.com/go/messaging"
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
	_, _, _, _, apiKey, _, _ := envConfig.GetEnvVars()

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
	_, _, _, _, apiKey, _, _ := envConfig.GetEnvVars()

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

	log.Printf("Fetching orders for restaurant ID: %s", restaurantID)
	log.Printf("Order filter: %v, Options: %+v", filter, options.Find().SetLimit(int64(limit)).SetSkip(int64(skip)))

	// Fetch orders based on filter
	cursor, err := orderCollection.Find(ctx, filter, options.Find().SetLimit(int64(limit)).SetSkip(int64(skip)))
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

	log.Printf("Orders retrieved: %d", len(orders))

	// Fetch restaurant name
	var restaurantData bson.M
	if err := restaurantCollection.FindOne(ctx, bson.M{"_id": restaurantID}).Decode(&restaurantData); err == nil {
		log.Printf("Restaurant name fetched: %s", restaurantData["name"])
	}

	restaurantName := restaurantData["name"].(string)
	groupedOrders := make(map[string]map[string]*GroupedOrder)
	userCache := make(map[string]bson.M)
	productCache := make(map[string]string)

	// Process each order
	for _, order := range orders {
		log.Printf("Processing order for UserID: %s, OrderID: %s", order.UserID, order.OrderID)

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
				log.Printf("Error fetching default address for user %s: %v", order.UserID, err)
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

		// Group orders by UserID and OrderID
		if _, exists := groupedOrders[order.UserID]; !exists {
			groupedOrders[order.UserID] = make(map[string]*GroupedOrder)
		}

		// Ensure unique grouping by OrderID for each user
		if _, exists := groupedOrders[order.UserID][order.OrderID]; !exists {
			groupedOrders[order.UserID][order.OrderID] = &GroupedOrder{
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

		groupedOrder := groupedOrders[order.UserID][order.OrderID]
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

	log.Printf("Grouped orders count: %d", len(groupedOrders))

	// Prepare response
	var response []GroupedOrder
	for _, userGroups := range groupedOrders {
		for _, groupedOrder := range userGroups {
			groupedOrder.TotalAmount += groupedOrder.DeliveryFee
			response = append(response, *groupedOrder)
		}
	}

	log.Printf("Response size: %d grouped orders", len(response))

	// Return response
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   response,
	})
}

func UpdateOrderStatus(c *gin.Context, firebaseApp *firebase.App) {
	var body struct {
		Id     string `json:"id"`
		Status string `json:"status"`
	}

	if firebaseApp == nil {
		log.Println("Firebase app is nil. Please check initialization.")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Firebase app is not initialized"})
		return
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		log.Printf("Invalid request body: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if body.Status != "Accepted" && body.Status != "Cancelled" {
		log.Println("Invalid status. Allowed values: 'Accepted', 'Cancelled'")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status. Allowed values: 'Accepted', 'Cancelled'"})
		return
	}

	collection := database.GetCollection("order")
	ctx := context.Background()

	var order models.Order
	if err := collection.FindOne(ctx, bson.M{"orderId": body.Id}).Decode(&order); err != nil {
		log.Printf("Order not found: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}
	log.Printf("Order found: OrderID = %s, UserID = %s", order.OrderID, order.UserID)

	update := bson.M{
		"$set": bson.M{
			"status": body.Status,
		},
	}
	_, err := collection.UpdateOne(ctx, bson.M{"orderId": body.Id}, update)
	if err != nil {
		log.Printf("Failed to update order status: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order"})
		return
	}
	log.Println("Order status updated successfully")

	userTokenCollection := database.GetCollection("fcm_tokens")
	var userToken models.FCMToken
	if err := userTokenCollection.FindOne(ctx, bson.M{"user_id": order.UserID}).Decode(&userToken); err != nil {
		log.Printf("Failed to retrieve user FCM token: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user FCM token"})
		return
	}
	log.Printf("FCM token found for user %s", order.UserID)

	client, err := firebaseApp.Messaging(ctx)
	if err != nil {
		log.Printf("Failed to get Messaging client: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to initialize Firebase messaging client",
			"details": err.Error(),
		})
		return
	}
	log.Println("Firebase messaging client initialized")

	message := &messaging.Message{
		Token: userToken.FCMToken,
		Notification: &messaging.Notification{
			Title: "Order Status Update",
			Body:  "Your order status has been updated to " + body.Status,
		},
	}

	_, err = client.Send(ctx, message)
	if err != nil {
		log.Printf("Failed to send user notification: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send user notification"})
		return
	}
	log.Println("User notification sent successfully")

	userCollection := database.GetCollection("user")
	cursor, err := userCollection.Find(ctx, bson.M{"role": 3})
	if err != nil {
		log.Printf("Failed to retrieve riders: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve riders"})
		return
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var rider models.User
		if err := cursor.Decode(&rider); err != nil {
			log.Printf("Failed to decode rider data: %v", err)
			continue
		}

		var riderToken models.FCMToken
		if err := userTokenCollection.FindOne(ctx, bson.M{"user_id": rider.ID}).Decode(&riderToken); err != nil {
			log.Printf("Failed to retrieve FCM token for rider %s: %v", rider.ID, err)
			continue
		}

		riderMessage := &messaging.Message{
			Token: riderToken.FCMToken,
			Notification: &messaging.Notification{
				Title: "New Order Arrived",
				Body:  "A new order is ready. Please check your orders.",
			},
		}

		_, err := client.Send(ctx, riderMessage)
		if err != nil {
			log.Printf("Failed to send notification to rider %s: %v", rider.ID, err)
			continue
		}
		log.Printf("Notification sent successfully to rider %s", rider.ID)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order status updated and notifications sent"})
}
