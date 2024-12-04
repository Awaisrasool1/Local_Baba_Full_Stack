package restaurant

import (
	"context"
	"foodApp/database"
	"foodApp/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func Get_restu_dashboard_counts(c *gin.Context) {
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

	ctx := context.Background()
	restaurantId := (*claim)["userId"].(string)

	totalOrders, err := getTotalOrders(ctx, database.GetCollection("order"), restaurantId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to count total orders"})
		return
	}

	acceptedOrders, err := getAcceptedOrders(ctx, database.GetCollection("order"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to count accepted orders"})
		return
	}

	pendingOrders, err := getPendingOrders(ctx, database.GetCollection("order"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to count pending orders"})
		return
	}

	totalProducts, err := getTotalProducts(ctx, database.GetCollection("product"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to count total products"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":         "success",
		"totalOrders":    totalOrders,
		"acceptedOrders": acceptedOrders,
		"pendingOrders":  pendingOrders,
		"totalProducts":  totalProducts,
	})
}

func getTotalOrders(ctx context.Context, collection *mongo.Collection, restaurantId string) (int, error) {
	pipeline := mongo.Pipeline{
		{
			{Key: "$match", Value: bson.D{
				{Key: "restaurantId", Value: restaurantId},
				{Key: "status", Value: bson.M{"$in": []string{"Delivered", "Cancelled"}}},
			}},
		},
		{
			{Key: "$sort", Value: bson.D{
				{Key: "createdAt", Value: -1},
			}},
		},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return 0, err
	}
	defer cursor.Close(ctx)

	var result []bson.M
	if err = cursor.All(ctx, &result); err != nil {
		return 0, err
	}

	if len(result) > 0 {
		if totalOrders, ok := result[0]["totalOrders"].(int64); ok {
			return int(totalOrders), nil
		}
	}

	return 0, nil
}

func getAcceptedOrders(ctx context.Context, collection *mongo.Collection) (int, error) {
	pipeline := mongo.Pipeline{
		{
			{Key: "$match", Value: bson.D{
				{Key: "status", Value: "Accepted"},
			}},
		},
		{
			{Key: "$group", Value: bson.D{
				{Key: "_id", Value: "$orderId"},
			}},
		},
		{
			{Key: "$count", Value: "acceptedOrders"},
		},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return 0, err
	}
	defer cursor.Close(ctx)

	var result []bson.M
	if err = cursor.All(ctx, &result); err != nil {
		return 0, err
	}

	if len(result) > 0 {
		if acceptedOrders, ok := result[0]["acceptedOrders"].(int32); ok {
			return int(acceptedOrders), nil
		}
	}

	return 0, nil
}

func getPendingOrders(ctx context.Context, collection *mongo.Collection) (int, error) {
	pipeline := mongo.Pipeline{
		{
			{Key: "$match", Value: bson.D{
				{Key: "status", Value: "Pending"},
			}},
		},
		{
			{Key: "$group", Value: bson.D{
				{Key: "_id", Value: "$orderId"},
			}},
		},
		{
			{Key: "$count", Value: "pendingOrders"},
		},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return 0, err
	}
	defer cursor.Close(ctx)

	var result []bson.M
	if err = cursor.All(ctx, &result); err != nil {
		return 0, err
	}

	if len(result) > 0 {
		if pendingOrders, ok := result[0]["pendingOrders"].(int32); ok {
			return int(pendingOrders), nil
		}
	}

	return 0, nil
}

func getTotalProducts(ctx context.Context, collection *mongo.Collection) (int, error) {
	count, err := collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		return 0, err
	}
	return int(count), nil
}
