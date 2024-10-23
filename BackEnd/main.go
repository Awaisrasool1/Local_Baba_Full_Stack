package main

import (
	"foodApp/routes"
	"log"
)

func main() {
	router := routes.SetUpRoutes()
	log.Println("Server is running on port 8080")
	log.Fatal(router.Run(":8080"))
}
