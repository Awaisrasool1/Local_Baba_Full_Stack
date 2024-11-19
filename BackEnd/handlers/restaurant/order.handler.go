package restaurant

import (
	"context"
	"fmt"
	"foodApp/database"
	"foodApp/models"
	"foodApp/utils"
	"log"
	"net/http"
	"sort"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type OrderItem struct {
	Name     string `json:"name"`
	Quantity int    `json:"quantity"`
}

type GroupedOrder struct {
	CreatedAt      time.Time      `json:"created_at"`
	UserID         string         `json:"user_id"`
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
	TotalAmount    float64        `json:"total_amount"`
}

func GetOrdersByRestaurant(c *gin.Context) {
	token := c.GetHeader("Authorization")
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
	restaurantCollection := database.GetCollection("restaurant")

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "5"))
	skip := (page - 1) * limit

	filter := bson.M{
		"restaurant_id": restaurantID,
		"status":        "Pending",
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
		userData, exists := userCache[order.UserID]
		if !exists {
			err := userCollection.FindOne(ctx, bson.M{"_id": order.UserID}).Decode(&userData)
			if err != nil {
				log.Printf("Error fetching user details for ID %s: %v", order.UserID, err)
				continue
			}
			userCache[order.UserID] = userData
		}

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

		timeKey := order.CreatedAt.Format("2006-01-02T15:04")

		if _, exists := groupedOrders[order.UserID]; !exists {
			groupedOrders[order.UserID] = make(map[string]*GroupedOrder)
		}

		if _, exists := groupedOrders[order.UserID][timeKey]; !exists {
			groupedOrders[order.UserID][timeKey] = &GroupedOrder{
				CreatedAt:      order.CreatedAt,
				UserID:         order.UserID,
				City:           order.City,
				Address:        order.Address,
				Email:          userData["email"].(string),
				Image:          userData["image"].(string),
				Name:           userData["name"].(string),
				Phone:          userData["phone"].(string),
				RestaurantName: restaurantName,
				Status:         order.Status,
				Orders:         []models.Order{},
				OrderItem:      []OrderItem{},
				TotalAmount:    0.0,
			}
		}

		groupedOrder := groupedOrders[order.UserID][timeKey]
		groupedOrder.Orders = append(groupedOrder.Orders, order)
		groupedOrder.TotalAmount += order.TotalBill

		found := false
		for i := range groupedOrder.OrderItem {
			if groupedOrder.OrderItem[i].Name == productName {
				groupedOrder.OrderItem[i].Quantity += order.Quantity
				found = true
				break
			}
		}
		if !found {
			groupedOrder.OrderItem = append(groupedOrder.OrderItem, OrderItem{
				Name:     productName,
				Quantity: order.Quantity,
			})
		}
	}

	response := []GroupedOrder{}
	for _, timeGroups := range groupedOrders {
		for _, groupedOrder := range timeGroups {
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
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Token missing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Invalid token"})
		return
	}

	restaurantID := (*claim)["userId"].(string)
	ctx := context.Background()
	orderCollection := database.GetCollection("order")
	userCollection := database.GetCollection("user")

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "5"))
	skip := (page - 1) * limit

	filter := bson.M{
		"restaurant_id": restaurantID,
		"status":        bson.M{"$ne": "Pending"},
	}

	opts := options.Find().SetLimit(int64(limit)).SetSkip(int64(skip))

	totalItems, err := orderCollection.CountDocuments(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}

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

	groupedOrdersMap := make(map[string]GroupedOrder)

	for _, order := range orders {
		userData, exists := userCache[order.UserID]
		if !exists {
			err := userCollection.FindOne(ctx, bson.M{"_id": order.UserID}).Decode(&userData)
			if err != nil {
				log.Printf("Error fetching user details for ID %s: %v", order.UserID, err)
				continue
			}
			userCache[order.UserID] = userData
		}

		timeKey := order.CreatedAt.Format("2006-01-02T15:04")
		groupKey := fmt.Sprintf("%s_%s", order.UserID, timeKey)

		group, exists := groupedOrdersMap[groupKey]
		if !exists {
			group = GroupedOrder{
				CreatedAt:   order.CreatedAt,
				UserID:      order.UserID,
				City:        order.City,
				Address:     order.Address,
				Name:        userData["name"].(string),
				Email:       userData["email"].(string),
				Phone:       userData["phone"].(string),
				Image:       userData["image"].(string),
				Orders:      []models.Order{},
				OrderItem:   []OrderItem{},
				TotalAmount: 0,
			}
		}

		group.Orders = append(group.Orders, order)
		group.TotalAmount += order.TotalBill

		found := false
		for i := range group.OrderItem {
			if group.OrderItem[i].Name == order.ProductID {
				group.OrderItem[i].Quantity += order.Quantity
				found = true
				break
			}
		}
		if !found {
			group.OrderItem = append(group.OrderItem, OrderItem{
				Name:     order.ProductID,
				Quantity: order.Quantity,
			})
		}

		groupedOrdersMap[groupKey] = group
	}

	var groupedOrders []GroupedOrder
	for _, group := range groupedOrdersMap {
		groupedOrders = append(groupedOrders, group)
	}

	sort.Slice(groupedOrders, func(i, j int) bool {
		return groupedOrders[i].CreatedAt.After(groupedOrders[j].CreatedAt)
	})

	c.JSON(http.StatusOK, gin.H{
		"status":     "success",
		"data":       groupedOrders,
		"totalItems": totalItems,
	})
}

// func GetUserOrders(c *gin.Context) {
// 	token := c.GetHeader("Authorization")
// 	if token == "" {
// 		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "token missing"})
// 		return
// 	}

// 	claim, err := utils.ValidateToken(token)
// 	if err != nil {
// 		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "invalid token"})
// 		return
// 	}

// 	userID := (*claim)["userId"].(string)
// 	ctx := context.Background()
// 	orderCollection := database.GetCollection("order")
// 	userCollection := database.GetCollection("users")

// 	// Get user details
// 	var userData bson.M
// 	err = userCollection.FindOne(ctx, bson.M{"_id": userID}).Decode(&userData)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch user details"})
// 		return
// 	}

// 	// Get all orders for the user
// 	cursor, err := orderCollection.Find(ctx, bson.M{"user_id": userID})
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch orders"})
// 		return
// 	}
// 	defer cursor.Close(ctx)

// 	var orders []models.Order
// 	if err := cursor.All(ctx, &orders); err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to decode orders"})
// 		return
// 	}

// 	// Group orders by creation time
// 	orderGroups := make(map[time.Time]GroupedOrder)

// 	for _, order := range orders {
// 		group, exists := orderGroups[order.CreatedAt]
// 		if !exists {
// 			group = GroupedOrder{
// 				CreatedAt: order.CreatedAt,
// 				UserID:    userID,
// 				FirstName: userData["first_name"].(string),
// 				LastName:  userData["last_name"].(string),
// 				Email:     userData["email"].(string),
// 				Phone:     userData["phone"].(string),
// 				Orders:    make([]models.Order, 0),
// 			}
// 		}
// 		group.Orders = append(group.Orders, order)
// 		group.TotalAmount += order.TotalBill
// 		orderGroups[order.CreatedAt] = group
// 	}

// 	var groupedOrders []GroupedOrder
// 	for _, group := range orderGroups {
// 		groupedOrders = append(groupedOrders, group)
// 	}

// 	// Sort grouped orders by creation time (newest first)
// 	sort.Slice(groupedOrders, func(i, j int) bool {
// 		return groupedOrders[i].CreatedAt.After(groupedOrders[j].CreatedAt)
// 	})

// 	c.JSON(http.StatusOK, gin.H{
// 		"status": "success",
// 		"orders": groupedOrders,
// 	})
// }
