import { CONST } from "./constant";
import { GameMap } from "./map";

export class Pacman {
  private ctx: CanvasRenderingContext2D;

  private startRow: number = CONST.PACMAN_START_ROW;
  private startCol: number = CONST.PACMAN_START_COL;
  private gameMap: GameMap;

  // Init position in X cors
  private x: number;

  // Init position in Y cors
  private y: number;
  private size: number;
  private speed: number = CONST.PACMAN_SPEED;

  // There is two way to render the character: draw with canvas or use sprite
  // image and render it to the canvas

  //////////////////////////////////////////

  // Using canvas to draw the character
  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size = 30,
    gameMap: GameMap,
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = CONST.PACMAN_SPEED;
    this.gameMap = gameMap;

    // At first init, calc the the position of pacman in current window size
    this.calcCurrentPosition();

    window.addEventListener("resize", () => {
      // After the window change, calc the new position again
      this.calcCurrentPosition();

      // After that, re-render the screen to update
      this.render();
    });
  }

  private calcCurrentPosition() {
    this.x =
      this.startCol * CONST.TILE_SIZE +
      this.gameMap.getOffsetX +
      CONST.TILE_SIZE / 2;

    this.y =
      this.startRow * CONST.TILE_SIZE +
      this.gameMap.getOffsetY +
      CONST.TILE_SIZE / 2;
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

  // Control the pacman
  move(direction: string) {
    switch (direction) {
      case "up":
        this.y -= this.speed;
        break;

      case "down":
        this.y += this.speed;
        break;

      case "right":
        this.x += this.speed;
        break;

      case "left":
        this.x -= this.speed;
        break;
    }
  }
}
