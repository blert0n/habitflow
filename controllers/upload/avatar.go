package upload

import (
	"bytes"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/blert0n/habitflow/utils"
	"github.com/gin-gonic/gin"
)

func UploadAvatar(ctx *gin.Context) {

	// Get the file from the request
	file, header, err := ctx.Request.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.APIResponse{
			Success: false,
			Error:   "No file provided",
		})
		return
	}
	defer file.Close()

	// Read file content
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to read file",
		})
		return
	}

	// Get Cloudinary configuration from environment
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	if cloudName == "" || apiKey == "" || apiSecret == "" {
		ctx.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Cloudinary configuration missing",
		})
		return
	}

	// Create a new multipart form for Cloudinary
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Add file to form
	part, err := writer.CreateFormFile("file", header.Filename)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to prepare upload",
		})
		return
	}
	_, err = part.Write(fileBytes)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to prepare upload",
		})
		return
	}

	// Generate timestamp for signature
	timestamp := strconv.FormatInt(time.Now().Unix(), 10)

	// Create signature: SHA1 of "timestamp=<timestamp>&<api_secret>"
	signatureString := fmt.Sprintf("timestamp=%s%s", timestamp, apiSecret)
	hash := sha1.New()
	hash.Write([]byte(signatureString))
	signature := hex.EncodeToString(hash.Sum(nil))

	// Add required fields to form
	err = writer.WriteField("api_key", apiKey)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to prepare upload",
		})
		return
	}
	err = writer.WriteField("timestamp", timestamp)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to prepare upload",
		})
		return
	}
	err = writer.WriteField("signature", signature)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to prepare upload",
		})
		return
	}

	// Close the writer
	err = writer.Close()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to prepare upload",
		})
		return
	}

	// Create request to Cloudinary
	cloudinaryURL := fmt.Sprintf("https://api.cloudinary.com/v1_1/%s/image/upload", cloudName)
	req, err := http.NewRequest("POST", cloudinaryURL, body)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to create upload request",
		})
		return
	}

	// Set headers
	req.Header.Set("Content-Type", writer.FormDataContentType())

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to connect to upload service",
		})
		return
	}
	defer resp.Body.Close()

	// Read response
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to read upload response",
		})
		return
	}

	if resp.StatusCode != http.StatusOK {
		ctx.JSON(http.StatusBadGateway, utils.APIResponse{
			Success: false,
			Error:   fmt.Sprintf("Upload service error: %s", string(respBody)),
		})
		return
	}

	// Parse Cloudinary response
	var uploadResponse struct {
		PublicID  string `json:"public_id"`
		URL       string `json:"url"`
		SecureURL string `json:"secure_url"`
		Width     int    `json:"width"`
		Height    int    `json:"height"`
		Format    string `json:"format"`
	}

	err = json.Unmarshal(respBody, &uploadResponse)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.APIResponse{
			Success: false,
			Error:   "Failed to parse upload response",
		})
		return
	}

	ctx.JSON(http.StatusOK, utils.APIResponse{
		Success: true,
		Message: "Avatar uploaded successfully",
		Data: gin.H{
			"url":      uploadResponse.SecureURL,
			"publicId": uploadResponse.PublicID,
			"width":    uploadResponse.Width,
			"height":   uploadResponse.Height,
		},
	})
}
