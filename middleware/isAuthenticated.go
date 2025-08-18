package middleware

import (
	"net/http"

	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
)

func IsAuthenticated() gin.HandlerFunc {
	return func(c *gin.Context) {

		token, err := c.Cookie("auth_token")

		if err != nil || token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
			c.Abort()
			return
		}

		claims, err := utils.ParseJWT(token)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
			c.Abort()
			return
		}

		c.Set("userId", claims.UserID)

		c.Next()
	}
}
