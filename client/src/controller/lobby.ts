import { LOCAL_STORAGE_TYPE } from "../core/constant";
import { WebSocketClient } from "../network/websocket";

namespace Lobby {
  const totalPlayersElement = document.getElementById(
    "totalPlayers",
  ) as HTMLParagraphElement;

  const searchMatchesButton = document.getElementById(
    "searchMatchesButton",
  ) as HTMLButtonElement;

  const createMatchButton = document.getElementById(
    "createMatchButton",
  ) as HTMLButtonElement;

  const leaveLobbyButton = document.getElementById(
    "leaveLobbyButton",
  ) as HTMLButtonElement;

  const findFriendBtn = document.getElementById(
    "findFriendsButton",
  ) as HTMLButtonElement;

  const username = localStorage.getItem(LOCAL_STORAGE_TYPE.USERNAME) as string;

  if (!username) {
    window.location.href = "/";
  }

  const ws = WebSocketClient.getInstance(username);
  console.log(ws.isConnected());

  ////////////////////////////////////////////

  // States

  let totalPlayers = 0;

  //////////////////////////////////////////

  // Render screen
  // Render the total player count
  const renderPlayerCount = () => {
    totalPlayersElement.textContent = totalPlayers + "";
  };

  // Navigate to Search Matches Page
  searchMatchesButton.addEventListener("click", () => {
    window.location.href = "/searchMatch";
  });

  // Navigate to Search players/friend page
  findFriendBtn.addEventListener("click", () => {
    window.location.href = "/searchPlayer";
  });

  // Create Match Button
  createMatchButton.addEventListener("click", () => {
    window.location.href = "/createMatch";
  });

  // Leave Lobby
  leaveLobbyButton.addEventListener("click", () => {
    console.log("Leave lobby button clicked");
    window.location.href = "/";
  });

  //////////////////////////////////////////////

  // Fetch data from socket

  // Simulated data
  totalPlayers = 1234; // Example total player count

  renderPlayerCount();
}
