package models

type FoodOrder struct {
	ID           string   `json:"_id" bson:"_id"`
	UserID       string   `json:"user_id" bson:"user_id"`
	RestaurantID string   `json:"restaurant_id" bson:"restaurant_id"`
	RiderID      string   `json:"rider_id" bson:"rider_id"`
	ProductIDs   []string `json:"product_ids" bson:"product_ids"`
	TotalPrice   float64  `json:"total_price" bson:"total_price"`
	Status       string   `json:"status" bson:"status"` // e.g., "Pending", "Assigned", "Delivered"

}
