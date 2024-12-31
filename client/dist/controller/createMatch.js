import { MESSAGE_TYPE } from "../core/constant";
import { EventType, WebSocketClient } from "../network/websocket"; // Import your WebSocketClient class
const form = document.getElementById("createMatchForm");
const matchNameInput = document.getElementById("matchName");
const feedback = document.getElementById("feedback");
const feedbackMessage = document.getElementById("feedbackMessage");
///////////////////////////////////////////////////////////////
const username = localStorage.getItem("username");
const ws = WebSocketClient.getInstance(username);
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const matchName = matchNameInput.value.trim();
    if (matchName) {
        ws.on(EventType.MESSAGE, (data) => {
            console.log(data);
        });
        const message = MESSAGE_TYPE.CREATE_MATCH + ":" + matchName;
        ws.sendMessage(message);
    }
});
