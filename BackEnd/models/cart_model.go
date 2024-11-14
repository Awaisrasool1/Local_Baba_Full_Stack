package models

type Cart struct {
	ID              string  `json:"id" bson:"_id"`
	UserID          string  `json:"user_id" bson:"user_id"`
	ProductID       string  `json:"product_id" bson:"product_id"`
	Quantity        int     `json:"quantity" bson:"quantity"`
	Image           string  `json:"image" bson:"image"`
	OriginalPrice   float64 `json:"originalPrice" bson:"originalPrice"`
	DiscountedPrice float64 `json:"discountedPrice" bson:"discountedPrice"`
	Name            string  `json:"name" bson:"name"`
	CategoryName    string  `json:"category" bson:"category"`
}
