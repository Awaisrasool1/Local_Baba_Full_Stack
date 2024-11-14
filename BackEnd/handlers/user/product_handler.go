package user

import (
	"context"
	"foodApp/database"
	"foodApp/models"
	"foodApp/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Get_user_products(c *gin.Context) {
	var products []models.Product

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

	id := c.Param("id")
	category := c.Query("category")

	filter := bson.M{"restaurant_id": id}
	if category != "All" && category != "" {
		filter["category"] = category
	}

	productCollection := database.GetCollection("product")
	ctx := context.Background()
	options := options.Find().
		SetSort(bson.D{{Key: "createdAt", Value: -1}})

	cursor, err := productCollection.Find(ctx, filter, options)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error fetching products"})
		return
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &products); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error parsing products"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"products": products,
	})
}

func Get_user_product_by_id(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token messing"})
		return
	}
	_, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid token"})
		return
	}
	var product models.Product
	collection := database.GetCollection("product")
	ctx := context.Background()
	err = collection.FindOne(ctx, bson.M{"_id": c.Param("id")}).Decode(&product)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "sucess", "data": product})
}
