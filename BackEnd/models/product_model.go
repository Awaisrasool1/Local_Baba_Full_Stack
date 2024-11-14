package models

import "time"

type Ingredient struct {
	ID   string `json:"id" bson:"_id,omitempty"`
	Name string `json:"name" bson:"name"`
}

type Product struct {
	ID              string       `json:"id" bson:"_id"`
	RestaurantID    string       `json:"restaurant_id" bson:"restaurant_id"`
	Title           string       `json:"title" bson:"title"`
	CategoryName    string       `json:"category" bson:"category"`
	CategoryId      string       `json:"category_id" bson:"category_id"`
	Ingredients     []Ingredient `json:"ingredients" bson:"ingredients"`
	Description     string       `json:"description,omitempty" bson:"description,omitempty"`
	OriginalPrice   float64      `json:"originalPrice" bson:"originalPrice"`
	DiscountedPrice float64      `json:"discountedPrice" bson:"discountedPrice"`
	Image           string       `json:"image" bson:"image"`
	CreatedAt       time.Time    `json:"createdAt" bson:"createdAt"`
	UpdatedAt       time.Time    `json:"updatedAt" bson:"updatedAt"`
}
