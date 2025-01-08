package network

import (
	"encoding/json"
	"log"
	"server/internal/constant"
	"server/internal/game"
	"server/internal/utilities"
)

type MessageProcessor struct {
	workerPool    *Pool
	roomId        string
	room          *Room
	roomManager   *RoomManager
	client        *Client
	clientManager *ClientManager
}

func CreateNewMessageProcessor(wp *Pool, rm *RoomManager, client *Client, cm *ClientManager) *MessageProcessor {
	return &MessageProcessor{
		roomId:        "",
		room:          nil,
		roomManager:   rm,
		client:        client,
		clientManager: cm,
	}
}

/////////////////////////////////////////////////

// Process message from client
type MessageFormat struct {
	Type   string                 `json:"type"`
	UserId string                 `json:"userId"`
	Action string                 `json:"action"`
	Data   map[string]interface{} `json:"data"`
}

func (mp *MessageProcessor) ProcessMessage(message string) {

	var messageFormat MessageFormat

	//Handle message
	err := json.Unmarshal([]byte(message), &messageFormat)
	if err != nil {
		log.Println("Invalid input format:", err)
		return
	}

	log.Println("PRINT: ", message)

	roomId, ok := messageFormat.Data["roomId"].(string)

	log.Println("+_+_+_+_", roomId, ok)
	if !ok {
		log.Println("No room ID provided")
	} else {

		room, ok := mp.roomManager.GetCurrentRoom(roomId)
		log.Println(room, ok)

		mp.room = room
		go mp.room.AddCLientToRoom(mp.client.UserId, mp.client)
		mp.room.StartGame()

	}

	// room.AddCLientToRoom(mp.client.UserId, mp.client)
	//
	switch messageFormat.Type {
	case string(constant.CREATE_MATCH):
		mp.createNewRoomFn(messageFormat)

	case string(constant.UPDATE_PACMAN_POSITION):
		mp.room.InputChannel <- message

	case string(constant.REQUEST_FIND_PLAYERS_BY_NAME):
		mp.SearchRoomByName(messageFormat)

	default:
		log.Println("NOT A REQUEST TYPE")

	}
}

///////////////////////////////////////////////////
///////////////////////////////////////////////////

// Utilities function

// CREATE NEW ROOM/MATCH
func (mp *MessageProcessor) createNewRoomFn(messageFormat MessageFormat) {

	// Create new room
	room, roomId := mp.roomManager.CreateNewRoom()

	log.Println("RoomID: ", roomId)

	mp.room = room
	mp.roomId = roomId
	matchName, ok := messageFormat.Data["matchName"].(string)
	if !ok {
		log.Println("Error: matchName not found or is not a string")
		return
	}
	mp.room.RoomName = matchName

	// Add the relevant client to the room
	mp.roomManager.AddClientToRoom(roomId, mp.client)
	mp.client.AddRoomId(roomId)

	// Load the map to send to the client
	loadedMap, err := game.LoadMap()

	mp.room.SetCurrentMap(loadedMap.Tiles)

	if err != nil {
		log.Println(err)
	}

	msgJson, err := utilities.CreateMessage(string(constant.SEND_MAP), map[string]interface{}{
		"room": roomId,
		"map":  loadedMap,
	})

	if err != nil {
		log.Println("Error marshalling message:", err)
		return
	}

	mp.client.SendMessage(string(msgJson))
	mp.room.StartGame()
}

// ---------------------------------------------------

// SEARCH ROOM/MATCH

func (mp *MessageProcessor) SearchRoomByName(mes MessageFormat) {
	query := mes.Data["query"].(string)
	log.Println(query)

	listRooms := mp.roomManager.FindRoomByName(query)

	var sentData []string
	for _, room := range listRooms {
		sentData = append(sentData, room.RoomName)
	}

	msgJson, err := utilities.CreateMessage(string(constant.RESPONSE_FIND_PLAYERS_BY_NAME), map[string]interface {
	}{
		"usersList": sentData,
	})

	if err != nil {
		log.Println("Error marshalling message", err)
		return
	}

	mp.client.SendMessage(string(msgJson))

}
