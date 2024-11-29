package rider

import (
	"context"
	"foodApp/database"
	"foodApp/models"
	"foodApp/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

func Get_accepted_order(c *gin.Context) {
	token := c.GetHeader("Authorization")

	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Token missing"})
		return
	}

	_, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Invalid token"})
		return
	}

	ctx := context.Background()
	collection := database.GetCollection("order")
	restaurantCollection := database.GetCollection("restaurants")

	filter := bson.M{"status": "Accepted"}
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch orders"})
		return
	}
	defer cursor.Close(ctx)

	var orders []models.Order
	var restaurant models.Restaurant

	if err := cursor.All(ctx, &orders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to parse orders"})
		return
	}

	groupedOrders := make(map[string]gin.H)
	for _, order := range orders {
		if err := restaurantCollection.FindOne(ctx, bson.M{"_id": order.RestaurantID}).Decode(&restaurant); err == nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Restaurant not found"})
			return
		}
		if _, exists := groupedOrders[order.OrderID]; !exists {
			groupedOrders[order.OrderID] = gin.H{
				"orderId":           order.OrderID,
				"userLatLong":       order.LatLong,
				"restaurantLatLong": restaurant.Location,
				"restaurantName":    restaurant.Name,
				"totalPrice":        0.0,
				"status":            order.Status,
				"createdAt":         order.CreatedAt,
			}
		}

		groupedOrders[order.OrderID]["totalPrice"] = groupedOrders[order.OrderID]["totalPrice"].(float64) + order.Price
	}

	var response []gin.H
	for _, groupedOrder := range groupedOrders {
		response = append(response, groupedOrder)
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "data": response})
}

func Order_assigned_for_rider(c *gin.Context) {
	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token missing"})
		return
	}

	claims, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "invalid token"})
		return
	}

	var body struct {
		Id string `json:"id"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	collection := database.GetCollection("order")
	ctx := context.Background()

	riderID := (*claims)["userId"].(string)
	update := bson.M{
		"$set": bson.M{
			"status":   "Assigned",
			"rider_id": riderID,
		},
	}

	result, err := collection.UpdateMany(ctx, bson.M{"orderId": body.Id}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Order status updated successfully"})
}
