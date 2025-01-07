package constant

type RequestType string

const (
	CREATE_MATCH           RequestType = "CREATE_MATCH"
	SEND_MAP               RequestType = "SEND_MAP"
	UPDATE_PACMAN_POSITION RequestType = "UPDATE_PACMAN_POSITION"
)
