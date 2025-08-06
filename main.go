package main

import (
	"log"

	"github.com/blert0n/habitflow/database"
	"github.com/blert0n/habitflow/routes"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()

	r := gin.Default()

	api := r.Group("/api")
	routes.RegisterRoutes(api)

	r.Use(static.Serve("/", static.LocalFile("./frontend/dist", true)))

	r.NoRoute(func(c *gin.Context) {
		c.File("./frontend/dist/index.html")
	})

	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
