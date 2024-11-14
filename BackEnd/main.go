package main

import (
	"foodApp/envConfig"
	"foodApp/routes"
	"log"
)

func init() {
	envConfig.LoadEnv()
}

func main() {
	router := routes.SetUpRoutes()
	log.Println("Server is running on port 8080")
	log.Fatal(router.Run(":8080"))
}
