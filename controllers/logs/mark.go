package logs

import (
	"net/http"
	"time"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

func MarkAsComplete(c *gin.Context) {
	userId, exists := c.Get("userId")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
		return
	}

	var body struct {
		Id int32 `json:"id"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	uid := userId.(int32)

	log, err := database.Queries.MarkHabitAsCompleted(c, db.MarkHabitAsCompletedParams{
		HabitID: body.Id,
		UserID:  uid,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Habit marked as completed",
		"log":     log,
	})

}

func MarkAsIncomplete(c *gin.Context) {
	userId, exists := c.Get("userId")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
		return
	}

	var body struct {
		Id int32 `json:"id,omitempty"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid params"})
		return
	}

	uid := userId.(int32)
	todayStr := time.Now().Format("2006-01-02")
	completedAt, err := time.Parse("2006-01-02", todayStr)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}

	err = database.Queries.MarkAsIncomplete(c, db.MarkAsIncompleteParams{
		HabitID:     body.Id,
		UserID:      uid,
		CompletedAt: pgtype.Timestamp{Time: completedAt, Valid: true},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Habit marked as incomplete",
	})
}
