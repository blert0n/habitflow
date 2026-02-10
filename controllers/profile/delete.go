package profile

import (
	"net/http"

	"github.com/blert0n/habitflow/database"
	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

func DeleteAccount(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, utils.APIResponse{
			Success: false,
			Message: "Not authorized",
		})
		return
	}

	uid := userID.(int32)

	err := database.Queries.DeleteUserCompletions(c, uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Message: "Failed to delete user data",
		})
		return
	}

	err = database.Queries.DeleteUserHabits(c, pgtype.Int4{Int32: uid, Valid: true})
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Message: "Failed to delete user data",
		})
		return
	}

	_ = database.Queries.DeleteUserNotes(c, pgtype.Int4{Int32: uid, Valid: true})

	_ = database.Queries.DeleteUserHabitStats(c, uid)

	err = database.Queries.DeleteUser(c, uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Message: "Failed to delete account",
		})
		return
	}

	utils.SetCookieDefaultConfig(c, "oauth_redirect", "", -1, "/")
	utils.SetCookieDefaultConfig(c, "oauth_state", "", -1, "/")
	utils.SetCookieDefaultConfig(c, "auth_token", "", -1, "/")

	c.JSON(http.StatusOK, utils.APIResponse{
		Success: true,
		Message: "Account deleted successfully",
	})
}
