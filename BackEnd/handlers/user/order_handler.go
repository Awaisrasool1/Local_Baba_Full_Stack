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
