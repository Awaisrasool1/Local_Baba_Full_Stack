package user

import (
	"context"
	"foodApp/database"
	"foodApp/models"
	"foodApp/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func Add_user_address(c *gin.Context) {
	var address models.Address
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

	if err := c.ShouldBindJSON(&address); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	userID := (*claim)["userId"].(string)
	address.ID = uuid.NewString()
	address.UserId = userID

	collection := database.GetCollection("address")
	ctx := context.Background()

	filter := bson.M{"userId": userID, "isDefaultShiping": true}
	update := bson.M{"$set": bson.M{"isDefaultShiping": false}}

	var existingAddress models.Address
	err = collection.FindOne(ctx, filter).Decode(&existingAddress)
	if err == nil {
		_, err = collection.UpdateOne(ctx, filter, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "could not update default address"})
			return
		}
	}

	address.IsDefaultShipping = true

	_, err = collection.InsertOne(ctx, address)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "could not add address"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "address add successfuly"})
}

func UpdateDefaultAddress(c *gin.Context) {
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

	userID := (*claim)["userId"].(string)
	collection := database.GetCollection("address")
	ctx := context.Background()

	filter := bson.M{"userId": userID, "isDefaultShiping": true}
	update := bson.M{"$set": bson.M{"isDefaultShiping": false}}
	_, err = collection.UpdateOne(ctx, filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "could not update default address"})
		return
	}

	newDefaultFilter := bson.M{"_id": c.Param("id"), "userId": userID}
	newDefaultUpdate := bson.M{"$set": bson.M{"isDefaultShiping": true}}
	_, err = collection.UpdateOne(ctx, newDefaultFilter, newDefaultUpdate)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "could not set new default address"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "default address updated"})
}

func Get_user_address(c *gin.Context) {
	var adress []models.Address
	token := c.GetHeader("Authorization")

	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token messing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid token"})
		return
	}

	userID := (*claim)["userId"].(string)

	collection := database.GetCollection("address")
	ctx := context.Background()

	cursor, err := collection.Find(ctx, bson.M{"userId": userID})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &adress); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "sucess", "data": adress})
}

func Get_user_default_address(c *gin.Context) {
	var address models.Address
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

	userID := (*claim)["userId"].(string)

	collection := database.GetCollection("address")
	ctx := context.Background()
	filter := bson.M{"userId": userID, "isDefaultShipping": true}

	err = collection.FindOne(ctx, filter).Decode(&address)

	if err == mongo.ErrNoDocuments {
		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "No default address found",
			"data":    nil,
		})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "internal server error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   address,
	})
}

func Delete_user_address(c *gin.Context) {
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

	userID := (*claim)["userId"].(string)
	addressID := c.Param("id")

	collection := database.GetCollection("address")
	ctx := context.Background()

	filter := bson.M{"_id": addressID, "userId": userID}
	var address models.Address
	err = collection.FindOne(ctx, filter).Decode(&address)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "address not found or unauthorized"})
		return
	}

	_, err = collection.DeleteOne(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "could not delete address"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "address deleted successfully"})
}
