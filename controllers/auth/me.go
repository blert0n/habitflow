package auth

import (
	"net/http"
	"time"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

func Me(c *gin.Context) {

	cookie, err := c.Cookie("auth_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, utils.APIResponse{
			Success: false,
			Message: "Authentication required",
		})
		return
	}

	token, err := utils.ParseJWT(cookie)

	if err != nil {
		c.JSON(http.StatusUnauthorized, utils.APIResponse{
			Success: false,
			Message: "Invalid token",
		})
		return
	}

	user, err := database.Queries.GetUserByID(c, token.UserID)
	if err != nil {
		c.JSON(http.StatusNotFound, utils.APIResponse{
			Success: false,
			Message: "User not found",
		})
		return
	}

	habits, err := database.Queries.ListHabits(c, pgtype.Int4{Int32: token.UserID, Valid: true})
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Message: "Failed to fetch habits",
		})
		return
	}

	today := time.Now().UTC()
	dateStr := today.Format("2006-01-02")
	todaysHabits := []gin.H{}

	for _, h := range habits {
		excluded := utils.NormalizeExcludedDates(h.ExcludedDates)
		occurrences := utils.GetOccurrencesWithExclusions(utils.TextToString(h.Frequency), excluded, today)

		if !utils.ContainsDate(occurrences, today) {
			continue
		}

		isCompleted, _ := database.Queries.IsCompleted(c, db.IsCompletedParams{
			HabitID: h.ID,
			UserID:  token.UserID,
			Date:    dateStr,
		})

		todaysHabits = append(todaysHabits, gin.H{
			"id":          h.ID,
			"name":        h.Name,
			"description": utils.TextToString(h.Description),
			"color":       utils.TextToString(h.Color),
			"isCompleted": isCompleted,
		})
	}

	c.JSON(http.StatusOK, utils.APIResponse{
		Success: true,
		Message: "User retrieved successfully",
		Data: gin.H{
			"userId":      user.ID,
			"email":       user.Email,
			"firstName":   user.FirstName,
			"lastName":    user.LastName,
			"createdAt":   user.Createdat,
			"habits":      todaysHabits,
			"totalHabits": len(habits),
		},
	})
}
