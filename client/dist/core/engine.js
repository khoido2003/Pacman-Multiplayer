export class GameEngine {
    update;
    render;
    ctx;
    lastFrameTime = 0;
    frameCnt = 0;
    fps = 0;
    constructor(update, render, ctx) {
        this.ctx = ctx;
        this.update = update;
        this.render = render;
    }
    start() {
        const loop = (timestamp) => {
            if (this.lastFrameTime) {
                const delta = (timestamp - this.lastFrameTime) / 1000;
                this.fps = Math.round(1 / delta);
            }
            this.lastFrameTime = timestamp;
            this.update();
            this.render();
            this.displayFPS();
            // The function to call when it's time to update your animation for
            // the next repaint. This callback function is passed a single
            // argument: timestamp
            requestAnimationFrame(loop);
        };
        loop(0);
    }
    displayFPS() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, 100, 30);
            this.ctx.font = "16px Arial";
            this.ctx.fillStyle = "white";
            this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
        }
    }
}
