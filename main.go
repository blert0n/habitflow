package main

import (
	"log"
	"os"
	"time"

	"github.com/blert0n/habitflow/auth"
	"github.com/blert0n/habitflow/database"
	"github.com/blert0n/habitflow/routes"
	"github.com/gin-contrib/cors"
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

	auth.InitGoogleOAuth()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			return origin == "http://localhost:5173"
		},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Accept",
			"Authorization",
			"X-Requested-With",
		},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

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
