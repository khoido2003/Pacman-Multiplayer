namespace FindPlayer {
  const playerListElement = document.getElementById(
    "playerList",
  ) as HTMLUListElement;
  const searchPlayerInput = document.getElementById(
    "searchPlayerInput",
  ) as HTMLInputElement;
  const prevPageButton = document.getElementById(
    "prevPageButton",
  ) as HTMLButtonElement;
  const nextPageButton = document.getElementById(
    "nextPageButton",
  ) as HTMLButtonElement;
  const backToLobbyButton = document.getElementById(
    "backToLobbyButton",
  ) as HTMLButtonElement;

  /////////////////////////////////////////////////

  // States
  let players: string[] = [];
  let currentPage = 1;
  let playersPerPage = 10;

  ////////////////////////////////////////////////

  // Render

  const render = () => {
    const searchQuery = searchPlayerInput.value.trim().toLowerCase();
    const filteredPlayers = players.filter((player) =>
      player.toLowerCase().includes(searchQuery),
    );

    const startIndex = (currentPage - 1) * playersPerPage;
    const endIndex = startIndex + playersPerPage;
    const currentPlayers = filteredPlayers.slice(startIndex, endIndex);

    playerListElement.innerHTML = currentPlayers.length
      ? currentPlayers
          .map(
            (player) => `<li class="flex justify-between items-center mb-2">
              <span>${player}</span>
              <button class="ml-4 p-2 rounded-md bg-blue-500 text-gray-900 hover:bg-blue-400 transition text-sm inviteButton"
                data-player="${player}">
                Invite
              </button>
            </li>`,
          )
          .join("")
      : `<li>No players found.</li>`;

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = endIndex >= filteredPlayers.length;
  };

  // Pagination buttons
  prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      render();
    }
  });

  nextPageButton.addEventListener("click", () => {
    if ((currentPage - 1) * playersPerPage < players.length) {
      currentPage++;
      render();
    }
  });

  // Handle player search
  searchPlayerInput.addEventListener("input", render);

  // Handle inviting a player
  playerListElement.addEventListener("click", (event) => {
    const target = event.target as HTMLButtonElement;
    if (target.classList.contains("inviteButton")) {
      const playerName = target.getAttribute("data-player");
      console.log(`Invite sent to ${playerName}`);
      // Replace with WebSocket message to invite the player
    }
  });

  // Navigate back to lobby
  backToLobbyButton.addEventListener("click", () => {
    window.location.href = "/lobby";
  });

  // Simulated data for demonstration (replace with WebSocket updates)
  players = Array.from({ length: 50 }, (_, i) => `Player ${i + 1}`);
  render();
}
