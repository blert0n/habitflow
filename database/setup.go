package database

import (
	"fmt"
	"log"
	"os"

	"github.com/blert0n/habitflow/models"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	_ = godotenv.Load()
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("PG_HOST"), os.Getenv("PG_USER"), os.Getenv("PG_PASSWORD"),
		os.Getenv("PG_DBNAME"), os.Getenv("PG_PORT"),
	)
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to PostgreSQL:", err)
	}

	if err := DB.AutoMigrate(&models.User{}); err != nil {
		log.Fatalf("AutoMigrate failed: %v", err)
	}
}
