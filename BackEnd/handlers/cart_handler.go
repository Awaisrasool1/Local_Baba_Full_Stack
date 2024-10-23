package handlers

import (
	"context"
	"foodApp/database"
	"foodApp/models"
	"foodApp/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

func AddToCart(c *gin.Context) {
	var cart models.Cart
	var cartItem models.CartItem
	var product models.Product

	token := c.GetHeader("Authorization")

	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token messing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "Invalid token"})
		return
	}
	if err := c.ShouldBindJSON(&cartItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	productCollection := database.GetCollection("products")
	ctx := context.Background()
	err = productCollection.FindOne(ctx, bson.M{"_id": cartItem.ProductId}).Decode(&product)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	carCollection := database.GetCollection("cart")
	cart.UserID = claim.Subject
	err = carCollection.FindOne(ctx, bson.M{"user_id": claim.Subject, "product_id": cartItem.ProductId}).Decode(&cart)
	if err != nil {
		cart = models.Cart{
			ID:        uuid.NewString(),
			ProductID: product.ID,
			UserID:    claim.Subject,
			Name:      product.Name,
			Price:     product.Price,
			Image:     product.ImageURL,
			Quantity:  cartItem.Quantity,
		}
		_, err := carCollection.InsertOne(ctx, cart)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": "success", "Message": "Product added to cart successfully"})
	} else {
		cart.Quantity += cartItem.Quantity

		_, err = carCollection.UpdateOne(ctx, bson.M{"_id": cart.ID}, bson.M{
			"$set": bson.M{
				"quantity": cart.Quantity,
			},
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"Status": "Success", "Message": "Product add to cart successfully"})
	}

}

func GetAllCartItem(c *gin.Context) {
	var cart []models.Cart
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
	userID := claim.Subject
	ctx := context.Background()
	collection := database.GetCollection("cart")
	currsor, err := collection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	defer currsor.Close(ctx)
	if err := currsor.All(ctx, &cart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "sucess", "data": cart})

}
func AddQuantity(c *gin.Context) {
	var cart models.Cart

	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "token messing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "invalid token"})
		return
	}

	userID := claim.Subject
	collection := database.GetCollection("cart")
	ctx := context.Background()
	err = collection.FindOne(ctx, bson.M{"user_id": userID, "product_id": c.Param("id")}).Decode(&cart)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "product not found"})
		return
	}
	cart.Quantity += 1

	_, err = collection.UpdateOne(ctx, bson.M{"_id": cart.ID}, bson.M{
		"$set": bson.M{
			"quantity": cart.Quantity,
		},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Status": "Success", "Message": "Product add to cart successfully"})
}

func RemoveQuantity(c *gin.Context) {
	var cart models.Cart

	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "token messing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "invalid token"})
		return
	}

	userID := claim.Subject
	collection := database.GetCollection("cart")
	ctx := context.Background()
	err = collection.FindOne(ctx, bson.M{"user_id": userID, "product_id": c.Param("id")}).Decode(&cart)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "product not found"})
		return
	}
	cart.Quantity -= 1

	_, err = collection.UpdateOne(ctx, bson.M{"_id": cart.ID}, bson.M{
		"$set": bson.M{
			"quantity": cart.Quantity,
		},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Status": "Success", "Message": "Product add to cart successfully"})
}
