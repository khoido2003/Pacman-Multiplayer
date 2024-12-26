package network

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// Start the socket server
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all connections
	},
}

func HandleConnections(w http.ResponseWriter, r *http.Request) {
	// Upgrade the HTTP connection to WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Println(err)
		return
	}

	// Close the connection if error exists
	defer conn.Close()

	//	playerID := r.URL.Query().Get("playerID")

	// Receive request connection from clients
	for {
		_, msg, err := conn.ReadMessage()

		if err != nil {
			log.Println("Error reading message: ", err)
			break
		}
		log.Println("Received messages: ", string(msg))

		err = conn.WriteMessage(websocket.TextMessage, []byte("Successfully connect to server"))
		if err != nil {
			log.Println("Error writing message to client: ", err)
			break
		}
	}
}

func handlePlayerGameLogic(playerID string) {

}
