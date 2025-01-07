package game

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

type MapData struct {
	Tiles [][]int `json:"tiles"`
}

func LoadMap() (MapData, error) {
	// Get the absolute path of the current working directory
	wd, err := os.Getwd()
	if err != nil {
		return MapData{}, fmt.Errorf("Failed to get working directory: %v", err)
	}

	// Build the absolute path to the map file
	readFilePath := filepath.Join(wd, "..", "..", "internal", "assets", "map-1.json") // Adjust based on your folder structure

	// Read the file
	data, err := os.ReadFile(readFilePath)
	if err != nil {
		return MapData{}, fmt.Errorf("Failed to read map: %v", err)
	}

	var gameMap MapData
	err = json.Unmarshal(data, &gameMap)
	if err != nil {
		return MapData{}, fmt.Errorf("Failed to unmarshal map data: %v", err)
	}

	fmt.Println("Map loaded successfully!")
	return gameMap, nil
}
