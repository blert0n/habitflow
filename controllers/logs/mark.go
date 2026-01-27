package logs

import (
	"net/http"
	"time"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/blert0n/habitflow/utils"
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

	// Update habit stats
	updateHabitStats(c, uid, body.Id)

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

	// Update habit stats
	updateHabitStats(c, uid, body.Id)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Habit marked as incomplete",
	})
}

// Helper function to update habit statistics
func updateHabitStats(c *gin.Context, userID int32, habitID int32) {
	// Get habit details
	habit, err := database.Queries.GetHabitByID(c, db.GetHabitByIDParams{
		ID:     habitID,
		Userid: pgtype.Int4{Int32: userID, Valid: true},
	})
	if err != nil {
		return
	}

	// Get all completion logs
	completionLogs, err := database.Queries.GetAllHabitCompletions(c, db.GetAllHabitCompletionsParams{
		HabitID: habitID,
		UserID:  userID,
	})
	if err != nil {
		return
	}

	// Get all occurrences until today
	excludedDates := utils.NormalizeExcludedDates(habit.ExcludedDates)
	targetDate := time.Now().UTC().Add(time.Hour*23 + time.Minute*59 + time.Second*59)
	occurrences := utils.GetOccurrencesUntilToday(utils.TextToString(habit.Frequency), excludedDates, targetDate)

	// Calculate biggest streak
	biggestStreak := utils.CalculateBiggestStreak(occurrences, completionLogs)

	// Upsert habit stats
	_, _ = database.Queries.UpsertHabitStats(c, db.UpsertHabitStatsParams{
		UserID:  userID,
		HabitID: habitID,
		MaxStreak: pgtype.Int4{
			Int32: int32(biggestStreak),
			Valid: true,
		},
		TotalCompletions: pgtype.Int4{
			Int32: int32(len(completionLogs)),
			Valid: true,
		},
	})
}
