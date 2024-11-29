package routes

import (
	"foodApp/handlers"
	"foodApp/handlers/admin"
	"foodApp/handlers/restaurant"
	"foodApp/handlers/rider"
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
	router.GET("profile/get-profile", handlers.Get_Profile)

	//app routes
	router.GET("Restaurant/get-all-restaurant", user.Get_user_restaurant)
	router.GET("Restaurants/Get-Nearby-Restaurants", user.Get_user_nearby_restaurants)
	router.GET("Product/get-products/:id", user.Get_user_products)
	router.GET("Product/GetProductById/:id", user.Get_user_product_by_id)

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
		//order
		restaurantRoutes.GET("Order/get-pending-orders", restaurant.GetOrdersByRestaurant)
		restaurantRoutes.GET("Order/get-nonPending-orders", restaurant.GetNonPendingOrdersByRestaurant)
		restaurantRoutes.POST("Order/update-order-status", restaurant.UpdateOrderStatus)
	}

	//rider pannel routes
	riderRoutes := router.Group("/rider")
	riderRoutes.Use(utils.RoleAuthorization(3))
	{
		//order
		riderRoutes.GET("Order/get-accepted-orders", rider.Get_accepted_order)
		riderRoutes.GET("Order/completed-orders-count", rider.Get_completed_orders_count)
		riderRoutes.GET("Order/new-orders-count", rider.Get_new_orders_count)
		riderRoutes.PUT("Order/assigned-orders", rider.Order_assigned_for_rider)

	}

	//user pannel routes
	userRoutes := router.Group("/user")
	userRoutes.Use(utils.RoleAuthorization(4))
	{
		//carts apis
		userRoutes.POST("Cart/add-to-cart/:id", user.AddToCart)
		userRoutes.PUT("Cart/add-quantity/:id", user.AddQuantity)
		userRoutes.PUT("Cart/remove-quantity/:id", user.RemoveQuantity)
		userRoutes.DELETE("Cart/item-delete:id", user.DeleteItem)
		userRoutes.GET("Cart/get_cart_Item", user.GetAllCartItem)
		//address apis
		userRoutes.DELETE("Address/delete-address:id", user.Delete_user_address)
		userRoutes.POST("Address/add-address", user.Add_user_address)
		userRoutes.POST("Address/update-address", user.UpdateDefaultAddress)
		userRoutes.GET("Address/get-address", user.Get_user_address)
		userRoutes.GET("Address/get-user-default-address", user.Get_user_default_address)
		//profile
		userRoutes.PUT("upload-image", user.Upload_Image)
		//order
		userRoutes.POST("Order/add-order-by-cart", user.AddOrderByCart)
		userRoutes.POST("Order/add-order-by-product:id", user.AddOrderByProduct)
		userRoutes.PUT("Order/order-cancel", user.Order_cancel)
		userRoutes.GET("Order/get-ongoing-order", user.Get_user_ongoing_order)
		userRoutes.GET("Order/get-past-order", user.Get_past_order)
		userRoutes.GET("Order/get-order-status", user.GetOrderStatus)
		userRoutes.GET("Order/get-order-details", user.Get_order_details_byID)
	}

	return router
}
