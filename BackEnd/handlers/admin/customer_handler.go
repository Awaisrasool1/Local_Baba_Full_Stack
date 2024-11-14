package admin

import (
	"context"
	"foodApp/database"
	"foodApp/models"
	"foodApp/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Get_admin_customers(c *gin.Context) {
	var customers []models.User

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

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "5"))
	skip := (page - 1) * limit

	opts := options.Find().SetLimit(int64(limit)).SetSkip(int64(skip))

	userCollection := database.GetCollection("user")
	orderCollection := database.GetCollection("order")
	ctx := context.Background()

	totalItems, err := userCollection.CountDocuments(ctx, bson.M{"role": 4})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error counting documents"})
		return
	}

	cursor, err := userCollection.Find(ctx, bson.M{"role": 4}, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &customers); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	type CustomerWithOrderCount struct {
		models.User `bson:",inline"`
		TotalOrders int64 `json:"totalOrders"`
	}

	var customersWithOrders []CustomerWithOrderCount
	for _, customer := range customers {
		orderCount, err := orderCollection.CountDocuments(ctx, bson.M{"user_id": customer.ID})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error counting customer's orders"})
			return
		}

		customersWithOrders = append(customersWithOrders, CustomerWithOrderCount{
			User:        customer,
			TotalOrders: orderCount,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"status":     "success",
		"data":       customersWithOrders,
		"page":       page,
		"limit":      limit,
		"totalItems": totalItems,
	})
}
