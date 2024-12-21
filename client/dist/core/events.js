export class EventManager {
    // Create a map to store the event function for each key
    handlers = {};
    constructor() {
        document.addEventListener("keydown", (e) => {
            if (this.handlers[e.key]) {
                this.handlers[e.key]();
            }
        });
    }
    register(key, callback) {
        this.handlers[key] = callback;
    }
}
