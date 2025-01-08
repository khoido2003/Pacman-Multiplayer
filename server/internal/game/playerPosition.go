package game

type PlayerPosition struct {
	Username string
	UserId   string
	X        float64
	Y        float64
}

func NewPlayerPosition(username string, userId string, x float64, y float64) *PlayerPosition {
	return &PlayerPosition{
		UserId:   userId,
		Username: username,
		X:        x,
		Y:        y,
	}
}

func (playerPos *PlayerPosition) UpdatePosition(x float64, y float64) {
	playerPos.X = x
	playerPos.Y = y
}
