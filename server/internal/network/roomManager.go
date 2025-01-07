package network

import (
	"log"

	"github.com/google/uuid"
)

type RoomManager struct {
	Rooms map[string]*Room
}

func NewRoomManager() *RoomManager {
	return &RoomManager{
		Rooms: make(map[string]*Room),
	}
}

func (rm *RoomManager) CreateNewRoom() (*Room, string) {
	roomId := uuid.New().String()
	room := NewRoom(roomId)

	rm.Rooms[roomId] = room
	return room, roomId
}

func (rm *RoomManager) AddClientToRoom(roomId string, player *Client) *Room {
	room, exists := rm.Rooms[roomId]
	if !exists {
		log.Println("Room does not exists")
		return nil
	}

	if len(room.Players) > 2 {
		log.Println("Room is full")
		return nil
	}

	room.Players[player.UserId] = player

	return room
}

func (rm *RoomManager) GetCurrentRoom(roomId string) (*Room, bool) {
	room, ok := rm.Rooms[roomId]

	if !ok {
		return nil, false
	}
	return room, true
}

func (rm *RoomManager) RemoveRoom(roomId string) {
	delete(rm.Rooms, roomId)
}

func (rm *RoomManager) ViewAllRooms() {
	for k, v := range rm.Rooms {
		log.Println("key: "+k+"---", v)
		log.Println("-------")
	}
}
