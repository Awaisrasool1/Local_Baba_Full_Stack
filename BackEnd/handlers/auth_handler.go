package handlers

import (
	"context"
	"foodApp/database"
	"foodApp/models"
	"foodApp/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("agfgdfdsgfdfgdertwcvb")

func SignUp(c *gin.Context) {
	var user models.User

	if err := c.ShouldBind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	collection := database.GetCollection("user")
	ctx := context.Background()
	var existingUser models.User
	err := collection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&existingUser)
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "user already registered"})
		return
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to hash password"})
		return
	}
	user.Password = string(hashedPassword)
	user.ID = uuid.NewString()

	_, err = collection.InsertOne(ctx, user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": err.Error()})
		return
	}
	user.Password = ""
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "User SignUp successfully"})
}

func SignIn(c *gin.Context) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	collection := database.GetCollection("user")
	ctx := context.Background()
	err := collection.FindOne(ctx, bson.M{"email": credentials.Email}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Invalid email"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(credentials.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Invalid password"})
		return
	}

	claims := jwt.MapClaims{
		"userId": user.ID,
		"role":   user.Role,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "User Login", "token": tokenString, "userId": user.ID, "name": user.Name, "role": user.Role})
}

func Get_Profile(c *gin.Context) {
	token := c.GetHeader("Authorization")
	var user models.User

	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token missing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid token"})
		return
	}
	userID := (*claim)["userId"].(string)
	collection := database.GetCollection("user")
	ctx := context.Background()

	err = collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "meesage": "user not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "success", "data": user})
}

func SaveFCMTokenHandler(c *gin.Context) {
	var input models.FCMToken

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	collection := database.GetCollection("fcm_tokens")
	var existingToken models.FCMToken
	ctx := context.Background()

	err := collection.FindOne(ctx, bson.M{"user_id": input.UserID}).Decode(&existingToken)
	if err == nil {
		_, err = collection.UpdateOne(
			ctx,
			bson.D{{Key: "user_id", Value: input.UserID}},
			bson.D{{Key: "$set", Value: bson.D{{Key: "fcm_token", Value: input.FCMToken}}}},
		)
		if err != nil {
			log.Println("Error updating FCM token:", err)
			c.JSON(http.StatusOK, gin.H{"status": "error", "message": err.Error()})
			return
		}
	} else if err == mongo.ErrNoDocuments {
		input.ID = uuid.NewString()
		_, err := collection.InsertOne(ctx, input)
		if err != nil {
			log.Println("Error inserting FCM token:", err)
			c.JSON(http.StatusOK, gin.H{"status": "error", "message": err.Error()})
			return
		}
	} else {
		log.Println("Error checking existing FCM token:", err)
		c.JSON(http.StatusOK, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "FCM token saved successfully"})
}

func GetFCMTokenHandler(c *gin.Context) {
	userID := c.Param("user_id")

	var result models.FCMToken
	collection := database.GetCollection("fcm_tokens")

	err := collection.FindOne(context.Background(), bson.M{"user_id": userID}).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusOK, gin.H{"status": "error", "message": err.Error()})
			return
		}
		log.Printf("Error retrieving FCM token: %v", err)
		c.JSON(http.StatusOK, gin.H{"status": "error", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "fcm_token": result})
}
