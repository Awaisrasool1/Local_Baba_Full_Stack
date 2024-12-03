package models

type User struct {
	ID       string `json:"id" bson:"_id"`
	Name     string `bson:"name" json:"name" binding:"required"`
	Email    string `bson:"email" json:"email" binding:"required"`
	Password string `bson:"password" json:"password" binding:"required"`
	Phone    string `bson:"phone" json:"phone" binding:"required"`
	Role     int    `bson:"role" json:"role"`
	Image    string `json:"image" bson:"image"`
}

type Address struct {
	ID                string `json:"id" bson:"_id"`
	FullAddress       string `bson:"fullAddress" json:"fullAddress"`
	City              string `bson:"city" json:"city"`
	LatLong           string `json:"latlong" bson:"latlong"`
	UserId            string `json:"userId" bson:"userId"`
	IsDefaultShipping bool   `json:"isDefaultShipping" bson:"isDefaultShipping"`
}

type FCMToken struct {
	ID       string `json:"id" bson:"_id"`
	UserID   string `json:"user_id" bson:"user_id"`
	FCMToken string `json:"fcm_token" bson:"fcm_token"`
}
