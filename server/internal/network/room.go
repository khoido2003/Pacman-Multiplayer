package network

import (
	"log"
	"time"
)

type GameState struct {
	Score map[string]int
}

type Room struct {
	ID           string
	Players      map[string]*Client
	GameState    GameState
	Ticker       *time.Ticker
	IsGameActive bool
}

func NewRoom(roomId string) *Room {
	return &Room{
		ID:      roomId,
		Players: make(map[string]*Client),
		GameState: GameState{
			Score: make(map[string]int),
		},
		Ticker:       time.NewTicker(100 * time.Millisecond),
		IsGameActive: false,
	}
}

/////////////////////////////////////////////////

// Game loop

func (r *Room) StartGameLoop() {
	r.IsGameActive = true

	go func() {
		for range r.Ticker.C {
			if !r.IsGameActive {
				break
			}
			// Handle game logic here

		}

	}()
}

////////////////////////////////////////////////////////

type GameMessage struct {
	Type    string `json:"type"`
	Content string `json:"content"`
}

func (r *Room) BroadcastGameState(msg GameMessage) {
	for _, player := range r.Players {

		err := player.Conn.WriteJSON(msg)

		if err != nil {
			log.Println("Error sending message to player", player.UserId, err)
		}
	}
}
