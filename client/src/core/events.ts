export class EventManager {
  // Create a map to store the event function for each key
  private handlers: {
    [key: string]: () => void;
  } = {};

  constructor() {
    document.addEventListener("keydown", (e) => {
      if (this.handlers[e.key]) {
        this.handlers[e.key]();
      }
    });
  }

  register(key: string, callback: () => void) {
    this.handlers[key] = callback;
  }
}
