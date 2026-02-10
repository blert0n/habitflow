package profile

import (
	"net/http"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

type UpdateProfileRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	// Avatar    string `json:"avatar"`
}

func UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, utils.APIResponse{
			Success: false,
			Message: "Not authorized",
		})
		return
	}

	uid := userID.(int32)

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, utils.APIResponse{
			Success: false,
			Message: "Invalid request data",
		})
		return
	}

	if req.Email != "" {

		if !utils.IsValidEmail(req.Email) {
			c.JSON(http.StatusBadRequest, utils.APIResponse{
				Success: false,
				Message: "Invalid email format",
			})
			return
		}

		existingUser, err := database.Queries.GetUserByEmail(c, req.Email)
		if err == nil && existingUser.ID != uid {
			c.JSON(http.StatusConflict, utils.APIResponse{
				Success: false,
				Message: "Email already in use",
			})
			return
		}
	}

	err := database.Queries.UpdateUserProfile(c, db.UpdateUserProfileParams{
		ID:        uid,
		FirstName: pgtype.Text{String: req.FirstName, Valid: true},
		LastName:  pgtype.Text{String: req.LastName, Valid: true},
		Email:     req.Email,
		// Avatar:    req.Avatar, // Uncomment when avatar column is added
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Message: "Failed to update profile",
		})
		return
	}

	c.JSON(http.StatusOK, utils.APIResponse{
		Success: true,
		Message: "Profile updated successfully",
	})
}
