package network

import (
	"log"
	"server/internal/constant"
	"strings"

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

		///////////////////////////////////

		// Handle message

		trimmedMes := strings.Trim(string(message), `"`)
		mesArr := strings.Split(string(trimmedMes), ":")

		reqType := constant.RequestType(mesArr[0])
		data := mesArr[1]

		log.Println(reqType)

		switch reqType {
		case constant.CREATE_MATCH:
			room, roomId := rm.CreateNewRoom()
			log.Println(data, room)
			rm.AddClientToRoom(roomId, client)
			client.AddRoomId(roomId)

		default:
			log.Println("NOT A REQUEST TYPE")

		}

		err = conn.WriteMessage(websocket.TextMessage, []byte("Connect to server successfully"))
		if err != nil {
			log.Println("Write error: ", err)
			break
		}
	}
}
