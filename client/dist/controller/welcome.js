import { EventType, WebSocketClient } from "../network/websocket";
const welcomeForm = document.getElementById("welcomeForm");
/////////////////////////////////////////////////////////
welcomeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const usernameInput = document.getElementById("username");
    const username = usernameInput?.value.trim() || "User";
    if (username) {
        localStorage.setItem("username", username);
        const ws = WebSocketClient.getInstance(username);
        ws.on(EventType.OPEN, () => {
            console.log("Websocket connected!");
            window.location.href = "/lobby";
        });
        ws.on(EventType.MESSAGE, (data) => {
            console.log("Received: ", data);
        });
    }
});
//////////////////////////////////////////////////////////
