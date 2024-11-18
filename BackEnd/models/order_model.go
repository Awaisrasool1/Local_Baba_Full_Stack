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
	ID           string    `json:"id" bson:"_id"`
	UserID       string    `json:"userId" bson:"user_id"`
	ProductID    string    `json:"productId" bson:"product_id"`
	RestaurantID string    `json:"restaurantId" bson:"restaurant_id"`
	RiderID      string    `json:"riderId" bson:"rider_id"`
	Quantity     int       `json:"quantity" bson:"quantity"`
	Price        float64   `json:"price" bson:"price"`
	TotalBill    float64   `json:"totalBill" bson:"total_bill"`
	City         string    `json:"city" bson:"city"`
	Address      string    `json:"address" bson:"address"`
	PhoneNo      string    `json:"phoneNo" bson:"phoneNo"`
	FirstName    string    `json:"firstName" bson:"firstName"`
	Email        string    `json:"email" bson:"email"`
	Status       string    `json:"status" bson:"status"` // e.g., Pending, Assigned, Delivered
	CreatedAt    time.Time `json:"createdAt" bson:"createdAt"`
}
