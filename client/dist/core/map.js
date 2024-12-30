import { CONST } from "./constant";
export class GameMap {
    canvas;
    ctx;
    tileSize;
    tiles;
    offsetX = 0;
    offsetY = 0;
    tilesMatrixPos;
    updateCallback = null;
    constructor(tiles, tileSize = CONST.TILE_SIZE, canvas, context) {
        this.canvas = canvas;
        this.ctx = context;
        this.tileSize = tileSize;
        this.tiles = tiles;
        // Calc the current position and width/height of the canvas and
        // re-render it
        this.resizeCanvas();
        this.tilesMatrixPos = this.calcOffsetMaze();
        console.log(this.tilesMatrixPos);
        console.log(this.tiles);
        // if the browser change size, update the canvas
        window.addEventListener("resize", () => {
            this.resizeCanvasAndUpdate();
        });
    }
    setUpdateCallback(callback) {
        this.updateCallback = callback;
    }
    resizeCanvasAndUpdate() {
        this.resizeCanvas();
        this.tilesMatrixPos = this.calcOffsetMaze();
        this.render();
        if (this.updateCallback) {
            this.updateCallback();
        }
    }
    ////////////////////////////////////
    // Calc the offset to make the maze in the center of the canvas
    //
    calcOffsetMaze() {
        const maxMazeHeight = this.tiles.length * this.tileSize;
        const maxMazeWidth = this.tiles[0].length * this.tileSize;
        this.offsetX = (this.canvas.width - maxMazeWidth) / 2;
        this.offsetY = (this.canvas.height - maxMazeHeight) / 2;
        // Mapping from tiles matrix to the real matrix that draw on canvas with
        // x coordinates and y coordinates
        const totalRows = Math.ceil(this.canvas.height / this.tileSize);
        const totalCols = Math.ceil(this.canvas.width / this.tileSize);
        const tilesMatrixPos = Array.from({ length: totalRows }, (_, row) => {
            return Array.from({ length: totalCols }, (_, col) => {
                // If the position is the same as the tiles matrix then keep the
                // original value, else return value  =0
                // Map canvas coordinates back to the tiles matrix
                const mazeX = col * this.tileSize - this.offsetX;
                const mazeY = row * this.tileSize - this.offsetY;
                const tileX = Math.floor(mazeX / this.tileSize);
                const tileY = Math.floor(mazeY / this.tileSize);
                if (tileY >= 0 &&
                    tileX >= 0 &&
                    tileY < this.tiles.length &&
                    tileX < this.tiles[0].length) {
                    return this.tiles[tileY][tileX] || 0;
                }
                return 0;
            });
        });
        console.log(this.tilesMatrixPos);
        return tilesMatrixPos;
    }
    // Calc canvas resize width and height
    resizeCanvas() {
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
    drawTile(y, x, tileValue) {
        switch (tileValue) {
            case 0:
                // The space where characters can move
                this.ctx.fillStyle = "#1a1a1a"; // Dark arcade-style background
                break;
            case 1:
                // Wall or obstacle that blocks the way
                this.ctx.fillStyle = "#1a1a1a"; // Muted retro blue for walls
                break;
        }
        const posX = x * this.tileSize + this.offsetX;
        const posY = y * this.tileSize + this.offsetY;
        // Draw the base tile
        this.ctx.fillRect(posX, posY, this.tileSize, this.tileSize);
        // Add a subtle glowing effect or border for walls
        if (tileValue === 1) {
            this.ctx.strokeStyle = "#00b8f4"; // Soft light cyan for border
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(posX, posY, this.tileSize, this.tileSize);
        }
        // // Dev mode: Add collision borders for easier debugging
        // if (this.devMode && tileValue === 1) {
        //   this.ctx.strokeStyle = "#ff00ff"; // Neon pink for dev mode borders
        //   this.ctx.lineWidth = 2;
        //   this.ctx.strokeRect(posX, posY, this.tileSize, this.tileSize);
        // }
    }
    ///////////////////////////////////////
    /// GETTERs / SETTERS
    get getOffsetX() {
        return this.offsetX;
    }
    get getOffsetY() {
        return this.offsetY;
    }
    get getTiles() {
        return this.tiles;
    }
    get getTilesMatrixPos() {
        return this.tilesMatrixPos;
    }
}
