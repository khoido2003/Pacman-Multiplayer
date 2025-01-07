import { MessageFormat } from "../network/messageFormat";
import { LOCAL_STORAGE_TYPE, MESSAGE_TYPE } from "../core/constant";
import { EventType, WebSocketClient } from "../network/websocket"; // Import your WebSocketClient class
const form = document.getElementById("createMatchForm");
const matchNameInput = document.getElementById("matchName");
const feedback = document.getElementById("feedback");
const feedbackMessage = document.getElementById("feedbackMessage");
///////////////////////////////////////////////////////////////
const username = localStorage.getItem(LOCAL_STORAGE_TYPE.USERNAME);
const userId = localStorage.getItem(LOCAL_STORAGE_TYPE.USER_ID);
const ws = WebSocketClient.getInstance(username);
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const matchName = matchNameInput.value.trim();
    if (matchName) {
        const message = MessageFormat.format(MESSAGE_TYPE.CREATE_MATCH, userId, "", {
            matchName,
        });
        ws.sendMessage(message);
        ws.on(EventType.MESSAGE, (data) => {
            console.log(data);
            const value = JSON.parse(data);
            localStorage.setItem(LOCAL_STORAGE_TYPE.CURRENT_MAP, JSON.stringify(value["data"]["map"]));
            localStorage.setItem(LOCAL_STORAGE_TYPE.CURRENT_ROOM_ID, value["data"]["room"]);
            window.location.href = "/match";
        });
    }
});
