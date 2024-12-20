export class GameMap {
    canvas;
    ctx;
    tileSize;
    tiles;
    constructor(tiles, tileSize = 32) {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.tileSize = tileSize;
        this.tiles = tiles;
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
    drawTile(x, y, tile) {
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
        this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
    }
}
