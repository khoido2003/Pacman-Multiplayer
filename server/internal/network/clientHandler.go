package network

import (
	"log"

	"github.com/gorilla/websocket"
)

func HandleClient(conn *websocket.Conn) {

	// Close the connection when done
	defer conn.Close()

	log.Println("New client connect: ", conn.RemoteAddr())

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

		err = conn.WriteMessage(websocket.TextMessage, []byte("Connect to server successfully"))
		if err != nil {
			log.Println("Write error: ", err)
			break
		}
	}
}
