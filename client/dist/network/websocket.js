// Function to generate UUID-like ID in browser using the Web Crypto API
const generateId = () => {
    const buffer = new Uint8Array(16);
    window.crypto.getRandomValues(buffer); // Fill the array with random values
    // Convert the random bytes to a hexadecimal string
    const hex = [...buffer].map((b) => b.toString(16).padStart(2, "0")).join("");
    return hex;
};
console.log(generateId()); // Outputs a random hex string (UUID-like)
export class WebSocketClient {
    ws;
    userId = generateId();
    constructor() {
        this.ws = new WebSocket(`ws://localhost:5689/game?userId=${this.userId}`);
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
