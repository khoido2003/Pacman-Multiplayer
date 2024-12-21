import { CONST } from "./constant";

export class GameMap {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tileSize: number;
  private tiles: number[][];
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(
    tiles: number[][],
    tileSize: number = CONST.TILE_SIZE,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
  ) {
    this.canvas = canvas;
    this.ctx = context;
    this.tileSize = tileSize;
    this.tiles = tiles;

    // Calc the current position and width/height of the canvas and
    // re-render it
    this.resizeCanvas();
    this.calcOffsetMaze();

    // if the browser change size, update the canvas
    window.addEventListener("resize", () => {
      this.resizeCanvas();
      this.calcOffsetMaze();
      this.render();
    });
  }

  ////////////////////////////////////
  // Calc the offset to make the maze in the center of the canvas
  //
  private calcOffsetMaze() {
    const maxMazeHeight = this.tiles.length * this.tileSize;
    const maxMazeWidth = this.tiles[0].length * this.tileSize;

    this.offsetX = (this.canvas.width - maxMazeWidth) / 2;
    this.offsetY = (this.canvas.height - maxMazeHeight) / 2;
    console.log(this.tiles);
  }

  // Calc canvas resize width and height
  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  //////////////////////////////////////

  // Render the map on the screen
  render() {
    for (let r = 0; r < this.tiles.length; r++) {
      for (let c = 0; c < this.tiles[r].length; c++) {
        const tile = this.tiles[r][c];
        this.drawTile(r, c, tile);
      }
    }
  }

  // Draw tile
  private drawTile(y: number, x: number, tile: number) {
    switch (tile) {
      case 0:
        // The space where character can move
        this.ctx.fillStyle = "black";
        break;

      case 1:
        // Wall or obstacle that block the way
        this.ctx.fillStyle = "violet";
        break;
    }
    this.ctx.fillRect(
      // Hoành độ
      x * this.tileSize + this.offsetX,

      // Tung độ
      y * this.tileSize + this.offsetY,
      this.tileSize,
      this.tileSize,
    );
  }

  ///////////////////////////////////////
  /// GETTERs / SETTERS

  get getOffsetX(): number {
    return this.offsetX;
  }

  get getOffsetY(): number {
    return this.offsetY;
  }
}
