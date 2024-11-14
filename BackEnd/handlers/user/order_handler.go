package user

import (
	"context"
	"foodApp/database"
	"foodApp/models"
	"foodApp/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

func PlaceOrder(c *gin.Context) {
	var order models.FoodOrder
	var products []models.Product

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
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	productCollection := database.GetCollection("products")
	ctx := context.Background()

	cursor, err := productCollection.Find(ctx, bson.M{"_id": bson.M{"$in": order.ProductIDs}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch products"})
		return
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &products); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	for _, product := range products {
		order.TotalPrice += product.OriginalPrice
	}

	order.ID = uuid.NewString()
	order.Status = "Pending"
	order.UserID = (*claim)["userId"].(string)

	collection := database.GetCollection("orders")

	_, err = collection.InsertOne(ctx, order)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to place order"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "sucess", "message": "Order placed successfully", "order_id": order.ID})
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
