package auth

import (
	"net/http"

	"github.com/blert0n/habitflow/database"
	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
)

func Demo(c *gin.Context) {

	user, err := database.Queries.GetUserByEmail(c, "demo@habitflow.com")
	if err != nil {
		c.JSON(http.StatusUnauthorized, utils.APIResponse{
			Success: false,
			Error:   "User not found",
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

	c.JSON(http.StatusOK, utils.APIResponse{
		Success: true,
		Message: "Logged in successfully",
		Data: gin.H{
			"userId": user.ID,
			"email":  user.Email,
		},
	})
}
