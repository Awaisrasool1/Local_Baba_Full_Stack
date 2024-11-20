package user

import (
	"context"
	"fmt"
	"foodApp/database"
	"foodApp/models"
	"foodApp/utils"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

func AddOrderByCart(c *gin.Context) {
	token := c.GetHeader("Authorization")
	var input models.Order

	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "token missing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "invalid token"})
		return
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	userObjectID := (*claim)["userId"].(string)

	ctx := context.Background()
	cartCollection := database.GetCollection("cart")
	orderCollection := database.GetCollection("order")
	productCollection := database.GetCollection("product")

	cartItems, err := cartCollection.Find(ctx, bson.M{"user_id": userObjectID})
	if err != nil {
		log.Println("Error fetching cart items:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch cart items"})
		return
	}
	defer cartItems.Close(ctx)

	orderID := fmt.Sprintf("#%08d", rand.Intn(90000000)+10000000)

	log.Println("Generated Order ID:", orderID)

	var orders []interface{}
	var overallTotalBill float64

	for cartItems.Next(ctx) {
		var cartItem models.Cart
		if err := cartItems.Decode(&cartItem); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode cart item"})
			return
		}

		price := cartItem.DiscountedPrice
		if price == 0 {
			price = cartItem.OriginalPrice
		}
		totalBill := float64(cartItem.Quantity) * price
		overallTotalBill += totalBill

		var product models.Product
		err := productCollection.FindOne(ctx, bson.M{"_id": cartItem.ProductID}).Decode(&product)
		if err != nil {
			log.Println("Error fetching product details:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch product details"})
			return
		}

		order := models.Order{
			OrderID:      orderID,
			ID:           uuid.NewString(),
			UserID:       cartItem.UserID,
			ProductID:    cartItem.ProductID,
			RestaurantID: product.RestaurantID,
			Quantity:     cartItem.Quantity,
			Price:        price,
			TotalBill:    totalBill,
			City:         input.City,
			Address:      input.Address,
			PhoneNo:      input.PhoneNo,
			UserName:     input.UserName,
			Email:        input.Email,
			Status:       "Pending",
			ItemName:     product.Title,
			CreatedAt:    time.Now(),
		}

		orders = append(orders, order)
	}

	if len(orders) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "No items in cart to place an order"})
		return
	}

	_, err = orderCollection.InsertMany(ctx, orders)
	if err != nil {
		log.Println("InsertMany Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to place orders", "error": err.Error()})
		return
	}

	// _, err = cartCollection.DeleteMany(ctx, bson.M{"user_id": userObjectID})
	// if err != nil {
	// 	log.Println("Error clearing cart:", err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to clear cart"})
	// 	return
	// }

	c.JSON(http.StatusOK, gin.H{
		"message":      "Order placed successfully!",
		"orderID":      orderID,
		"overallTotal": overallTotalBill,
	})
}

func AddOrderByProduct(c *gin.Context) {
	token := c.GetHeader("Authorization")
	var input models.Order

	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "token missing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "invalid token"})
		return
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	productID := c.Param("id")

	userObjectID := (*claim)["userId"].(string)

	ctx := context.Background()
	orderCollection := database.GetCollection("order")
	productCollection := database.GetCollection("product")

	var product models.Product
	err = productCollection.FindOne(ctx, bson.M{"_id": productID}).Decode(&product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch product details"})
		return
	}

	orderID := fmt.Sprintf("#%08d", rand.Intn(90000000)+10000000)
	if product.ID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Product not found"})
		return
	}

	priceToUse := product.DiscountedPrice
	if priceToUse == 0 {
		priceToUse = product.OriginalPrice
	}

	totalPrice := float64(input.Quantity) * priceToUse

	newOrder := models.Order{
		ID:           uuid.NewString(),
		OrderID:      orderID,
		UserID:       userObjectID,
		ProductID:    productID,
		RestaurantID: product.RestaurantID,
		Quantity:     input.Quantity,
		Price:        priceToUse,
		TotalBill:    totalPrice,
		Status:       "Pending",
		CreatedAt:    time.Now(),
		Address:      input.Address,
		City:         input.City,
		PhoneNo:      input.PhoneNo,
		UserName:     input.UserName,
		Email:        input.Email,
		ItemName:     product.Title,
	}

	_, err = orderCollection.InsertOne(ctx, newOrder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to place order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Order placed successfully!",
		"orderID":    newOrder.OrderID,
		"totalPrice": totalPrice,
		"status":     newOrder.Status,
	})
}

func Get_user_ongoing_order(c *gin.Context) {
	type GroupedOrder struct {
		CreatedAt      time.Time `json:"created_at"`
		OrderId        string    `json:"orderId"`
		RestaurantName string    `json:"restaurantName"`
		Status         string    `json:"status"`
		Name           string    `json:"name"`
		Quantity       int       `json:"quantity"`
		Price          float64   `json:"price" bson:"price"`
		TotalAmount    float64   `json:"total_amount"`
		TotalItems     int       `json:"total_items"`
	}

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

	userId := (*claim)["userId"].(string)
	ctx := context.Background()

	orderCollection := database.GetCollection("order")
	productCollection := database.GetCollection("product")
	restaurantCollection := database.GetCollection("restaurants")

	filter := bson.M{
		"user_id": userId,
		"status":  "Pending",
	}

	cursor, err := orderCollection.Find(ctx, filter)
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

	productCache := make(map[string]string)
	restaurantCache := make(map[string]string)

	groupedOrders := make(map[string]*GroupedOrder)

	for _, order := range orders {
		orderID := order.OrderID
		restaurantID := order.RestaurantID

		restaurantName, exists := restaurantCache[restaurantID]
		if !exists {
			restaurantData := bson.M{}
			if err := restaurantCollection.FindOne(ctx, bson.M{"_id": restaurantID}).Decode(&restaurantData); err == nil {
				restaurantName, _ = restaurantData["name"].(string)
				restaurantCache[restaurantID] = restaurantName
			} else {
				log.Printf("Error fetching restaurant details for ID %s: %v", restaurantID, err)
				restaurantName = "Unknown Restaurant"
			}
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

		if _, exists := groupedOrders[orderID]; !exists {
			groupedOrders[orderID] = &GroupedOrder{
				CreatedAt:      order.CreatedAt,
				OrderId:        order.OrderID,
				RestaurantName: restaurantName,
				Status:         order.Status,
				Name:           "",
				Quantity:       0,
				Price:          0,
				TotalAmount:    0.0,
				TotalItems:     0,
			}
		}

		groupedOrder := groupedOrders[orderID]

		if groupedOrder.Name == "" {
			groupedOrder.Name = productName
		}

		groupedOrder.Quantity += order.Quantity
		groupedOrder.Price = order.Price

		groupedOrder.TotalAmount += order.TotalBill

		groupedOrder.TotalItems++
	}

	var response []GroupedOrder
	for _, groupedOrder := range groupedOrders {
		response = append(response, *groupedOrder)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   response,
	})
}

func Get_user_summry_order(c *gin.Context) {
	type OrderItem struct {
		Name     string  `json:"name"`
		Quantity int     `json:"quantity"`
		Price    float64 `json:"price" bson:"price"`
	}
	type GroupedOrder struct {
		CreatedAt      time.Time   `json:"created_at"`
		OrderId        string      `json:"orderId"`
		RestaurantName string      `json:"restaurantName"`
		Status         string      `json:"status"`
		OrderItem      []OrderItem `json:"orderItem"`
		TotalAmount    float64     `json:"total_amount"`
		TotalItems     int         `json:"total_items"`
	}
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

	userId := (*claim)["userId"].(string)
	ctx := context.Background()

	orderCollection := database.GetCollection("order")
	productCollection := database.GetCollection("product")
	restaurantCollection := database.GetCollection("restaurants")

	filter := bson.M{
		"user_id": userId,
		"status":  "Pending",
	}

	cursor, err := orderCollection.Find(ctx, filter)
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

	productCache := make(map[string]string)
	restaurantCache := make(map[string]string)

	groupedOrders := make(map[string]*GroupedOrder)

	for _, order := range orders {
		orderID := order.OrderID
		restaurantID := order.RestaurantID

		restaurantName, exists := restaurantCache[restaurantID]
		if !exists {
			restaurantData := bson.M{}
			if err := restaurantCollection.FindOne(ctx, bson.M{"_id": restaurantID}).Decode(&restaurantData); err == nil {
				restaurantName, _ = restaurantData["name"].(string)
				restaurantCache[restaurantID] = restaurantName
			} else {
				log.Printf("Error fetching restaurant details for ID %s: %v", restaurantID, err)
				restaurantName = "Unknown Restaurant"
			}
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

		if _, exists := groupedOrders[orderID]; !exists {
			groupedOrders[orderID] = &GroupedOrder{
				CreatedAt:      order.CreatedAt,
				OrderId:        order.OrderID,
				RestaurantName: restaurantName,
				Status:         order.Status,
				OrderItem:      []OrderItem{},
				TotalAmount:    0.0,
				TotalItems:     0,
			}
		}

		groupedOrder := groupedOrders[orderID]
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
			groupedOrder.TotalItems++
		}
	}

	var response []GroupedOrder
	for _, groupedOrder := range groupedOrders {
		response = append(response, *groupedOrder)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   response,
	})
}
