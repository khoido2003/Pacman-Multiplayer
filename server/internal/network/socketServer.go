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

func HandleConnections(w http.ResponseWriter, r *http.Request, workerPool *Pool, clientManager *ClientManager, roomManager *RoomManager) {

	// Upgrade the HTTP connection to WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	userID := r.URL.Query().Get("userId")
	if userID == "" {
		log.Println("No userId provided")
		return
	}
	log.Printf("New connection from userID: %s\n", userID)

	go HandleClient(conn, workerPool, clientManager, roomManager, &userID)

}
