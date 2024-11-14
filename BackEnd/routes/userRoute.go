package routes

import (
	"foodApp/handlers"
	"foodApp/handlers/admin"
	"foodApp/handlers/restaurant"
	"foodApp/handlers/user"
	"foodApp/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	}
}

func SetUpRoutes() *gin.Engine {
	router := gin.Default()
	router.Use(CORSMiddleware())

	router.Static("/uploads", "./uploads")

	//public routes
	router.POST("Auth/user-signup", handlers.SignUp)
	router.POST("Auth/login", handlers.SignIn)
	router.GET("Categories/get-All-Categories", handlers.GetCategories)

	router.POST("upload", handlers.UploadImage)
	//admin pannel routes
	adminRoutes := router.Group("/admin")
	adminRoutes.Use(utils.RoleAuthorization(1))
	{
		//Restaurant
		adminRoutes.POST("Restaurants/Add-Restaurant", admin.Admin_add_restaurant)
		adminRoutes.GET("Restaurant/get-all-restaurant", admin.Get_admin_restaurant)
		//Rider
		adminRoutes.POST("Riders/add-rider", admin.Admin_add_rider)
		adminRoutes.GET("Riders/get-all-rider", admin.Get_admin_riders)
		//Customers
		adminRoutes.GET("Customers/get-all-customer", admin.Get_admin_customers)

	}

	//restaurant pannel routes
	restaurantRoutes := router.Group("/restaurant")
	restaurantRoutes.Use(utils.RoleAuthorization(2))
	{
		restaurantRoutes.POST("Product/add-product", restaurant.Create_restaurant_product)
		restaurantRoutes.GET("Product/get-products", restaurant.Get_restaurant_products)
	}

	//user pannel routes
	userRoutes := router.Group("/user")
	userRoutes.Use(utils.RoleAuthorization(4))
	{
		//restaurant apis
		userRoutes.GET("Restaurant/get-all-restaurant", user.Get_user_restaurant)
		userRoutes.GET("Restaurants/Get-Nearby-Restaurants", user.Get_user_nearby_restaurants)
		//carts apis
		userRoutes.POST("Cart/add-to-cart/:id", user.AddToCart)
		userRoutes.PUT("AddQuantity/:id", user.AddQuantity)
		userRoutes.PUT("RemoveQuantity/:id", user.RemoveQuantity)
		userRoutes.GET("Cart/get_cart_Item", user.GetAllCartItem)
		//products apis
		userRoutes.GET("Product/get-products/:id", user.Get_user_products)
		userRoutes.GET("Product/GetProductById/:id", user.Get_user_product_by_id)
		//address apis
		userRoutes.DELETE("Address/delete-address", user.Delete_user_address)
		userRoutes.POST("Address/add-address", user.Add_user_address)
		userRoutes.POST("Address/update-address", user.UpdateDefaultAddress)
		userRoutes.GET("Address/get-address", user.Get_user_address)
		userRoutes.GET("Address/get-user-default-address", user.Get_user_default_address)
	}

	return router
}
