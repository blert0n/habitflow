package profile

import (
	"net/http"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
)

type ChangePasswordRequest struct {
	OldPassword string `json:"oldPassword" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required"`
}

func ChangePassword(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, utils.APIResponse{
			Success: false,
			Message: "Not authorized",
		})
		return
	}

	uid := userID.(int32)

	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, utils.APIResponse{
			Success: false,
			Message: "Old password and new password are required",
		})
		return
	}

	if len(req.NewPassword) < 6 {
		c.JSON(http.StatusBadRequest, utils.APIResponse{
			Success: false,
			Message: "New password must be at least 6 characters",
		})
		return
	}

	user, err := database.Queries.GetUserByID(c, uid)
	if err != nil {
		c.JSON(http.StatusNotFound, utils.APIResponse{
			Success: false,
			Message: "User not found",
		})
		return
	}

	if !utils.CheckPassword(req.OldPassword, user.Password) {
		c.JSON(http.StatusUnauthorized, utils.APIResponse{
			Success: false,
			Message: "Current password is incorrect",
		})
		return
	}

	hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Message: "Failed to process password",
		})
		return
	}

	err = database.Queries.UpdateUserPassword(c, db.UpdateUserPasswordParams{
		ID:       uid,
		Password: hashedPassword,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Message: "Failed to update password",
		})
		return
	}

	c.JSON(http.StatusOK, utils.APIResponse{
		Success: true,
		Message: "Password updated successfully",
	})
}
