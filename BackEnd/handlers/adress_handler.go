package handlers

import (
	"context"
	"foodApp/database"
	"foodApp/models"
	"foodApp/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func AdressAdd(c *gin.Context) {
	token := c.GetHeader("Authorization")
	var adress models.Address
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token messing"})
		return
	}
	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid token"})
		return
	}
	if err := c.ShouldBindJSON(&adress); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	userID := claim.Subject
	adress.ID = uuid.NewString()
	adress.UserId = userID

	collection := database.GetCollection("Adress")
	ctx := context.Background()

	_, err = collection.InsertOne(ctx, adress)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "sucess", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "sucess", "data": adress})
}
