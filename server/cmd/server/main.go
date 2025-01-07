package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"server/internal/network"
	"syscall"
)

func main() {

	// Create new threadpool with 500 worker
	workerPool := network.NewPool(500)

	// Manage clients connect to the server
	clientManager := network.NewClientManager()

	// Init Room Manager
	roomManager := network.NewRoomManager()

	// Start websocket server
	http.HandleFunc("/game", func(response http.ResponseWriter, request *http.Request) {
		network.HandleConnections(response, request, workerPool, clientManager, roomManager)
	})

	// Setup the server
	server := &http.Server{Addr: ":5689"}

	///////////////////////////////////////////////////////////////

	// This make sure clean up the resource after shutdown the server
	signalChan := make(chan os.Signal, 1)

	// receive shutdown signal like ctrl + C in terminal
	signal.Notify(signalChan, os.Interrupt, syscall.SIGTERM)

	// Signal handling: Create a new goroutine to run the cleanup when
	// shutdown the server with ctrl C in the terminal
	go func() {
		<-signalChan
		log.Println("Shutting down server...")
		workerPool.Stop()
		server.Close()
	}()

	///////////////////////////////////////////////////////////////

	log.Println("Websocket server started on port :5689")
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal("ListenAndServe Error: ", err)
	}
}
