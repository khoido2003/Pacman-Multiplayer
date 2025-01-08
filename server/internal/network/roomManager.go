package network

import (
	"log"
	"strings"
	"sync"

	"github.com/google/uuid"
)

type RoomManager struct {
	Rooms map[string]*Room
	Mutex sync.Mutex
}

func NewRoomManager() *RoomManager {
	return &RoomManager{
		Rooms: make(map[string]*Room),
	}
}

func (rm *RoomManager) CreateNewRoom() (*Room, string) {
	rm.Mutex.Lock()
	defer rm.Mutex.Unlock()

	roomId := uuid.New().String()
	room := NewRoom(roomId)

	rm.Rooms[roomId] = room
	return room, roomId
}

func (rm *RoomManager) AddClientToRoom(roomId string, player *Client) *Room {

	rm.Mutex.Lock()
	defer rm.Mutex.Unlock()

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
	rm.Mutex.Lock()
	defer rm.Mutex.Unlock()

	room, ok := rm.Rooms[roomId]

	if !ok {
		return nil, false
	}
	return room, true
}

func containsIngnorecase(str, substr string) bool {
	str = strings.ToLower(str)
	substr = strings.ToLower(substr)

	return strings.Contains(str, substr)
}

func (rm *RoomManager) FindRoomByName(roomName string) []*Room {
	rm.Mutex.Lock()
	defer rm.Mutex.Unlock()

	var foundRooms []*Room

	for _, room := range rm.Rooms {
		if containsIngnorecase(room.RoomName, roomName) {
			foundRooms = append(foundRooms, room)
		}
	}

	return foundRooms

}

func (rm *RoomManager) RemoveRoom(roomId string) {
	delete(rm.Rooms, roomId)
}

func (rm *RoomManager) ViewAllRooms() {
	rm.Mutex.Lock()
	defer rm.Mutex.Unlock()

	for k, v := range rm.Rooms {
		log.Println("key: "+k+"---", v)
		log.Println("-------")
	}
}
