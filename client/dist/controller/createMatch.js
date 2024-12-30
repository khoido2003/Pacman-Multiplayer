const form = document.getElementById("createMatchForm");
const matchNameInput = document.getElementById("matchName");
const feedback = document.getElementById("feedback");
const feedbackMessage = document.getElementById("feedbackMessage");
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
export {};
