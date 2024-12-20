import { GameMap } from "./core/map";

console.log("Running the scripts");

async function loadMap(): Promise<any> {
  // Load the map
  const response = await fetch("./assets/maps/map1.json");
  const data = await response.json();

  console.log(data);
  return data;
}

async function startGame() {
  const mapData = await loadMap();
  const gameMap = new GameMap(mapData.tiles);

  gameMap.render();
}

// Run the game when the page is ready

document.addEventListener("DOMContentLoaded", startGame);
