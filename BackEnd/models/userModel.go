package models

type User struct {
	ID       string `json:"id,omitempty" bson:"_id,omitempty"`
	Name     string `bson:"name" json:"name" binding:"required"`
	Email    string `bson:"email" json:"email" binding:"required"`
	Password string `bson:"password" json:"password" binding:"required"`
	Phone    string `bson:"phone" json:"phone" binding:"required"`
	Bio      string `bson:"bio,omitempty" json:"bio,omitempty"`
}

type Address struct {
	ID       string `json:"id,omitempty" bson:"_id,omitempty"`
	Address  string `bson:"address,omitempty" json:"address,omitempty"`
	Location string `json:"location" bson:"location"`
	UserId   string `json:"userId" bson:"userId"`
}
