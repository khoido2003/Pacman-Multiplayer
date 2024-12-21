export class GameEngine {
  private update: () => void;
  private render: () => void;
  private ctx: CanvasRenderingContext2D;
  private lastFrameTime: number = 0;
  private frameCnt: number = 0;
  private fps: number = 0;

  constructor(
    update: () => void,
    render: () => void,
    ctx: CanvasRenderingContext2D,
  ) {
    this.ctx = ctx;
    this.update = update;
    this.render = render;
  }

  start() {
    const loop = (timestamp: number) => {
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

  private displayFPS() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, 100, 30);
      this.ctx.font = "16px Arial";
      this.ctx.fillStyle = "white";
      this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
    }
  }
}
