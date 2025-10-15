package ai

import (
	"context"
	"fmt"
	"os"

	openai "github.com/sashabaranov/go-openai"
)

// {
//   "model": "moonshotai/Kimi-K2-Instruct:novita",
//   "messages": [
//     {
//       "role": "user",
//       "content": "Write a short realistic habit completion note for my habit called: Meditation. Only output the note, no extra explanation. Do not include dates."
//     }
//   ],
//   "max_tokens": 50,
//   "temperature": 0.9,
//   "top_p": 0.95
// }

func NewHFClient() *openai.Client {
	config := openai.DefaultConfig(os.Getenv("HF_TOKEN"))
	config.BaseURL = "https://router.huggingface.co/v1"
	return openai.NewClientWithConfig(config)
}

func GenerateHabitNote(habitName string) (string, error) {
	client := NewHFClient()
	ctx := context.Background()
	prompt := fmt.Sprintf(
		"Write a short realistic habit completion note for my habit called: %s. Only output the note, no extra explanation. Do not include dates.",
		habitName,
	)

	resp, err := client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: "moonshotai/Kimi-K2-Instruct:novita",
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleUser,
				Content: prompt,
			},
		},
		MaxTokens:   50,
		Temperature: 0.9,
		TopP:        0.95,
	})

	if err != nil {
		return "", err
	}

	if len(resp.Choices) == 0 {
		return "Feeling good about this one.", nil
	}

	return resp.Choices[0].Message.Content, nil
}
