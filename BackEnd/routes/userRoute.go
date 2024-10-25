package routes

import (
	"foodApp/handlers"

	"github.com/gin-gonic/gin"
)

func SetUpRoutes() *gin.Engine {
	router := gin.Default()
	router.POST("Auth/user-signup", handlers.SignUp)
	router.POST("Auth/login", handlers.SignIn)

	//categories
	router.GET("Categories/get-All-Categories", handlers.GetCategories)

	//restaurant
	router.POST("Restaurants/Add-Restaurant", handlers.AddRestaurant)
	router.GET("Restaurant/Get-All-Restaurant", handlers.GetAllRestaurant)
	router.GET("Restaurants/Get-Nearby-Restaurants", handlers.GetNearbyRestaurants)

	//product
	router.POST("AddProduct/:id", handlers.AddProduct)
	router.GET("GetAllProduct/:id", handlers.GetAllProducts)

	//cart
	router.POST("AddToCart", handlers.AddToCart)
	router.PUT("AddQuantity/:id", handlers.AddQuantity)
	router.PUT("RemoveQuantity/:id", handlers.RemoveQuantity)
	router.GET("GetCartItem", handlers.GetAllCartItem)
	return router
}
