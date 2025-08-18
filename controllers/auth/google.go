package auth

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/blert0n/habitflow/database"
	db "github.com/blert0n/habitflow/sqlc/generated"
	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

func GenerateState(n int) (string, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func GoogleLogin(c *gin.Context) {
	redirectURI := c.Query("redirect_uri")

	state, err := GenerateState(16)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.APIResponse{Success: false, Error: "Failed to generate state"})
		return
	}

	utils.SetCookieDefaultConfig(c, "oauth_state", state, 300, "/")
	utils.SetCookieDefaultConfig(c, "oauth_redirect", redirectURI, 300, "/")

	url := GoogleOAuthConfig.AuthCodeURL(state)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func GoogleCallback(c *gin.Context) {

	state := c.Query("state")
	storedState, _ := c.Cookie("oauth_state")
	if state != storedState {
		c.JSON(http.StatusBadRequest, utils.APIResponse{
			Success: false,
			Error:   "Invalid OAuth state",
		})
		return
	}

	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, utils.APIResponse{
			Success: false,
			Error:   "Code not found",
		})
		return
	}

	token, err := GoogleOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to exchange token",
		})
		return
	}

	client := GoogleOAuthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to get user info",
		})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var googleUser struct {
		ID            string `json:"id"`
		Email         string `json:"email"`
		VerifiedEmail bool   `json:"verified_email"`
		Name          string `json:"name"`
		GivenName     string `json:"given_name"`
		FamilyName    string `json:"family_name"`
		Picture       string `json:"picture"`
	}

	if err := json.Unmarshal(body, &googleUser); err != nil {
		c.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to parse user info",
		})
		return
	}

	user, err := database.Queries.GetUserByEmail(c, googleUser.Email)
	if err != nil {
		user, err = database.Queries.CreateUser(c, db.CreateUserParams{
			FirstName: pgtype.Text{String: googleUser.GivenName, Valid: true},
			LastName:  pgtype.Text{String: googleUser.FamilyName, Valid: true},
			Username:  googleUser.Email,
			Email:     googleUser.Email,
			Password:  "",
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, utils.APIResponse{
				Success: false,
				Error:   "Failed to create user",
			})
			return
		}
	}

	jwtToken, err := utils.GenerateJWT(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to generate token",
		})
		return
	}

	utils.SetCookieDefaultConfig(c,
		"auth_token",
		jwtToken,
		3600*24,
		"/",
	)

	redirectURI, err := c.Cookie("oauth_redirect")
	if err != nil || redirectURI == "" {
		redirectURI = os.Getenv("FRONTEND_APP")
	}

	utils.SetCookieDefaultConfig(c, "oauth_state", "", -1, "/")
	utils.SetCookieDefaultConfig(c, "oauth_redirect", "", -1, "/")

	c.Redirect(http.StatusTemporaryRedirect, redirectURI)
}
