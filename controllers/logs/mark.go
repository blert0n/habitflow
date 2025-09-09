package logs

import (
	"net/http"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/gin-gonic/gin"
)

func MarkAsComplete(c *gin.Context) {
	userId, exists := c.Get("userId")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
		return
	}

	var body struct {
		Id   int32  `json:"id"`
		Date string `json:"date"`
		Time string `json:"time"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	uid := userId.(int32)

	log, err := database.Queries.MarkHabitAsCompleted(c, db.MarkHabitAsCompletedParams{
		HabitID: body.Id,
		UserID:  uid,
		Date:    body.Date,
		Time:    body.Time,
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
		Id   int32  `json:"id"`
		Date string `json:"date"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid params"})
		return
	}

	uid := userId.(int32)

	err := database.Queries.MarkAsIncomplete(c, db.MarkAsIncompleteParams{
		HabitID: body.Id,
		UserID:  uid,
		Date:    body.Date,
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
