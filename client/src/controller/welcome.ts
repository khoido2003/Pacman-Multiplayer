import { EventType, WebSocketClient } from "../network/websocket";

const welcomeForm = document.getElementById("welcomeForm") as HTMLFormElement;

/////////////////////////////////////////////////////////

welcomeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const usernameInput = document.getElementById("username") as HTMLInputElement;
  const username = usernameInput?.value.trim() || "User";

  if (username) {
    localStorage.setItem("username", username);
    const ws = WebSocketClient.getInstance(username);

    ws.on(EventType.OPEN, () => {
      console.log("Websocket connected!");
    });

    ws.on(EventType.MESSAGE, (data: string) => {
      console.log("Received: ", data);
    });
  }

  window.location.href = "/lobby";
});

//////////////////////////////////////////////////////////
