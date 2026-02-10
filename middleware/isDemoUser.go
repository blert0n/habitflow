package middleware

import (
	"net/http"

	"github.com/blert0n/habitflow/database"
	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
)

func IsDemoUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("userId")
		if !exists {
			c.Next()
			return
		}

		uid := userID.(int32)

		user, err := database.Queries.GetUserByEmail(c, "demo@habitflow.com")
		if err == nil && user.ID == uid {
			c.JSON(http.StatusForbidden, utils.APIResponse{
				Success: false,
				Message: "Demo account cannot be modified. Please create your own account to use all features.",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
