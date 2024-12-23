import { CONST } from "./core/constant";
import { GameEngine } from "./core/engine";
import { EventManager } from "./core/events";
import { GameMap } from "./core/map";
import { Pacman } from "./core/pacman";

console.log("Running the scripts");

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

async function loadMap(): Promise<any> {
  // Load the map
  const response = await fetch("./assets/maps/map1.json");
  const data = await response.json();

  console.log(data);
  return data;
}

//////////////////////////////////////////////

let gameMap: GameMap;
let pacman: Pacman;
let events: EventManager;

async function init() {
  // Init Map
  const data = await loadMap();
  gameMap = new GameMap(data.tiles, CONST.TILE_SIZE, canvas, ctx!);

  // Init pacman
  // Calculate the first position of pacman on the map
  const startRow = CONST.PACMAN_START_ROW;
  const startCol = CONST.PACMAN_START_COL;

  const startX =
    startCol * CONST.TILE_SIZE + gameMap.getOffsetX + CONST.TILE_SIZE / 2;
  const startY =
    startRow * CONST.TILE_SIZE + gameMap.getOffsetY + CONST.TILE_SIZE / 2;

  pacman = new Pacman(ctx!, startX, startY, CONST.TILE_SIZE / 2, gameMap);

  // Init events
  events = new EventManager();

  // Register controls
  events.register("ArrowUp", () => pacman.move("up"));
  events.register("ArrowDown", () => pacman.move("down"));
  events.register("ArrowLeft", () => pacman.move("left"));
  events.register("ArrowRight", () => pacman.move("right"));
}

const engine = new GameEngine(
  // Function to update
  () => {
    // Update logic
    console.log("Update running");
  },

  // Function to render
  async () => {
    // Clear the canvas when the state reload
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    console.log("Render running");

    if (gameMap) {
      gameMap.render();
    }

    if (pacman) {
      pacman.render();
    }
  },
  ctx!,
);

// Run the game when the page is ready
document.addEventListener("DOMContentLoaded", async () => {
  // Prepare the resouces
  await init();

  // Start the loop
  engine.start();
});
