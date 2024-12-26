package network

import "github.com/gorilla/websocket"

type Player struct {
	ID   string
	Name string
	Conn *websocket.Conn
}

type Room struct {
	ID      string
	Players map[string]*Player
}
