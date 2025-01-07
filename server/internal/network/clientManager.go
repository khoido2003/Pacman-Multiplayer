package network

import (
	"fmt"
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

type Client struct {
	UserId string
	RoomId string
	Conn   *websocket.Conn
	Mutex  sync.Mutex
}

func NewClient(userId *string, conn *websocket.Conn) *Client {
	return &Client{
		UserId: *userId,
		Conn:   conn,
		RoomId: "",
	}
}

func (client *Client) AddRoomId(roomId string) {
	client.RoomId = roomId
}

func (client *Client) RemoveRoomId() {
	client.RoomId = ""
}

func (client *Client) SendMessage(message string) {
	client.Conn.WriteMessage(websocket.TextMessage, []byte(message))
}

//////////////////////////////////////////////////

type ClientManager struct {
	connections map[string]*websocket.Conn
	mu          sync.Mutex
}

func NewClientManager() *ClientManager {
	return &ClientManager{
		connections: make(map[string]*websocket.Conn),
	}
}

func (cm *ClientManager) AddClient(client *Client, conn *websocket.Conn) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	cm.connections[client.UserId] = conn
	log.Println("Add new connection with userId: ", client.UserId)
}

func (cm *ClientManager) RemoveClient(client *Client) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	conn, ok := cm.connections[client.UserId]

	if ok {
		conn.Close()
	}
	delete(cm.connections, client.UserId)

	log.Println("Remove connection with UserId: ", client.UserId)
}

func (cm *ClientManager) GetClient(client *Client) (*websocket.Conn, bool) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	conn, ok := cm.connections[client.UserId]
	return conn, ok

}

func (cm *ClientManager) SendMessage(client *Client, message string) error {
	conn, ok := cm.connections[client.UserId]

	if !ok {
		return fmt.Errorf("User %s not found!", client.UserId)
	}

	return conn.WriteMessage(websocket.TextMessage, []byte(message))
}
