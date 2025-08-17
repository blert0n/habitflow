package auth

import (
	"net/http"
	"os"

	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
)

func SignOut(c *gin.Context) {
	env := os.Getenv("GO_ENV")

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
		"",
		-1,
		"/",
		cookieDomain,
		cookieSecure,
		cookieHttpOnly,
	)

	c.JSON(http.StatusOK, utils.APIResponse{
		Success: true,
		Message: "Logged out successfully",
	})
}
