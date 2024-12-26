package main

import (
	"log"
	"net/http"
	"server/internal/network"
)

func main() {
	// Start websocket server
	http.HandleFunc("/ws", network.HandleConnections)

	err := http.ListenAndServe("5689", nil)
	if err != nil {
		log.Fatal("Server failed to start! ", err)
	}

}
