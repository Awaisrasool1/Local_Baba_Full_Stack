package rider

import (
	"context"
	"foodApp/database"
	"foodApp/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type MarginData struct {
	Date   string  `json:"date"`
	Margin float64 `json:"margin"`
}

type Response struct {
	Status string       `json:"status"`
	Data   []MarginData `json:"data"`
}

func RiderDashboardChart(c *gin.Context) {
	token := c.GetHeader("Authorization")

	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token missing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid token"})
		return
	}
	riderID := (*claim)["userId"].(string)

	ctx := context.Background()
	collection := database.GetCollection("order")

	endDate := time.Now().Truncate(24 * time.Hour)
	startDate := endDate.AddDate(0, 0, -6)

	pipeline := mongo.Pipeline{
		bson.D{
			{Key: "$match", Value: bson.M{
				"rider_id": riderID,
				"createdAt": bson.M{
					"$gte": startDate,
					"$lte": endDate,
				},
			}},
		},
		bson.D{
			{Key: "$group", Value: bson.M{
				"_id": bson.M{
					"$dateToString": bson.M{
						"format": "%Y-%m-%d",
						"date":   "$createdAt",
					},
				},
				"total_margin": bson.M{
					"$sum": bson.M{
						"$add": []interface{}{"$total_bill", 150},
					},
				},
			}},
		},
		bson.D{
			{Key: "$sort", Value: bson.M{"_id": 1}},
		},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch data"})
		return
	}
	defer cursor.Close(ctx)

	mongoData := make(map[string]float64)
	for cursor.Next(ctx) {
		var result struct {
			ID          string  `bson:"_id"`
			TotalMargin float64 `bson:"total_margin"`
		}
		if err := cursor.Decode(&result); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to decode data"})
			return
		}
		mongoData[result.ID] = result.TotalMargin
	}

	response := []MarginData{}
	for i := 0; i < 7; i++ {
		date := startDate.AddDate(0, 0, i).Format("2006-01-02")
		margin := mongoData[date]
		response = append(response, MarginData{
			Date:   date,
			Margin: margin,
		})
	}

	c.JSON(http.StatusOK, Response{
		Status: "success",
		Data:   response,
	})
}
