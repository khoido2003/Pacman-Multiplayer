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
	// Upgrade the HTTP connection to WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Println(err)
		return
	}

	// Let the worker handle the message for each client

	go HandleClient(conn)

}
