import { MESSAGE_TYPE } from "../core/constant";
import { EventType, WebSocketClient } from "../network/websocket"; // Import your WebSocketClient class

const form = document.getElementById("createMatchForm") as HTMLFormElement;
const matchNameInput = document.getElementById("matchName") as HTMLInputElement;
const feedback = document.getElementById("feedback") as HTMLDivElement;
const feedbackMessage = document.getElementById(
  "feedbackMessage",
) as HTMLParagraphElement;

///////////////////////////////////////////////////////////////

const username = localStorage.getItem("username") as string;
const ws = WebSocketClient.getInstance(username);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const matchName = matchNameInput.value.trim();

  if (matchName) {
    ws.on(EventType.MESSAGE, (data: string) => {
      console.log(data);
    });

    const message = MESSAGE_TYPE.CREATE_MATCH + ":" + matchName;
    ws.sendMessage(message);
  }
});
