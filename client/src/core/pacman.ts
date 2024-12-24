import { CONST, Direction } from "./constant";
import { GameMap } from "./map";

interface Position {
  x: number;
  y: number;
}

export class Pacman {
  private ctx: CanvasRenderingContext2D;

  private startRow: number = CONST.PACMAN_START_ROW;
  private startCol: number = CONST.PACMAN_START_COL;
  private gameMap: GameMap;

  // Position in X cors
  private x: number;

  // Position in Y cors
  private y: number;
  private size: number;
  private speed: number = CONST.PACMAN_SPEED;

  // Store the init offset of each screen size
  private curOffsetX: number;
  private curOffsetY: number;

  // There is two way to render the character: draw with canvas or use sprite
  // image and render it to the canvas

  //////////////////////////////////////////

  // Using canvas to draw the character
  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number = CONST.PACMAN_SIZE,
    gameMap: GameMap,
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = CONST.PACMAN_SPEED;
    this.gameMap = gameMap;

    this.curOffsetX = gameMap.getOffsetX;
    this.curOffsetY = gameMap.getOffsetY;

    this.gameMap.setUpdateCallback(() => {
      this.calcCurrentPosition();
      this.render();
    });
  }

  calcCurrentPosition() {
    console.log("PACMAN: ", this.gameMap.getOffsetX, this.gameMap.getOffsetY);

    // Determine the current tile position based on the map layout and offset
    const curTileX = Math.ceil(
      (this.x - this.curOffsetX - CONST.TILE_SIZE / 2) / CONST.TILE_SIZE,
    );
    const curTileY = Math.ceil(
      (this.y - this.curOffsetY - CONST.TILE_SIZE / 2) / CONST.TILE_SIZE,
    );

    console.log(curTileX, curTileY);

    // Recalculate the exact pixel position to align with the center of the tile
    this.x =
      curTileX * CONST.TILE_SIZE +
      this.gameMap.getOffsetX +
      CONST.TILE_SIZE / 2;
    this.y =
      curTileY * CONST.TILE_SIZE +
      this.gameMap.getOffsetY +
      CONST.TILE_SIZE / 2;

    this.curOffsetX = this.gameMap.getOffsetX;
    this.curOffsetY = this.gameMap.getOffsetY;
  }

  ///////////////////////////////////////////////////
  //
  //Render pacman on the screen

  render() {
    // Draw the body
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0.2 * Math.PI, 1.8 * Math.PI);
    this.ctx.lineTo(this.x, this.y);
    this.ctx.fillStyle = "yellow";
    this.ctx.fill();
    this.ctx.closePath();

    // Draw the eye
    this.ctx.beginPath();
    this.ctx.arc(
      this.x,
      this.y - this.size / 2.5,
      this.size / 7,
      0,
      2 * Math.PI,
    );
    this.ctx.fillStyle = "black";
    this.ctx.fill();
    this.ctx.closePath();
  }

  ////////////////////////////////////////////

  canMove(direction: Direction): boolean {
    // Calculate the next position based on the current direction
    let nextX = this.x;
    let nextY = this.y;

    switch (direction) {
      case Direction.UP:
        nextY -= this.speed;
        break;
      case Direction.DOWN:
        nextY += this.speed;
        break;
      case Direction.RIGHT:
        nextX += this.speed;
        break;
      case Direction.LEFT:
        nextX -= this.speed;
        break;
    }

    // Convert the next position to tile indices
    const tileX = Math.round(nextX / CONST.TILE_SIZE);
    const tileY = Math.round(nextY / CONST.TILE_SIZE);
    console.log(tileX, tileY, this.gameMap.getTilesMatrixPos[tileY][tileX]);

    // Check bounds and ensure the tile is walkable
    return (
      tileY >= 0 &&
      tileY < this.gameMap.getTilesMatrixPos.length &&
      tileX >= 0 &&
      tileX < this.gameMap.getTilesMatrixPos[0].length &&
      this.gameMap.getTilesMatrixPos[tileY][tileX] === 0
    );
  }

  // Control the pacman
  move(direction: Direction) {
    switch (direction) {
      case Direction.UP:
        if (this.canMove(Direction.UP)) this.y -= this.speed;
        break;

      case Direction.DOWN:
        if (this.canMove(Direction.DOWN)) this.y += this.speed;
        break;

      case Direction.RIGHT:
        if (this.canMove(Direction.RIGHT)) this.x += this.speed;
        break;

      case Direction.LEFT:
        if (this.canMove(Direction.LEFT)) this.x -= this.speed;
        break;
    }
  }
}
