const connections = [];
let ws = null;
const broadcast = (message) => {
    connections.forEach((port) => port.postMessage(message));
};
self.onconnect = (event) => {
    const port = event.ports[0];
    connections.push(port);
};
export {};
