package restaurant

import (
	"context"
	"foodApp/database"
	"foodApp/handlers"
	"foodApp/models"
	"foodApp/utils"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Create_restaurant_product(c *gin.Context) {
	var product models.Product

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

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	CategoryName, _ := handlers.GetCategoryNameByID(product.CategoryId)
	product.CategoryName = CategoryName
	product.ID = uuid.NewString()
	product.RestaurantID = (*claim)["userId"].(string)
	product.CreatedAt = time.Now()
	product.UpdatedAt = time.Now()

	productCollection := database.GetCollection("product")
	ctx := context.Background()

	_, err = productCollection.InsertOne(ctx, product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error creating product"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "success", "message": "Product Add successfuly"})
}

func Get_restaurant_products(c *gin.Context) {
	var products []models.Product

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

	id := (*claim)["userId"].(string)
	page := c.DefaultQuery("page", "1")
	limit := c.DefaultQuery("limit", "10")
	category := c.Query("category")

	pageNum, _ := strconv.Atoi(page)
	limitNum, _ := strconv.Atoi(limit)
	skip := (pageNum - 1) * limitNum

	// Set base filter to fetch products by restaurant_id
	filter := bson.M{"restaurant_id": id}
	if category != "All" && category != "" {
		filter["category"] = category
	}

	productCollection := database.GetCollection("product")
	ctx := context.Background()
	options := options.Find().
		SetSkip(int64(skip)).
		SetLimit(int64(limitNum)).
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

	total, err := productCollection.CountDocuments(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error counting products"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"products": products,
		"total":    total,
		"page":     pageNum,
		"limit":    limitNum,
	})
}

func UpdateProduct(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product.UpdatedAt = time.Now()

	update := bson.M{
		"$set": product,
	}

	productCollection := database.GetCollection("product")
	ctx := context.Background()

	result, err := productCollection.UpdateOne(ctx, bson.M{"_id": id}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating product"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product updated successfully"})
}

func DeleteProduct(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	productCollection := database.GetCollection("product")
	ctx := context.Background()

	result, err := productCollection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting product"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}
