"use strict";
var Lobby;
(function (Lobby) {
    const totalPlayersElement = document.getElementById("totalPlayers");
    const searchMatchesButton = document.getElementById("searchMatchesButton");
    const createMatchButton = document.getElementById("createMatchButton");
    const leaveLobbyButton = document.getElementById("leaveLobbyButton");
    const findFriendBtn = document.getElementById("findFriendsButton");
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
})(Lobby || (Lobby = {}));
