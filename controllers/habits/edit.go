package habits

import (
	"fmt"
	"net/http"
	"time"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

func Edit(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
		return
	}
	uid := userID.(int32)

	var body struct {
		ID            int32    `json:"id" binding:"required"`
		Name          string   `json:"name" binding:"required"`
		Description   string   `json:"description"`
		CategoryID    int32    `json:"categoryId"`
		Color         string   `json:"color"`
		Frequency     string   `json:"frequency"`
		ExcludedDates []string `json:"excludedDates"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	desc := pgtype.Text{String: body.Description, Valid: body.Description != ""}
	color := pgtype.Text{String: body.Color, Valid: body.Color != ""}
	freq := pgtype.Text{String: body.Frequency, Valid: body.Frequency != ""}
	category := pgtype.Int4{Int32: body.CategoryID, Valid: body.CategoryID != 0}
	user := pgtype.Int4{Int32: uid, Valid: true}

	tx, err := database.DB.BeginTx(c, pgx.TxOptions{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := tx.Rollback(c); err != nil && err != pgx.ErrTxClosed {
		fmt.Printf("Something went wrong: %v\n", err)
	}

	habit, err := database.Queries.UpdateHabit(c, db.UpdateHabitParams{
		ID:          body.ID,
		Name:        body.Name,
		Description: desc,
		Categoryid:  category,
		Color:       color,
		Frequency:   freq,
		Userid:      user,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	dbExludedDates, err := database.Queries.ListHabitExcludedDates(c, body.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	existingDatesMap := make(map[string]bool)

	for _, date := range dbExludedDates {
		if date.Valid {
			existingDatesMap[date.Time.Format("2006-01-02")] = true
		}
	}

	updatedDatesMap := make(map[string]bool)

	for _, date := range body.ExcludedDates {
		updatedDatesMap[date] = true
	}

	for d := range updatedDatesMap {
		if !existingDatesMap[d] {
			date, _ := time.Parse("2006-01-02", d)
			if err := database.Queries.CreateHabitExcludedDate(c, db.CreateHabitExcludedDateParams{
				HabitID:      habit.ID,
				ExcludedDate: pgtype.Date{Time: date, Valid: true},
			}); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		}
	}

	for d := range existingDatesMap {
		if !updatedDatesMap[d] {
			date, _ := time.Parse("2006-01-02", d)
			if err := database.Queries.DeleteHabitExcludedDate(c, db.DeleteHabitExcludedDateParams{
				HabitID:      habit.ID,
				ExcludedDate: pgtype.Date{Time: date, Valid: true},
			}); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		}
	}

	resp := HabitResponse{
		ID:          habit.ID,
		Name:        habit.Name,
		Description: utils.TextToString(habit.Description),
		CreatedAt:   habit.Createdat.Time.Format(time.RFC3339),
		UpdatedAt:   habit.Updatedat.Time.Format(time.RFC3339),
		CategoryID:  utils.Int4ToInt32(habit.Categoryid),
		Color:       utils.TextToString(habit.Color),
		Frequency:   utils.TextToString(habit.Frequency),
		UserID:      utils.Int4ToInt32(habit.Userid),
	}

	c.JSON(http.StatusOK, resp)
}
