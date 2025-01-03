package network

import (
	"encoding/json"
	"log"
	"server/internal/constant"
	"server/internal/game"
	"strings"
)

func MessageProcessor(message string, rm *RoomManager, client *Client, cm *ClientManager) {

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
		loadedMap, err := game.LoadMap()

		if err != nil {
			log.Println(err)
		}

		mapJson, err := json.Marshal(loadedMap)
		client.SendMessage(string(constant.SEND_MAP) + ":" + string(mapJson))

	default:
		log.Println("NOT A REQUEST TYPE")

	}
}
