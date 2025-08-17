package auth

import (
	"net/http"
	"os"

	"github.com/blert0n/habitflow/database"
	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
)

func SignIn(c *gin.Context) {
	env := os.Getenv("GO_ENV")

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

	cookieDomain := ""
	cookieSecure := false
	cookieHttpOnly := false

	if env == "production" {
		cookieDomain = os.Getenv("URL")
		cookieSecure = true
		cookieHttpOnly = true
	}

	c.SetCookie(
		"auth_token",
		token,
		3600*24,
		"/",
		cookieDomain,
		cookieSecure,
		cookieHttpOnly,
	)

	c.JSON(http.StatusOK, utils.APIResponse{
		Success: true,
		Message: "Logged in successfully",
		Data: gin.H{
			"userId": user.ID,
			"email":  user.Email,
		},
	})
}
