package game

import "server/internal/network"

type GameState struct {
	Players map[string]*network.Player
}

func NewGameState() *GameState {
	return &GameState{
		Players: make(map[string]*network.Player),
	}
}

func (g *GameState) HandlePlayerAction(playerID string, msg []byte) {

}

func NewPlayerJoinedMessage(playerID string) map[string]interface{} {
	return map[string]interface {
	}{
		"type":     "playerJoined",
		"playerID": playerID,
	}
}
