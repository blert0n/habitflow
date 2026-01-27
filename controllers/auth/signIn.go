package auth

import (
	"context"
	"net/http"
	"time"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

func SignIn(c *gin.Context) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, utils.APIResponse{
			Success: false,
			Error:   "Malformed credentials",
		})
		return
	}

	user, err := database.Queries.GetUserByEmail(c, req.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, utils.APIResponse{
			Success: false,
			Error:   "User not found",
		})
		return
	}

	if !utils.CheckPassword(req.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, utils.APIResponse{
			Success: false,
			Error:   "Incorrect credentials",
		})
		return
	}

	token, err := utils.GenerateJWT(user.ID)

	if err != nil || token == "" {
		c.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to generate auth token",
		})
		return
	}

	utils.SetCookieDefaultConfig(c, "auth_token", token, 3600*24, "/")

	go initializeHabitStats(user.ID)

	c.JSON(http.StatusOK, utils.APIResponse{
		Success: true,
		Message: "Logged in successfully",
		Data: gin.H{
			"userId": user.ID,
			"email":  user.Email,
		},
	})
}

func initializeHabitStats(userID int32) {
	ctx := context.Background()

	habitOptions, err := database.Queries.HabitOptions(ctx, pgtype.Int4{Int32: userID, Valid: true})
	if err != nil {
		return
	}

	for _, habitOption := range habitOptions {
		_, err := database.Queries.GetHabitStats(ctx, db.GetHabitStatsParams{
			UserID:  userID,
			HabitID: habitOption.ID,
		})

		if err != nil {
			habit, err := database.Queries.GetHabitByID(ctx, db.GetHabitByIDParams{
				ID:     habitOption.ID,
				Userid: pgtype.Int4{Int32: userID, Valid: true},
			})
			if err != nil {
				continue
			}

			completionLogs, err := database.Queries.GetAllHabitCompletions(ctx, db.GetAllHabitCompletionsParams{
				HabitID: habitOption.ID,
				UserID:  userID,
			})
			if err != nil {
				continue
			}

			excludedDates := utils.NormalizeExcludedDates(habit.ExcludedDates)
			targetDate := time.Now().UTC().Add(time.Hour*23 + time.Minute*59 + time.Second*59)
			occurrences := utils.GetOccurrencesUntilToday(utils.TextToString(habit.Frequency), excludedDates, targetDate)

			biggestStreak := utils.CalculateBiggestStreak(occurrences, completionLogs)

			_, _ = database.Queries.UpsertHabitStats(ctx, db.UpsertHabitStatsParams{
				UserID:  userID,
				HabitID: habitOption.ID,
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
	}
}
