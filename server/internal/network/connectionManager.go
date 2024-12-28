package network

import (
	"fmt"
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

type ConnectionManager struct {
	connections map[string]*websocket.Conn
	mu          sync.Mutex
}

func NewConnectionManager() *ConnectionManager {
	return &ConnectionManager{
		connections: make(map[string]*websocket.Conn),
	}
}

func (cm *ConnectionManager) AddConnection(userId string, conn *websocket.Conn) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	cm.connections[userId] = conn
	log.Println("Add new connection with userId: ", userId)
}

func (cm *ConnectionManager) RemoveConnection(userId string) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	conn, ok := cm.connections[userId]

	if ok {
		conn.Close()
	}
	delete(cm.connections, userId)

	log.Println("Remove connection with userId: ", userId)
}

func (cm *ConnectionManager) GetConnection(userId string) (*websocket.Conn, bool) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	conn, ok := cm.connections[userId]
	return conn, ok

}

func (cm *ConnectionManager) SendMessage(userId string, message string) error {
	conn, ok := cm.connections[userId]

	if !ok {
		return fmt.Errorf("User %s not found!", userId)
	}

	return conn.WriteMessage(websocket.TextMessage, []byte(message))
}
