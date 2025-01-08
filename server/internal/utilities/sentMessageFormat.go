package utilities

import (
	"encoding/json"
	"log"
)

func CreateMessage(messageType string, data map[string]interface{}) ([]byte, error) {
	msg := map[string]interface{}{
		"type": messageType,
		"data": data,
	}

	// Marshal the message to JSON
	msgJson, err := json.Marshal(msg)
	if err != nil {
		log.Println("Error marshalling message:", err)
		return nil, err
	}

	return msgJson, nil
}
