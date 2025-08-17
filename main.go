package main

import (
	"log"
	"os"

	"github.com/blert0n/habitflow/database"
	"github.com/blert0n/habitflow/routes"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if os.Getenv("GO_ENV") != "production" {
		_ = godotenv.Load()
	}

	if err := database.InitDB(); err != nil {
		log.Fatalf("Failed to connect to db: %v", err)
	}

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
