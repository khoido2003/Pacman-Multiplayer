import { LOCAL_STORAGE_TYPE } from "../core/constant";
// Function to generate UUID-like ID in browser using the Web Crypto API
const generateId = () => {
    const buffer = new Uint8Array(16);
    window.crypto.getRandomValues(buffer);
    // Convert the random bytes to a hexadecimal string
    const hex = [...buffer].map((b) => b.toString(16).padStart(2, "0")).join("");
    return hex;
};
export var EventType;
(function (EventType) {
    EventType["OPEN"] = "open";
    EventType["MESSAGE"] = "message";
    EventType["ERROR"] = "error";
    EventType["CLOSE"] = "close";
})(EventType || (EventType = {}));
export class WebSocketClient {
    static instance = null;
    ws = null;
    userId = "";
    server = `ws://localhost:5689/game`;
    username = "";
    eventHandler = new Map();
    constructor(username) {
        this.username = username;
        this.connect();
    }
    // Singleton implementation
    static getInstance(username) {
        if (!WebSocketClient.instance) {
            WebSocketClient.instance = new WebSocketClient(username);
        }
        localStorage.setItem(LOCAL_STORAGE_TYPE.USER_ID, WebSocketClient.instance.userId);
        return WebSocketClient.instance;
    }
    //////////////////////////////////////////
    //
    //
    connect() {
        if (!localStorage.getItem(LOCAL_STORAGE_TYPE.USER_ID)) {
            const userId = generateId();
            localStorage.setItem(LOCAL_STORAGE_TYPE.USER_ID, userId);
            this.userId = userId;
        }
        else {
            this.userId = localStorage.getItem(LOCAL_STORAGE_TYPE.USER_ID);
        }
        const url = this.server + `?userId=${this.userId}` + `&username=${this.username}`;
        this.ws = new WebSocket(url);
        this.ws.onopen = () => {
            this.triggerEvent(EventType.OPEN, null);
        };
        this.ws.onerror = (e) => {
            this.triggerEvent(EventType.ERROR, e);
        };
        this.ws.onmessage = (e) => {
            this.triggerEvent(EventType.MESSAGE, e.data);
        };
        this.ws.onclose = () => {
            this.triggerEvent(EventType.CLOSE, null);
        };
    }
    ///////////////////////////////////////////
    // Method to interact with server
    // Center Event controller
    triggerEvent(eventType, data) {
        const handlers = this.eventHandler.get(eventType);
        // Check the map and process all the waiting function
        if (handlers) {
            handlers.forEach((handler) => handler(data));
        }
    }
    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
        }
        else {
            console.error("Websocket is not open. Message not sent!");
        }
    }
    on(eventType, handler) {
        if (!this.eventHandler.has(eventType)) {
            this.eventHandler.set(eventType, []);
        }
        this.eventHandler.get(eventType)?.push(handler);
    }
    //////////////////////////////////////////////
    // Utility method
    close() {
        this.ws?.close();
    }
    isConnected() {
        console.log(this.ws);
        return this.ws?.readyState === 1;
    }
    reconnect() {
        if (this.ws) {
            this.close();
        }
        this.connect();
    }
}
//////////////////////////////////////////////
// GUIDE HOW TO USE METHOD:
// const wsClient = new WebSocketClient("username");
// wsClient.on(EventType.OPEN, () => {
//   console.log("Doing something");
// });
// wsClient.on(EventType.MESSAGE, (data: any) => {
//   console.log("Received message:", data);
// });
// wsClient.on(EventType.ERROR, (error: any) => {
//   console.error("WebSocket error:", error);
// });
// wsClient.on(EventType.CLOSE, () => {
//   console.log("WebSocket connection closed");
// });
// wsClient.sendMessage({ type: "chat", content: "Hello, server!" });
