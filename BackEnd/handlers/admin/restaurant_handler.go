package admin

import (
	"context"
	"foodApp/database"
	"foodApp/handlers"
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

func Admin_add_restaurant(c *gin.Context) {
	var inputData struct {
		Email         string `json:"email"  bson:"email" binding:"required"`
		Password      string `json:"password" bson:"password" binding:"required"`
		Phone         string `json:"phone" bson:"phone" binding:"required"`
		Name          string `json:"name" bson:"name" binding:"required"`
		ServiesTypeId string `json:"serviesTypeId" bson:"serviesTypeId" binding:"required"`
		Location      string `json:"location" bson:"location" binding:"required"`
		OpeningTime   string `json:"openingTime" bson:"openingTime"`
		ClosingTime   string `json:"closingTime" bson:"closingTime"`
		Address       string `json:"address" bson:"address"`
	}

	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token missing"})
		return
	}
	_, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Invalid token"})
		return
	}

	if err := c.ShouldBindJSON(&inputData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	ctx := context.Background()
	userCollection := database.GetCollection("user")
	var existingUser models.User
	err = userCollection.FindOne(ctx, bson.M{"email": inputData.Email}).Decode(&existingUser)
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "email already exists"})
		return
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(inputData.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to hash password"})
		return
	}

	id := uuid.NewString()

	user := models.User{
		ID:       id,
		Name:     inputData.Name,
		Email:    inputData.Email,
		Password: string(hashedPassword),
		Phone:    inputData.Phone,
		Role:     2,
	}

	serviceName, err := handlers.GetCategoryNameByID(inputData.ServiesTypeId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	restaurant := models.Restaurant{
		ID:            id,
		Name:          inputData.Name,
		ServiesTypeId: inputData.ServiesTypeId,
		ServiesType:   serviceName,
		Location:      inputData.Location,
		OpeningTime:   inputData.OpeningTime,
		ClosingTime:   inputData.ClosingTime,
		Address:       inputData.Address,
	}

	restaurantCollection := database.GetCollection("restaurants")

	_, err = userCollection.InsertOne(ctx, user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	_, err = restaurantCollection.InsertOne(ctx, restaurant)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Restaurant added successfully"})
}

func Get_admin_restaurant(c *gin.Context) {
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

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "5"))

	skip := (page - 1) * limit

	opts := options.Find().SetLimit(int64(limit)).SetSkip(int64(skip))

	collection := database.GetCollection("restaurants")
	ctx := context.Background()

	totalItems, err := collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Error counting documents"})
		return
	}
	cursor, err := collection.Find(ctx, bson.M{}, opts)
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
		"status":     "success",
		"data":       restaurants,
		"page":       page,
		"limit":      limit,
		"totalItems": totalItems,
	})
}
