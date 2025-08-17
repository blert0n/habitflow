package auth

import (
	"net/http"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

func SignUp(c *gin.Context) {

	var req struct {
		Name     string `json:"firstName"`
		Lastname string `json:"lastName"`
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, utils.APIResponse{
			Success: false,
			Error:   "Invalid request body",
		})
		return
	}

	_, err := database.Queries.GetUserByEmail(c, req.Email)

	if err == nil {
		c.JSON(http.StatusConflict, utils.APIResponse{
			Success: false,
			Error:   "This email is already registered.",
		})
		return
	}

	hashedPassword, err := utils.HashPassword(req.Password)

	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Something went wrong",
		})
		return
	}

	user, err := database.Queries.CreateUser(c, db.CreateUserParams{
		FirstName: pgtype.Text{String: req.Name, Valid: true},
		LastName:  pgtype.Text{String: req.Lastname, Valid: true},
		Email:     req.Email,
		Username:  req.Username,
		Password:  hashedPassword,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to create user",
		})
		return
	}

	c.JSON(http.StatusCreated, utils.APIResponse{
		Success: true,
		Message: "User created successfully",
		Data: gin.H{
			"userId": user.ID,
			"email":  user.Email,
		},
	})
}
