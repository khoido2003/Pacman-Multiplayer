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

func HandleConnections(w http.ResponseWriter, r *http.Request, pool *Pool) {

	// Manage clients connect to the server
	clientManager := NewClientManager()

	// Init Room Manager
	roomManager := NewRoomManager()

	////////////////////////////////////////////////////////////////

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

	go HandleClient(conn, clientManager, roomManager, &userID)

}
