import { WebSocketClient } from "../network/websocket"; // Import your WebSocketClient class

const form = document.getElementById("createMatchForm") as HTMLFormElement;
const matchNameInput = document.getElementById("matchName") as HTMLInputElement;
const feedback = document.getElementById("feedback") as HTMLDivElement;
const feedbackMessage = document.getElementById(
  "feedbackMessage",
) as HTMLParagraphElement;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const matchName = matchNameInput.value.trim();

  // if (matchName) {
  //   // Create the match through WebSocket
  //   const ws = WebSocketClient.getInstance(); // Assuming WebSocketClient manages the connection
  //   ws.on("OPEN", () => {
  //     console.log("WebSocket connected.");
  //     // Send the match creation message
  //     ws.send(JSON.stringify({ type: "createMatch", matchName }));
  //
  //     // Display feedback message
  //     feedbackMessage.textContent = `Match "${matchName}" created successfully!`;
  //     feedback.classList.remove("hidden");
  //   });
  //
  //   // You may want to add a listener for error or failed match creation
  //   ws.on("ERROR", (error) => {
  //     feedbackMessage.textContent = `Error creating match: ${error.message}`;
  //     feedback.classList.remove("hidden");
  //   });
  // }
});
