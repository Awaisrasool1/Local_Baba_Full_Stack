package restaurant

import (
	"context"
	"foodApp/database"
	"foodApp/models"
	"foodApp/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

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

	var orders []models.Order
	cursor, err := orderCollection.Find(ctx, bson.M{"restaurant_id": restaurantID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch orders"})
		return
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var order models.Order
		if err := cursor.Decode(&order); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to decode order"})
			return
		}
		orders = append(orders, order)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"orders": orders,
	})
}
