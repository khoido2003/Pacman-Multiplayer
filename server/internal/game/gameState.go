package game

import (
	"log"
	"sync"
)

type GameState struct {
	CurrentMap       [][]int
	Ghosts           []*Ghost
	PlayersPositions []*PlayerPosition
	Mutex            sync.Mutex
	Changes          map[string]interface{}
}

func (gs *GameState) SetCurrentMap(currentMap [][]int) {
	gs.Mutex.Lock()
	defer gs.Mutex.Unlock()
	gs.CurrentMap = currentMap
}

func (gs *GameState) UpdateGameLogic() {

}

//////////////////////////////////////////////////

// Only send to the client the data changed(delta update)

func (gs *GameState) MarkChange(key string, value interface{}) {
	gs.Mutex.Lock()
	defer gs.Mutex.Unlock()

	if gs.Changes == nil {
		gs.Changes = make(map[string]interface{})
	}

	log.Println("MarkChange - Adding key:", key, "value:", value) // Debugging
	gs.Changes[key] = value
}

func (gs *GameState) ClearChanges() {
	gs.Changes = make(map[string]interface{})
}

/////////////////////////////////////////////////////////

// Example using delta update
// func (gs *GameState) UpdatePlayerPosition(playerId string, x, y int) {
//     gs.Mutex.Lock()
//     defer gs.Mutex.Unlock()
//
//     // Update player's position
//     for _, player := range gs.playersPosition {
//         if player.Id == playerId {
//             player.X = x
//             player.Y = y
//             break
//         }
//     }
//
//     // Mark the change
//     gs.MarkChange("player_"+playerId, map[string]int{"x": x, "y": y})
// }
