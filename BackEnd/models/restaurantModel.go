package models

type Product struct {
	ID           string  `json:"id" bson:"_id,omitempty"`
	Name         string  `json:"name" bson:"name"`
	Price        float64 `json:"price" bson:"price"`
	ImageURL     string  `json:"image_url" bson:"image_url"`
	IsBest       bool    `json:"is_best" bson:"is_best"`
	Time         string  `json:"time" bson:"time"`
	Rating       int     `json:"rating" bson:"rating"`
	CategoryId   string  `json:"categoryId" bson:"categoryId"`
	RestaurantID string  `json:"restaurant_id" bson:"restaurant_id"`
	UserId       string  `json:"userId" bson:"userId"`
}

type Restaurant struct {
	ID          string `json:"id" bson:"id"`
	Name        string `json:"name" bson:"name"`
	Image       string `json:"image" bson:"image"`
	ServiesType string `json:"serviesType" bson:"serviesType"`
	Rating      int    `json:"rating" bson:"rating"`
	Location    string `json:"location" bson:"location"`
	Description string `json:"description" bson:"description"`
	UserId      string `json:"userId" bson:"userId"`
}
