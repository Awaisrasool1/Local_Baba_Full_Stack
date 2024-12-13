package rider

import (
	"context"
	"fmt"
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
		fmt.Println("Token missing in request header")
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token missing"})
		return
	}

	fmt.Println("Token received:", token)

	claim, err := utils.ValidateToken(token)
	if err != nil {
		fmt.Println("Invalid token:", err)
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid token"})
		return
	}
	riderID := (*claim)["userId"].(string)
	fmt.Println("Validated Rider ID:", riderID)

	ctx := context.Background()
	collection := database.GetCollection("order")

	endDate := time.Now().Truncate(24 * time.Hour)
	startDate := endDate.AddDate(0, 0, -6)

	fmt.Println("Date Range - Start:", startDate, "End:", endDate)

	pipeline := mongo.Pipeline{
		bson.D{
			{Key: "$match", Value: bson.M{
				"rider_id": riderID,
				"status":   "Delivered",
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
					"$sum": 100,
				},
			}},
		},
		bson.D{
			{Key: "$sort", Value: bson.M{"_id": 1}},
		},
	}

	fmt.Println("Aggregation pipeline:", pipeline)

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		fmt.Println("Error in aggregation:", err)
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
			fmt.Println("Error decoding cursor data:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to decode data"})
			return
		}
		fmt.Println("Decoded record:", result)
		mongoData[result.ID] = result.TotalMargin
	}

	fmt.Println("Mongo data:", mongoData)

	response := []MarginData{}
	var totalMargin float64
	for i := 0; i < 7; i++ {
		date := startDate.AddDate(0, 0, i).Format("2006-01-02")
		margin := mongoData[date]
		response = append(response, MarginData{
			Date:   date,
			Margin: margin,
		})
		totalMargin += margin
		fmt.Printf("Prepared response for date: %s, margin: %f\n", date, margin)
	}

	fmt.Println("Final response data:", response)
	fmt.Printf("Total margin: %f\n", totalMargin)

	c.JSON(http.StatusOK, gin.H{
		"status":      "success",
		"data":        response,
		"totalMargin": totalMargin,
	})
}
