package utils

import (
	"os"

	"github.com/gin-gonic/gin"
)

func SetCookieDefaultConfig(c *gin.Context, name, value string, maxAge int, path string) {
	env := os.Getenv("GO_ENV")

	cookieDomain := ""
	cookieSecure := false
	cookieHttpOnly := false

	if env == "production" {
		cookieDomain = os.Getenv("FRONTEND_APP")
		cookieSecure = true
		cookieHttpOnly = true
	}

	c.SetCookie(
		name,
		value,
		maxAge,
		path,
		cookieDomain,
		cookieSecure,
		cookieHttpOnly,
	)
}
