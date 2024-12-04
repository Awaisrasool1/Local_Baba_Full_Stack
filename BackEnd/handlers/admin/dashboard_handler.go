package admin

import (
	"context"
	"foodApp/database"
	"foodApp/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func Get_admin_dashboard_counts(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token missing"})
		return
	}

	_, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "invalid token"})
		return
	}

	ctx := context.Background()

	pipeline := mongo.Pipeline{
		{
			{Key: "$group", Value: bson.D{
				{Key: "_id", Value: "$orderId"},
			}},
		},
		{
			{Key: "$count", Value: "totalOrders"},
		},
	}
	collection := database.GetCollection("order")
	userCollection := database.GetCollection("user")

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to count orders"})
		return
	}
	defer cursor.Close(ctx)

	var result []bson.M
	if err = cursor.All(ctx, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to parse aggregation result"})
		return
	}

	totalOrders := 0
	if len(result) > 0 {
		if count, ok := result[0]["totalOrders"].(int32); ok {
			totalOrders = int(count)
		}
	}

	restaurantCount, err := userCollection.CountDocuments(ctx, bson.M{"role": 2})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error fetching restaurant count"})
		return
	}

	riderCount, err := userCollection.CountDocuments(ctx, bson.M{"role": 3})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error fetching rider count"})
		return
	}

	userCount, err := userCollection.CountDocuments(ctx, bson.M{"role": 4})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error fetching user count"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":          "success",
		"restaurantCount": restaurantCount,
		"riderCount":      riderCount,
		"userCount":       userCount,
		"orderCound":      totalOrders,
	})
}
