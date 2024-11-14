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
)

func AddToCart(c *gin.Context) {
	var cart models.Cart
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

	productCollection := database.GetCollection("product")
	ctx := context.Background()
	err = productCollection.FindOne(ctx, bson.M{"_id": c.Param("id")}).Decode(&product)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	carCollection := database.GetCollection("cart")
	cart.UserID = (*claim)["userId"].(string)
	err = carCollection.FindOne(ctx, bson.M{"user_id": (*claim)["userId"].(string), "product_id": c.Param("id")}).Decode(&cart)

	if err != nil {
		cart = models.Cart{
			ID:              uuid.NewString(),
			ProductID:       product.ID,
			UserID:          (*claim)["userId"].(string),
			Name:            product.Title,
			CategoryName:    product.CategoryName,
			OriginalPrice:   product.OriginalPrice,
			DiscountedPrice: product.DiscountedPrice,
			Image:           product.Image,
			Quantity:        1,
		}
		_, err := carCollection.InsertOne(ctx, cart)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": "success", "Message": "Product added to cart successfully"})
	} else {
		cart.Quantity += 1

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
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "token missing"})
		return
	}
	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "invalid token"})
		return
	}

	userID := (*claim)["userId"].(string)
	ctx := context.Background()
	collection := database.GetCollection("cart")
	cursor, err := collection.Find(ctx, bson.M{"user_id": userID})

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &cart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	type CartItemResponse struct {
		models.Cart
		ItemTotalPrice float64 `json:"itemTotalPrice" bson:"itemTotalPrice"`
	}

	var cartResponse []CartItemResponse
	var totalPrice float64

	for _, item := range cart {
		itemTotalPrice := item.DiscountedPrice * float64(item.Quantity)
		totalPrice += itemTotalPrice

		cartResponse = append(cartResponse, CartItemResponse{
			Cart:           item,
			ItemTotalPrice: itemTotalPrice,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"status":     "success",
		"data":       cartResponse,
		"totalPrice": totalPrice,
	})
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

	userID := (*claim)["userId"].(string)
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

	c.JSON(http.StatusOK, gin.H{"Status": "Success", "Message": "quantity add successfully"})
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

	userID := (*claim)["userId"].(string)
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

	c.JSON(http.StatusOK, gin.H{"Status": "Success", "Message": "quantity remove successfully"})
}
