package user

import (
	"context"
	"foodApp/database"
	"foodApp/models"
	"foodApp/utils"
	"log"
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

	log.Println("Cart Items Found:", cartItems.RemainingBatchLength())

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
			FirstName:    input.FirstName,
			Email:        input.Email,
			Status:       "Pending",
			CreatedAt:    time.Now(),
		}

		orders = append(orders, order)
	}

	log.Printf("Orders Slice Length: %d\n", len(orders))

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

	c.JSON(http.StatusOK, gin.H{
		"message":      "Order placed successfully!",
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
		FirstName:    input.FirstName,
		Email:        input.Email,
	}

	_, err = orderCollection.InsertOne(ctx, newOrder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to place order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "Order placed successfully!",
		"orderID":     newOrder.ID,
		"totalPrice":  totalPrice,
		"restaurant":  product.RestaurantID,
		"quantity":    input.Quantity,
		"productName": product.Title,
		"status":      newOrder.Status,
	})
}

func ShowAvailableOrders(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "token messing"})
		return
	}
	_, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "invalid token"})
		return
	}
	collection := database.GetCollection("orders")
	ctx := context.Background()

	var orders []models.FoodOrder
	filter := bson.M{"status": "Pending"}

	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch orders"})
		return
	}

	if err := cursor.All(ctx, &orders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to parse orders"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "sucess", "data": orders})
}

func AcceptOrder(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "token messing"})
		return
	}
	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "invalid token"})
		return
	}

	var order models.FoodOrder
	orderId := c.Param("orderId")
	riderId := (*claim)["userId"].(string)

	collection := database.GetCollection("orders")
	riderCollection := database.GetCollection("user")

	ctx := context.Background()

	err = collection.FindOne(ctx, bson.M{"_id": orderId, "status": "Pending"}).Decode(&order)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Order already taken"})
		return
	}

	var rider models.User
	err = riderCollection.FindOne(ctx, bson.M{"_id": riderId}).Decode(&rider)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Rider not found"})
		return
	}

	update := bson.M{"$set": bson.M{"rider_id": riderId, "status": "Assigned"}}
	_, err = collection.UpdateOne(ctx, bson.M{"_id": orderId}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to assign order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "sucess", "message": "Order accepted", "order_id": orderId, "rider_id": riderId})
}
