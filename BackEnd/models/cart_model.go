package models

type CartItem struct {
	ProductId string `json:"product_Id" bson:"product_Id"`
	Quantity  int    `json:"quantity" bson:"quantity"`
}

type Cart struct {
	ID        string  `json:"id" bson:"_id"`
	UserID    string  `json:"user_id" bson:"user_id"`
	ProductID string  `json:"product_id" bson:"product_id"`
	Quantity  int     `json:"quantity" bson:"quantity"`
	Image     string  `json:"image" bson:"image"`
	Price     float64 `json:"price" bson:"price"`
	Name      string  `json:"name" bson:"name"`
}
