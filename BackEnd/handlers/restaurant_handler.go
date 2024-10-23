package handlers

import (
	"context"
	"foodApp/database"
	"foodApp/models"
	"foodApp/utils"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

func AddRestaurant(c *gin.Context) {
	var restaurant models.Restaurant

	token := c.GetHeader("Authorization")

	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token messing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Invalid token"})
		return
	}

	if err := c.ShouldBindJSON(&restaurant); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	restaurant.ID = uuid.NewString()
	restaurant.UserId = claim.Subject
	collection := database.GetCollection("restaurants")
	ctx := context.Background()
	_, err = collection.InsertOne(ctx, restaurant)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "sucess", "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "sucess", "data": restaurant})
}

func GetAllRestaurant(c *gin.Context) {
	var restaurants []models.Restaurant

	collection := database.GetCollection("restaurants")
	ctx := context.Background()
	currsor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}
	defer currsor.Close(ctx)

	if err := currsor.All(ctx, &restaurants); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "sucess", "data": restaurants})
}

func AddProduct(c *gin.Context) {
	var product models.Product
	token := c.GetHeader("Authorization")

	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token messing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Invalid token"})
		return
	}

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	collection := database.GetCollection("products")
	ctx := context.Background()
	product.ID = uuid.NewString()
	product.RestaurantID = c.Param("id")
	product.UserId = claim.Subject
	_, err = collection.InsertOne(ctx, product)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	c.JSON(http.StatusBadRequest, gin.H{"status": "sucess", "data": product})
}

func GetAllProducts(c *gin.Context) {
	productList := make([]map[string]interface{}, 0)

	collection := database.GetCollection("products")
	ctx := context.Background()

	filter := bson.M{"restaurant_id": c.Param("id")}

	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var product models.Product
		err := cursor.Decode(&product)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
			return
		}

		categoryName, err := GetCategoryNameByID(product.CategoryId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
			return
		}

		productData := map[string]interface{}{
			"id":            product.ID,
			"name":          product.Name,
			"price":         product.Price,
			"image":         product.ImageURL,
			"category_name": categoryName,
			"rating":        product.Rating,
			"time":          product.Time,
		}
		productList = append(productList, productData)
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": productList})
}

func GetNearbyRestaurants(c *gin.Context) {
	userLat := c.Query("lat")
	userLng := c.Query("lng")

	if userLat == "" || userLng == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Latitude and Longitude required"})
		return
	}

	lat, _ := strconv.ParseFloat(userLat, 64)
	lng, _ := strconv.ParseFloat(userLng, 64)

	collection := database.GetCollection("restaurants")

	ctx := context.Background()
	cur, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": err.Error()})
		return
	}
	defer cur.Close(ctx)

	var nearbyRestaurants []models.Restaurant
	for cur.Next(ctx) {
		var restaurant models.Restaurant
		if err := cur.Decode(&restaurant); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		locationParts := strings.Split(restaurant.Location, ",")
		restLat, _ := strconv.ParseFloat(locationParts[0], 64)
		restLng, _ := strconv.ParseFloat(locationParts[1], 64)

		distance := utils.Haversine(lat, lng, restLat, restLng)

		if distance <= 10000 {
			nearbyRestaurants = append(nearbyRestaurants, restaurant)
		}
	}

	if len(nearbyRestaurants) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "No nearby restaurants found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": nearbyRestaurants})
}
