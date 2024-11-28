package models

import "time"

type FoodOrder struct {
	ID           string   `json:"_id" bson:"_id"`
	UserID       string   `json:"user_id" bson:"user_id"`
	RestaurantID string   `json:"restaurant_id" bson:"restaurant_id"`
	RiderID      string   `json:"rider_id" bson:"rider_id"`
	ProductIDs   []string `json:"product_ids" bson:"product_ids"`
	TotalPrice   float64  `json:"total_price" bson:"total_price"`
	Status       string   `json:"status" bson:"status"` // e.g., "Pending", "Assigned", "Delivered"

}

type Order struct {
	ID               string    `json:"id" bson:"_id"`
	OrderID          string    `json:"orderId" bson:"orderId"`
	UserID           string    `json:"userId" bson:"user_id"`
	ProductID        string    `json:"productId" bson:"product_id"`
	RestaurantID     string    `json:"restaurantId" bson:"restaurant_id"`
	RiderID          string    `json:"riderId" bson:"rider_id"`
	LatLong          string    `json:"latLong" bson:"latLong"`
	Status           string    `json:"status" bson:"status"` // e.g., Pending, Assigned, Delivered
	CreatedAt        time.Time `json:"createdAt" bson:"createdAt"`
	ItemName         string    `json:"itemName" bson:"itemName"`
	Quantity         int       `json:"quantity" bson:"quantity"`
	Price            float64   `json:"price" bson:"price"`
	TotalBill        float64   `json:"totalBill" bson:"total_bill"`
	IsDefaultAddress bool      `json:"isDefaultAddress" bson:"isDefaultAddress"`
	DeliveryFee      float64   `json:"deliveryFee" bson:"deliveryFee"`
}

type GroupedOrder struct {
	CreatedAt      time.Time `json:"created_at"`
	OrderId        string    `json:"orderId"`
	RestaurantName string    `json:"restaurantName"`
	Status         string    `json:"status"`
	Name           string    `json:"name"`
	Image          string    `json:"image"`
	Quantity       int       `json:"quantity"`
	Price          float64   `json:"price" bson:"price"`
	TotalAmount    float64   `json:"total_amount"`
	TotalItems     int       `json:"total_items"`
	DeliveryFee    float64   `json:"deliveryFee"`
}

type RiderOrder struct {
	CreatedAt      time.Time `json:"created_at"`
	OrderId        string    `json:"orderId"`
	RestaurantName string    `json:"restaurantName"`
	Status         string    `json:"status"`
	Name           string    `json:"name"`
	Image          string    `json:"image"`
	Quantity       int       `json:"quantity"`
	Price          float64   `json:"price" bson:"price"`
	TotalAmount    float64   `json:"total_amount"`
	TotalItems     int       `json:"total_items"`
	DeliveryFee    float64   `json:"deliveryFee"`
}
