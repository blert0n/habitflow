package auth

import (
	"net/http"

	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
)

func SignOut(c *gin.Context) {
	utils.SetCookieDefaultConfig(c, "auth_token", "", -1, "/")
	utils.SetCookieDefaultConfig(c, "oauth_state", "", -1, "/")
	utils.SetCookieDefaultConfig(c, "oauth_redirect", "", -1, "/")

	c.JSON(http.StatusOK, utils.APIResponse{
		Success: true,
		Message: "Logged out successfully",
	})
}
