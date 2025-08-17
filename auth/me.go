package auth

import (
	"net/http"

	"github.com/blert0n/habitflow/database"
	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
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

	c.JSON(http.StatusOK, utils.APIResponse{
		Success: true,
		Message: "User retrieved successfully",
		Data: gin.H{
			"userId":    user.ID,
			"email":     user.Email,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
		},
	})
}
