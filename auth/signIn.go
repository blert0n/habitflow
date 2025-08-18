package auth

import (
	"net/http"

	"github.com/blert0n/habitflow/database"
	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
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

	c.JSON(http.StatusOK, utils.APIResponse{
		Success: true,
		Message: "Logged in successfully",
		Data: gin.H{
			"userId": user.ID,
			"email":  user.Email,
		},
	})
}
