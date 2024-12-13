package user

import (
	"context"
	"fmt"
	"foodApp/database"
	"foodApp/envConfig"
	"foodApp/models"
	"foodApp/utils"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type Input struct {
	LatLong          string `json:"latLong"`
	Quantity         int    `json:"quantity"`
	IsDefaultAddress bool   `json:"isDefaultAddress"`
}

func AddOrderByCart(c *gin.Context) {
	token := c.GetHeader("Authorization")
	var input Input

	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "token missing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "invalid token"})
		return
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	userObjectID := (*claim)["userId"].(string)

	ctx := context.Background()
	cartCollection := database.GetCollection("cart")
	orderCollection := database.GetCollection("order")
	productCollection := database.GetCollection("product")
	addressCollection := database.GetCollection("address")

	cartItems, err := cartCollection.Find(ctx, bson.M{"user_id": userObjectID})
	if err != nil {
		log.Println("Error fetching cart items:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch cart items"})
		return
	}
	defer cartItems.Close(ctx)

	orderID := fmt.Sprintf("#%08d", rand.Intn(90000000)+10000000)

	log.Println("Generated Order ID:", orderID)

	var orders []interface{}
	var overallTotalBill float64

	var finalLatLong string

	if input.IsDefaultAddress {
		var userAddress struct {
			LatLong string `json:"latlong"`
		}
		err := addressCollection.FindOne(ctx, bson.M{"userId": userObjectID}).Decode(&userAddress)
		if err != nil {
			log.Println("Error fetching address:", err)
			c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "default Address not found"})
			return
		}
		finalLatLong = userAddress.LatLong
	} else {
		finalLatLong = input.LatLong
	}

	for cartItems.Next(ctx) {
		var cartItem models.Cart
		if err := cartItems.Decode(&cartItem); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode cart item"})
			return
		}

		price := cartItem.DiscountedPrice
		if price == 0 {
			price = cartItem.OriginalPrice
		}
		totalBill := float64(cartItem.Quantity) * price
		overallTotalBill += totalBill

		var product models.Product
		err := productCollection.FindOne(ctx, bson.M{"_id": cartItem.ProductID}).Decode(&product)
		if err != nil {
			log.Println("Error fetching product details:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch product details"})
			return
		}

		order := models.Order{
			OrderID:          orderID,
			ID:               uuid.NewString(),
			UserID:           cartItem.UserID,
			ProductID:        cartItem.ProductID,
			RestaurantID:     product.RestaurantID,
			Quantity:         cartItem.Quantity,
			Price:            price,
			LatLong:          finalLatLong,
			TotalBill:        totalBill,
			Status:           "Pending",
			ItemName:         product.Title,
			IsDefaultAddress: input.IsDefaultAddress,
			DeliveryFee:      100,
			CreatedAt:        time.Now(),
		}

		orders = append(orders, order)
	}

	if len(orders) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "No items in cart to place an order"})
		return
	}

	_, err = orderCollection.InsertMany(ctx, orders)
	if err != nil {
		log.Println("InsertMany Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to place orders", "error": err.Error()})
		return
	}

	// Optionally, clear cart items after placing an order (if desired)
	// _, err = cartCollection.DeleteMany(ctx, bson.M{"user_id": userObjectID})
	// if err != nil {
	// 	log.Println("Error clearing cart:", err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to clear cart"})
	// 	return
	// }

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Order placed successfully!",
		"orderID": orderID,
	})
}

func AddOrderByProduct(c *gin.Context) {
	token := c.GetHeader("Authorization")
	var input models.Order

	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "token missing"})
		return
	}

	claim, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "invalid token"})
		return
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": err.Error()})
		return
	}

	productID := c.Param("id")
	userObjectID := (*claim)["userId"].(string)

	ctx := context.Background()
	orderCollection := database.GetCollection("order")
	productCollection := database.GetCollection("product")
	addressCollection := database.GetCollection("address")

	var product models.Product
	err = productCollection.FindOne(ctx, bson.M{"_id": productID}).Decode(&product)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch product details"})
		return
	}

	orderID := fmt.Sprintf("#%08d", rand.Intn(90000000)+10000000)

	if product.ID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Product not found"})
		return
	}

	priceToUse := product.DiscountedPrice
	if priceToUse == 0 {
		priceToUse = product.OriginalPrice
	}

	totalPrice := float64(input.Quantity) * priceToUse

	var finalLatLong string

	if input.IsDefaultAddress {
		var userAddress struct {
			LatLong string `json:"latlong"`
		}
		err := addressCollection.FindOne(ctx, bson.M{"userId": userObjectID}).Decode(&userAddress)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "default Address not found"})
			return
		}
		finalLatLong = userAddress.LatLong
	} else {
		finalLatLong = input.LatLong
	}

	newOrder := models.Order{
		ID:               uuid.NewString(),
		OrderID:          orderID,
		UserID:           userObjectID,
		ProductID:        productID,
		RestaurantID:     product.RestaurantID,
		Quantity:         input.Quantity,
		Price:            priceToUse,
		TotalBill:        totalPrice,
		Status:           "Pending",
		CreatedAt:        time.Now(),
		LatLong:          finalLatLong,
		ItemName:         product.Title,
		IsDefaultAddress: input.IsDefaultAddress,
		DeliveryFee:      100,
	}

	_, err = orderCollection.InsertOne(ctx, newOrder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to place order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Order placed successfully!",
		"orderID": newOrder.OrderID,
	})
}

func GetOrderStatus(c *gin.Context) {
	type OrderResponse struct {
		Status     string `json:"status"`
		StatusCode int    `json:"status_code"`
	}

	orderId := c.Query("orderId")
	if orderId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "missing orderId"})
		return
	}

	if !strings.HasPrefix(orderId, "#") {
		orderId = "#" + orderId
	}

	token := c.GetHeader("Authorization")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "token missing"})
		return
	}

	_, err := utils.ValidateToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "message": "invalid token"})
		return
	}

	orderCollection := database.GetCollection("order")
	ctx := context.Background()
	var order models.Order

	err = orderCollection.FindOne(ctx, bson.M{"orderId": orderId}).Decode(&order)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Something went wrong"})
		return
	}

	if order.Status == "Cancelled" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Order has been cancelled",
		})
		return
	}

	statusCode := 0
	switch order.Status {
	case "Pending":
		statusCode = -1
	case "Accepted":
		statusCode = 0
	case "Assigned":
		statusCode = 1
	case "Delivered":
		statusCode = 2
	}

	response := OrderResponse{
		Status:     order.Status,
		StatusCode: statusCode,
	}

	c.JSON(http.StatusOK, response)
}

func Get_user_ongoing_order(c *gin.Context) {
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

	userId := (*claim)["userId"].(string)
	ctx := context.Background()

	orderCollection := database.GetCollection("order")
	productCollection := database.GetCollection("product")
	restaurantCollection := database.GetCollection("restaurants")

	filter := bson.M{
		"user_id": userId,
		"status":  bson.M{"$in": []string{"Pending", "Accepted", "Assigned"}},
	}
	cursor, err := orderCollection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch orders"})
		return
	}
	defer cursor.Close(ctx)

	var orders []models.Order
	if err := cursor.All(ctx, &orders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to decode orders"})
		return
	}

	productCache := make(map[string]struct {
		Title string
		Image string
	})
	restaurantCache := make(map[string]string)

	groupedOrders := make(map[string]*models.GroupedOrder)

	for _, order := range orders {
		orderID := order.OrderID
		restaurantID := order.RestaurantID

		restaurantName, exists := restaurantCache[restaurantID]
		if !exists {
			restaurantData := bson.M{}
			if err := restaurantCollection.FindOne(ctx, bson.M{"_id": restaurantID}).Decode(&restaurantData); err == nil {
				restaurantName, _ = restaurantData["name"].(string)
				restaurantCache[restaurantID] = restaurantName
			} else {
				log.Printf("Error fetching restaurant details for ID %s: %v", restaurantID, err)
				restaurantName = "Unknown Restaurant"
			}
		}

		productDetails, exists := productCache[order.ProductID]
		if !exists {
			var product struct {
				Title string `bson:"title"`
				Image string `bson:"image"`
			}
			err := productCollection.FindOne(ctx, bson.M{"_id": order.ProductID}).Decode(&product)
			if err != nil {
				log.Printf("Error fetching product details for ID %s: %v", order.ProductID, err)
				continue
			}
			productDetails = struct {
				Title string
				Image string
			}{
				Title: product.Title,
				Image: product.Image,
			}
			productCache[order.ProductID] = productDetails
		}

		// Group orders
		if _, exists := groupedOrders[orderID]; !exists {
			groupedOrders[orderID] = &models.GroupedOrder{
				CreatedAt:      order.CreatedAt,
				OrderId:        order.OrderID,
				RestaurantName: restaurantName,
				Status:         order.Status,
				Name:           "",
				Image:          "",
				Quantity:       0,
				Price:          0,
				TotalAmount:    0.0,
				TotalItems:     0,
				DeliveryFee:    order.DeliveryFee,
			}
		}

		groupedOrder := groupedOrders[orderID]

		if groupedOrder.Name == "" {
			groupedOrder.Name = productDetails.Title
			groupedOrder.Image = productDetails.Image
		}

		groupedOrder.Quantity += order.Quantity
		groupedOrder.Price = order.Price
		groupedOrder.TotalAmount += order.TotalBill
		groupedOrder.TotalItems++
	}

	// Prepare response
	var response []models.GroupedOrder
	for _, groupedOrder := range groupedOrders {
		groupedOrder.TotalAmount = groupedOrder.TotalAmount + groupedOrder.DeliveryFee
		response = append(response, *groupedOrder)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   response,
	})
}

func Get_past_order(c *gin.Context) {
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

	userId := (*claim)["userId"].(string)
	ctx := context.Background()

	orderCollection := database.GetCollection("order")
	productCollection := database.GetCollection("product")
	restaurantCollection := database.GetCollection("restaurants")

	filter := bson.M{
		"user_id": userId,
		"status":  bson.M{"$in": []string{"Cancelled", "Delivered"}},
	}

	cursor, err := orderCollection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch orders"})
		return
	}
	defer cursor.Close(ctx)

	var orders []models.Order
	if err := cursor.All(ctx, &orders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to decode orders"})
		return
	}

	productCache := make(map[string]struct {
		Title string
		Image string
	})
	restaurantCache := make(map[string]string)

	groupedOrders := make(map[string]*models.GroupedOrder)

	for _, order := range orders {
		orderID := order.OrderID
		restaurantID := order.RestaurantID

		restaurantName, exists := restaurantCache[restaurantID]
		if !exists {
			restaurantData := bson.M{}
			if err := restaurantCollection.FindOne(ctx, bson.M{"_id": restaurantID}).Decode(&restaurantData); err == nil {
				restaurantName, _ = restaurantData["name"].(string)
				restaurantCache[restaurantID] = restaurantName
			} else {
				log.Printf("Error fetching restaurant details for ID %s: %v", restaurantID, err)
				restaurantName = "Unknown Restaurant"
			}
		}

		productDetails, exists := productCache[order.ProductID]
		if !exists {
			var product struct {
				Title string `bson:"title"`
				Image string `bson:"image"`
			}
			err := productCollection.FindOne(ctx, bson.M{"_id": order.ProductID}).Decode(&product)
			if err != nil {
				log.Printf("Error fetching product details for ID %s: %v", order.ProductID, err)
				continue
			}
			productDetails = struct {
				Title string
				Image string
			}{
				Title: product.Title,
				Image: product.Image,
			}
			productCache[order.ProductID] = productDetails
		}

		if _, exists := groupedOrders[orderID]; !exists {
			groupedOrders[orderID] = &models.GroupedOrder{
				CreatedAt:      order.CreatedAt,
				OrderId:        order.OrderID,
				RestaurantName: restaurantName,
				Status:         order.Status,
				Name:           "",
				Image:          "",
				Quantity:       0,
				Price:          0,
				TotalAmount:    0.0,
				TotalItems:     0,
				DeliveryFee:    order.DeliveryFee,
			}
		}

		groupedOrder := groupedOrders[orderID]

		if groupedOrder.Name == "" {
			groupedOrder.Name = productDetails.Title
			groupedOrder.Image = productDetails.Image
		}

		groupedOrder.Quantity += order.Quantity
		groupedOrder.Price = order.Price
		groupedOrder.TotalAmount += order.TotalBill
		groupedOrder.TotalItems++
	}

	var response []models.GroupedOrder
	for _, groupedOrder := range groupedOrders {
		groupedOrder.TotalAmount = groupedOrder.TotalAmount + groupedOrder.DeliveryFee
		response = append(response, *groupedOrder)
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   response,
	})
}

func Order_cancel(c *gin.Context) {
	var body struct {
		Id string `json:"id"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	collection := database.GetCollection("order")
	ctx := context.Background()

	update := bson.M{
		"$set": bson.M{
			"status": "Cancelled",
		},
	}

	result, err := collection.UpdateMany(ctx, bson.M{"orderId": body.Id}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Order status updated successfully"})
}
func Get_order_details_byID(c *gin.Context) {
	_, _, _, _, apiKey, _, _ := envConfig.GetEnvVars()

	type OrderItem struct {
		Name       string  `json:"name"`
		Price      float64 `json:"price"`
		Image      string  `json:"image"`
		TotalPrice float64 `json:"totalPrice"`
		Quantity   int     `json:"quantity"`
	}

	type OrderResponse struct {
		RestaurantImage string      `json:"restaurantImage"`
		RestaurantName  string      `json:"restaurantName"`
		PlacedTime      time.Time   `json:"placedTime"`
		OrderID         string      `json:"orderId"`
		Address         string      `json:"address"`
		ItemPrice       float64     `json:"itemPrice"`
		TotalPrice      float64     `json:"totalPrice"`
		DeliveryFee     float64     `json:"deliveryFee"`
		Items           []OrderItem `json:"items"`
	}
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

	userId := (*claim)["userId"].(string)
	orderId := c.Query("orderId")
	if orderId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "missing orderId"})
		return
	}

	if !strings.HasPrefix(orderId, "#") {
		orderId = "#" + orderId
	}

	ctx := context.Background()

	orderCollection := database.GetCollection("order")
	productCollection := database.GetCollection("product")
	restaurantCollection := database.GetCollection("restaurants")
	addressCollection := database.GetCollection("address")

	filter := bson.M{
		"user_id": userId,
		"orderId": orderId,
	}

	cursor, err := orderCollection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to fetch orders"})
		return
	}
	defer cursor.Close(ctx)

	var orders []models.Order
	if err := cursor.All(ctx, &orders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to decode orders"})
		return
	}

	if len(orders) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Order not found"})
		return
	}

	productCache := make(map[string]ProductDetails)
	restaurantCache := make(map[string]string)

	orderResponse := OrderResponse{
		OrderID:    orderId,
		PlacedTime: orders[0].CreatedAt,
	}

	itemMap := make(map[string]*OrderItem)
	totalItemPrice := 0.0

	for _, order := range orders {
		var city, fullAddress string
		if order.IsDefaultAddress {
			var address bson.M
			err := addressCollection.FindOne(ctx, bson.M{"userId": order.UserID, "isDefaultShipping": true}).Decode(&address)
			if err != nil {
				log.Printf("Error fetching address for user %s: %v", order.UserID, err)
				return
			}
			city = address["city"].(string)
			fullAddress = address["fullAddress"].(string)
		} else {
			city, fullAddress, err = utils.GetCityAndAddressFromLatLong(order.LatLong, apiKey)
			if err != nil {
				log.Printf("Error fetching address from LatLong: %v", err)
				continue
			}
		}

		orderResponse.Address = city + fullAddress

		if orderResponse.RestaurantName == "" {
			restaurantName, exists := restaurantCache[order.RestaurantID]
			var restaurantImage string
			if !exists {
				restaurantData := bson.M{}
				if err := restaurantCollection.FindOne(ctx, bson.M{"_id": order.RestaurantID}).Decode(&restaurantData); err == nil {
					restaurantName, _ = restaurantData["name"].(string)
					restaurantImage, _ = restaurantData["image"].(string)
					restaurantCache[order.RestaurantID] = restaurantName
				}
				orderResponse.RestaurantName = restaurantName
				orderResponse.RestaurantImage = restaurantImage
			}
		}

		productDetails, exists := productCache[order.ProductID]
		if !exists {
			productDetails = fetchProductDetails(ctx, productCollection, order.ProductID)
			productCache[order.ProductID] = productDetails
		}

		if existingItem, ok := itemMap[order.ProductID]; ok {
			existingItem.Quantity += order.Quantity
		} else {
			totalPrice := float64(order.Quantity) * order.Price
			newItem := OrderItem{
				Name:       productDetails.Title,
				Price:      order.Price,
				Image:      productDetails.Image,
				Quantity:   order.Quantity,
				TotalPrice: totalPrice,
			}
			itemMap[order.ProductID] = &newItem
		}

		totalItemPrice += order.Price * float64(order.Quantity)
	}

	for _, item := range itemMap {
		orderResponse.Items = append(orderResponse.Items, *item)
	}

	orderResponse.ItemPrice = totalItemPrice
	orderResponse.DeliveryFee = 100
	orderResponse.TotalPrice = totalItemPrice + orderResponse.DeliveryFee

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   orderResponse,
	})
}

type ProductDetails struct {
	Title string
	Image string
}

func fetchProductDetails(ctx context.Context, productCollection *mongo.Collection, productID string) ProductDetails {
	var product struct {
		Title string `bson:"title"`
		Image string `bson:"image"`
	}
	err := productCollection.FindOne(ctx, bson.M{"_id": productID}).Decode(&product)
	if err != nil {
		log.Printf("Error fetching product details for ID %s: %v", productID, err)
		return ProductDetails{
			Title: "Unknown Product",
			Image: "",
		}
	}
	return ProductDetails{
		Title: product.Title,
		Image: product.Image,
	}
}
