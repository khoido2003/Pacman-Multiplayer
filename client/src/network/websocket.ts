// Function to generate UUID-like ID in browser using the Web Crypto API
const generateId = () => {
  const buffer = new Uint8Array(16);
  window.crypto.getRandomValues(buffer);

  // Convert the random bytes to a hexadecimal string
  const hex = [...buffer].map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex;
};

export enum EventType {
  OPEN = "open",
  MESSAGE = "message",
  ERROR = "error",
  CLOSE = "close",
}

export class WebSocketClient {
  private static instance: WebSocketClient | null = null;
  private ws: WebSocket | null = null;
  private userId: string = generateId();
  private server: string = `ws://localhost:5689/game`;
  private username: string = "";
  private eventHandler: Map<EventType, Function[]> = new Map();

  constructor(username: string) {
    this.username = username;
    this.connect();
  }

  // Singleton implementation
  public static getInstance(username: string): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient(username);
    }

    return WebSocketClient.instance;
  }

  //////////////////////////////////////////
  //
  //
  private connect() {
    const url =
      this.server + `?userId=${this.userId}` + `&username=${this.username}`;

    this.ws = new WebSocket(url);

    this.ws.onopen = (e) => {
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
  private triggerEvent(eventType: EventType, data?: any) {
    const handlers = this.eventHandler.get(eventType);

    // Check the map and process all the waiting function
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  public sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("Websocket is not open. Message not sent!");
    }
  }

  public on(eventType: EventType, handler: Function) {
    if (!this.eventHandler.has(eventType)) {
      this.eventHandler.set(eventType, []);
    }
    this.eventHandler.get(eventType)?.push(handler);
  }

  //////////////////////////////////////////////

  // Utility method

  public close() {
    this.ws?.close();
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public reconnect() {
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
