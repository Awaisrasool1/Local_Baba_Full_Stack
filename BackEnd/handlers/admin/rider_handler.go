package admin

import (
	"context"
	"foodApp/database"
	"foodApp/models"
	"foodApp/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

func Admin_add_rider(c *gin.Context) {
	var rider models.User

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

	if err := c.ShouldBind(&rider); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	var exsitUser models.User
	collection := database.GetCollection("user")
	ctx := context.Background()
	err = collection.FindOne(ctx, bson.M{"email": rider.Email}).Decode(&exsitUser)
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "email already exists"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(rider.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to hash password"})
		return
	}

	rider.Password = string(hashedPassword)
	rider.ID = uuid.NewString()
	rider.Role = 3

	_, err = collection.InsertOne(ctx, rider)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}

	rider.Password = ""
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Rider added successfully"})
}

func Get_admin_riders(c *gin.Context) {
	var riders []models.User

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

	totalItems, err := userCollection.CountDocuments(ctx, bson.M{"role": 3})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error counting documents"})
		return
	}

	cursor, err := userCollection.Find(ctx, bson.M{"role": 3}, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &riders); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	type RiderWithOrderCount struct {
		models.User `bson:",inline"`
		TotalOrders int64 `json:"totalOrders"`
	}

	var ridersWithOrders []RiderWithOrderCount
	for _, rider := range riders {
		orderCount, err := orderCollection.CountDocuments(ctx, bson.M{"rider_id": rider.ID})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error counting rider's orders"})
			return
		}
		ridersWithOrders = append(ridersWithOrders, RiderWithOrderCount{
			User:        rider,
			TotalOrders: orderCount,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"status":     "success",
		"data":       ridersWithOrders,
		"page":       page,
		"limit":      limit,
		"totalItems": totalItems,
	})
}
