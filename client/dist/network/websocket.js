export class WebSocketClient {
    ws;
    constructor() {
        this.ws = new WebSocket("ws://localhost:5689/game");
        this.ws.onopen = (event) => {
            this.ws.send("Hi server");
        };
        this.ws.onmessage = (event) => {
            console.log(event.data);
        };
        this.ws.onerror = (event) => {
            console.log(event);
        };
        this.ws.onclose = (event) => {
            console.log("Disconnected from websocket server");
        };
    }
}
