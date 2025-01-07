import { MessageFormat } from "../network/messageFormat";
import { WebSocketClient } from "../network/websocket";
import { CONST, Direction, LOCAL_STORAGE_TYPE, MESSAGE_TYPE } from "./constant";
export class Pacman {
    ctx;
    gameMap;
    // Use sprite to render pacman
    spriteSheet;
    direction = Direction.RIGHT;
    animationFrameCnt = 0;
    maxAnimationFrame = 2;
    // Control the frame time switching
    reRenderFrameTimeCnt = 0;
    maxReRenderFrameTime = 10;
    // Position in X cors
    x;
    // Position in Y cors
    y;
    size;
    // Store the init offset of each screen size
    curOffsetX;
    curOffsetY;
    // Control the velocity of the pacman
    speed = CONST.PACMAN_SPEED;
    movementCooldown = 0;
    movementCooldownMax = 10;
    ws;
    userId = localStorage.getItem(LOCAL_STORAGE_TYPE.USER_ID);
    username = localStorage.getItem(LOCAL_STORAGE_TYPE.USERNAME);
    roomId = localStorage.getItem(LOCAL_STORAGE_TYPE.CURRENT_ROOM_ID);
    // There is two way to render the character: draw with canvas or use sprite
    // image and render it to the canvas
    //////////////////////////////////////////
    // Using canvas to draw the character
    constructor(ctx, x, y, size = CONST.PACMAN_SIZE, gameMap) {
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
        const username = localStorage.getItem(LOCAL_STORAGE_TYPE.USERNAME);
        this.ws = WebSocketClient.getInstance(username);
    }
    ///////////////////////////////////////
    // Update the position of pacman on the map
    calcCurrentPosition() {
        console.log("PACMAN: ", this.gameMap.getOffsetX, this.gameMap.getOffsetY);
        // Determine the current tile position based on the map layout and offset
        const curTileX = Math.ceil((this.x - this.curOffsetX - CONST.TILE_SIZE / 2) / CONST.TILE_SIZE);
        const curTileY = Math.ceil((this.y - this.curOffsetY - CONST.TILE_SIZE / 2) / CONST.TILE_SIZE);
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
        }
        else if (this.direction === Direction.DOWN) {
            this.ctx.rotate(Math.PI / 2); // Rotate 90 degrees clockwise
        }
        // Draw the sprite frame to the canvas
        this.ctx.drawImage(this.spriteSheet, frameX * frameWidth, // X position of the current frame in the sprite sheet
        frameY * frameHeight, // Y position of the current frame in the sprite sheet
        frameWidth, // Width of the sprite frame
        frameHeight, // Height of the sprite frame
        // NOTICE: So normally the position will be this.x - this.size / 2 but since
        // the ctx already translate it above so only need to -this.size/2
        // to center the pacman
        -this.size / 2, // X position on canvas (centered)
        -this.size / 2, // Y position on canvas (centered)
        this.size, // Width to draw (scale as necessary)
        this.size);
        // Restore the canvas state to prevent cumulative transformations
        this.ctx.restore();
    }
    getFrameX() {
        // Since Pacman is always in the last column (index 4), we'll return 4
        return 4; // Pacman is always in the last column (index 4)
    }
    getFrameY() {
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
    canMove(direction) {
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
        // Check bounds and ensure the tile is walkable
        return (tileY >= 0 &&
            tileY < this.gameMap.getTilesMatrixPos.length &&
            tileX >= 0 &&
            tileX < this.gameMap.getTilesMatrixPos[0].length &&
            this.gameMap.getTilesMatrixPos[tileY][tileX] === 0);
    }
    changeDirection(direction) {
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
    move(direction) {
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
                if (this.canMove(Direction.UP)) {
                    this.y -= this.speed;
                }
                this.direction = Direction.UP;
                this.movementCooldown = 0;
                break;
            case Direction.DOWN:
                if (this.canMove(Direction.DOWN)) {
                    this.y += this.speed;
                }
                this.direction = Direction.DOWN;
                this.movementCooldown = 0;
                break;
            case Direction.RIGHT:
                if (this.canMove(Direction.RIGHT)) {
                    this.x += this.speed;
                }
                this.direction = Direction.RIGHT;
                this.movementCooldown = 0;
                break;
            case Direction.LEFT:
                if (this.canMove(Direction.LEFT)) {
                    this.x -= this.speed;
                }
                this.direction = Direction.LEFT;
                this.movementCooldown = 0;
                break;
        }
        setInterval(() => {
            this.updateDataToServer();
        }, 100);
        this.movementCooldown = this.movementCooldownMax;
    }
    updateDataToServer() {
        // Update the new postion to the server
        const mes = MessageFormat.format(MESSAGE_TYPE.UPDATE_PACMAN_POSITION, this.userId, "", {
            username: this.username,
            x: this.x,
            y: this.y,
            roomId: this.roomId,
        });
        this.ws.sendMessage(mes);
    }
}
