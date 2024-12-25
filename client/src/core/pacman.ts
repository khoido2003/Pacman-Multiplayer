import { CONST, Direction } from "./constant";
import { GameMap } from "./map";

export class Pacman {
  private ctx: CanvasRenderingContext2D;
  private gameMap: GameMap;

  // Use sprite to render pacman
  private spriteSheet: HTMLImageElement;
  private direction: Direction = Direction.RIGHT;
  private animationFrameCnt: number = 0;
  private maxAnimationFrame: number = 2;

  // Control the frame time switching
  private reRenderFrameTimeCnt = 0;
  private maxReRenderFrameTime = 10;

  // Position in X cors
  private x: number;

  // Position in Y cors
  private y: number;
  private size: number;

  // Store the init offset of each screen size
  private curOffsetX: number;
  private curOffsetY: number;

  // Control the velocity of the pacman
  private speed: number = CONST.PACMAN_SPEED;
  private movementCooldown = 0;
  private movementCooldownMax = 10;

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
    this.spriteSheet = new Image();
    this.spriteSheet.onload = () => {
      console.log("Sprite sheet loaded successfully!");
      this.render(); // Ensure render happens only after the image is loaded
    };

    this.spriteSheet.onerror = (error) => {
      console.error("Failed to load sprite sheet", error);
    };
    this.spriteSheet.src = "../assets/sprites/sprite.png";
  }

  ///////////////////////////////////////

  // Update the position of pacman on the map
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
    // // Draw the body
    // this.ctx.beginPath();
    // this.ctx.arc(this.x, this.y, this.size, 0.2 * Math.PI, 1.8 * Math.PI);
    // this.ctx.lineTo(this.x, this.y);
    // this.ctx.fillStyle = "yellow";
    // this.ctx.fill();
    // this.ctx.closePath();
    //
    // // Draw the eye
    // this.ctx.beginPath();
    // this.ctx.arc(
    //   this.x,
    //   this.y - this.size / 2.5,
    //   this.size / 7,
    //   0,
    //   2 * Math.PI,
    // );
    // this.ctx.fillStyle = "black";
    // this.ctx.fill();
    // this.ctx.closePath();
    //

    //////////////////

    // Making the pacman open and close mouth animation
    this.reRenderFrameTimeCnt++;
    if (this.reRenderFrameTimeCnt == this.maxReRenderFrameTime) {
      this.animationFrameCnt++;
      this.reRenderFrameTimeCnt = 0;
    }

    if (this.animationFrameCnt >= this.maxAnimationFrame) {
      this.animationFrameCnt = 0;
    }

    const frameX = this.getFrameX();
    const frameY = this.getFrameY();

    // Use the calculated frame size(The image is 692 x 1024)
    const frameWidth = 138; // Width of each frame in the sprite sheet
    const frameHeight = 171; // Height of each frame in the sprite sheet

    this.move(this.direction);
    // Save the canvas state before transformations
    this.ctx.save();

    // Move the canvas origin to the sprite's position
    this.ctx.translate(this.x, this.y);

    if (this.direction === Direction.UP) {
      this.ctx.rotate(-Math.PI / 2); // Rotate 90 degrees counterclockwise
    } else if (this.direction === Direction.DOWN) {
      this.ctx.rotate(Math.PI / 2); // Rotate 90 degrees clockwise
    }

    // Draw the sprite frame to the canvas
    this.ctx.drawImage(
      this.spriteSheet,
      frameX * frameWidth, // X position of the current frame in the sprite sheet
      frameY * frameHeight, // Y position of the current frame in the sprite sheet
      frameWidth, // Width of the sprite frame
      frameHeight, // Height of the sprite frame

      // NOTICE: So normally the position will be this.x - this.size / 2 but since
      // the ctx already translate it above so only need to -this.size/2
      // to center the pacman
      -this.size / 2, // X position on canvas (centered)
      -this.size / 2, // Y position on canvas (centered)
      this.size, // Width to draw (scale as necessary)
      this.size, // Height to draw (scale as necessary)
    );

    // Restore the canvas state to prevent cumulative transformations
    this.ctx.restore();
  }

  getFrameX(): number {
    // Since Pacman is always in the last column (index 4), we'll return 4
    return 4; // Pacman is always in the last column (index 4)
  }

  getFrameY(): number {
    const openMouthLeftFrame = [2, 4];
    const openMouthRightFrame = [1, 3];

    const frame = this.animationFrameCnt % this.maxAnimationFrame;

    // Determine the correct row for the direction
    switch (this.direction) {
      case Direction.RIGHT:
        return openMouthRightFrame[frame]; // Row 0 for moving right
      case Direction.LEFT:
        return openMouthLeftFrame[frame]; // Row 1 for moving left
      case Direction.UP:
        return openMouthRightFrame[frame];
      case Direction.DOWN:
        return openMouthRightFrame[frame];
      default:
        return 1; // Default to turn right
    }
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

  changeDirection(direction: Direction) {
    switch (direction) {
      case Direction.UP:
        this.direction = Direction.UP;
        break;

      case Direction.DOWN:
        this.direction = Direction.DOWN;
        break;

      case Direction.RIGHT:
        this.direction = Direction.RIGHT;
        break;

      case Direction.LEFT:
        this.direction = Direction.LEFT;
        break;
    }
  }

  // Control the pacman
  move(direction: Direction) {
    // Update the direction immediately without waiting for cooldown
    if (this.direction !== direction) {
      this.direction = direction;
    }

    if (this.movementCooldown > 0) {
      this.movementCooldown--;
      return;
    }

    switch (direction) {
      case Direction.UP:
        if (this.canMove(Direction.UP)) this.y -= this.speed;
        this.direction = Direction.UP;
        this.movementCooldown = 0;

        break;

      case Direction.DOWN:
        if (this.canMove(Direction.DOWN)) this.y += this.speed;
        this.direction = Direction.DOWN;
        this.movementCooldown = 0;

        break;

      case Direction.RIGHT:
        if (this.canMove(Direction.RIGHT)) this.x += this.speed;
        this.direction = Direction.RIGHT;
        this.movementCooldown = 0;

        break;

      case Direction.LEFT:
        if (this.canMove(Direction.LEFT)) this.x -= this.speed;
        this.direction = Direction.LEFT;
        this.movementCooldown = 0;

        break;
    }

    this.movementCooldown = this.movementCooldownMax;
  }
}
