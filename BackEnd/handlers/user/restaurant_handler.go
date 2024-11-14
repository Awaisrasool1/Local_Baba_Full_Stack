package user

import (
	"context"
	"foodApp/database"
	"foodApp/models"
	"foodApp/utils"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func Get_user_restaurant(c *gin.Context) {
	var restaurants []models.Restaurant

	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token messing"})
		return
	}
	_, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "invalid token"})
		return
	}
	collection := database.GetCollection("restaurants")
	ctx := context.Background()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &restaurants); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   restaurants,
	})
}

func Get_user_nearby_restaurants(c *gin.Context) {
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
