package network

import (
	"log"

	"github.com/gorilla/websocket"
)

func HandleClient(conn *websocket.Conn, cm *ClientManager, rm *RoomManager, userID *string) {
	log.Println("New client connected: ", conn.RemoteAddr())
	client := NewClient(userID, conn)

	// Close the connection when done and remove from the
	// ClientManager
	defer func() {
		conn.Close()
		cm.RemoveClient(client)
	}()

	for {
		_, message, err := conn.ReadMessage()

		if err != nil {
			log.Println("Read error: ", err)
			if websocket.IsCloseError(err, websocket.CloseNormalClosure) {
				log.Println("Client closed the connection normally: ", conn.RemoteAddr())
			} else {
				log.Println("Unexpected error, closing connection: ", conn.RemoteAddr())
			}
			break
		}

		log.Printf("Received message: %s\n", message)

		//////////////////////////////////

		// Process message
		MessageProcessor(string(message), rm, client, cm)

	}
}
