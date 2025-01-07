package network

import (
	"log"
	"server/internal/game"
	"time"
)

type Room struct {
	ID            string
	RoomName      string
	Players       map[string]*Client
	GameState     *game.GameState
	Ticker        *time.Ticker
	IsGameActive  bool
	WorkerPool    *Pool
	UpdateChannel chan *game.GameState
	InputChannel  chan string
}

func NewRoom(roomId string) *Room {
	var channel = make(chan *game.GameState)

	return &Room{
		ID:      roomId,
		Players: make(map[string]*Client),

		// Create new game state
		GameState:     &game.GameState{},
		Ticker:        time.NewTicker(100 * time.Millisecond),
		IsGameActive:  false,
		UpdateChannel: channel,
		InputChannel:  make(chan string),
	}
}

func (room *Room) SetCurrentMap(curMap [][]int) {
	room.GameState.SetCurrentMap(curMap)
}

func (room *Room) StartGame() {

	room.IsGameActive = true
	go room.GameLoop()
}

func (room *Room) AddCLientToRoom(clientId string, client *Client) {
	room.Players[clientId] = client
}

func (r *Room) GameLoop() {
	log.Println("GameLoop started for room:", r.ID)
	for r.IsGameActive {
		select {

		case input := <-r.InputChannel:
			r.ProcessPlayerInput(input)

		case state := <-r.UpdateChannel:
			go r.BroadcastGameState(state)

		case <-time.After(100 * time.Millisecond):
			r.GameState.UpdateGameLogic()
			r.UpdateChannel <- r.GameState
		}
	}
	log.Println("GameLoop ended for room:", r.ID)
}

func (room *Room) StopGame() {
	if !room.IsGameActive {
		return
	}

	room.IsGameActive = false
	close(room.UpdateChannel)
	close(room.InputChannel)
}

////////////////////////////////////////////////////////

func (r *Room) ProcessPlayerInput(input string) {
	log.Println("PROCESS:", input)
}

func (r *Room) BroadcastGameState(state *game.GameState) {

	deltaUpdate := state.Changes
	state.ClearChanges()

	msg := map[string]interface{}{
		"type": "GAME_UPDATE",
		"data": deltaUpdate,
	}

	for _, player := range r.Players {

		player.Mutex.Lock()
		err := player.Conn.WriteJSON(msg)
		player.Mutex.Unlock()

		if err != nil {
			log.Println("Error sending message to player", player.UserId, err)
		}
	}
}
