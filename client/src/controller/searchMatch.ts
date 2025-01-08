import { MessageFormat } from "../network/messageFormat";
import { LOCAL_STORAGE_TYPE, MESSAGE_TYPE } from "../core/constant";
import { EventType, WebSocketClient } from "../network/websocket";

namespace FindMatch {
  const debounce = (func: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const matchesElement = document.getElementById(
    "matchList",
  ) as HTMLUListElement;
  const searchMatchInput = document.getElementById(
    "searchMatchInput",
  ) as HTMLInputElement;
  const prevPageBtn = document.getElementById(
    "prevPageButton",
  ) as HTMLButtonElement;
  const nextPageBtn = document.getElementById(
    "nextPageButton",
  ) as HTMLButtonElement;

  /////////////////////////////////////\

  const username = localStorage.getItem(LOCAL_STORAGE_TYPE.USERNAME) as string;
  const userId = localStorage.getItem(LOCAL_STORAGE_TYPE.USER_ID) as string;

  const ws = WebSocketClient.getInstance(userId);

  /////////////////////////////////////////////

  // States

  let matches: string[] = [];
  let currentPage = 1;
  const matchesPerPage = 10;

  ////////////////////////////////////////////

  // Render
  const render = () => {
    const searchQuery = searchMatchInput.value.trim().toLowerCase();
    const filteredMatches = matches.filter((match) => {
      return match.toLowerCase().includes(searchQuery);
    });

    const startIndex = (currentPage - 1) * matchesPerPage;
    const endIndex = startIndex + matchesPerPage;

    const currentMatches = filteredMatches.slice(startIndex, endIndex);

    matchesElement.innerHTML = currentMatches.length
      ? currentMatches.map((match) => `<li>${match}</li>`).join("")
      : `<li>No matches available! Try again</li>`;

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = endIndex >= filteredMatches.length;
  };

  // Event listener
  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      render();
    }
  });

  nextPageBtn.addEventListener("click", () => {
    if ((currentPage - 1) * matchesPerPage < matches.length) {
      currentPage++;
      render();
    }
  });

  ///////////////////////////////////////////
  //
  const handleSearchInput = debounce(() => {
    const searchQuery = searchMatchInput.value.trim().toLowerCase();
    currentPage = 1; // Reset to the first page

    // Render current UI state
    render();

    // Send search query to the WebSocket server
    if (ws.isConnected()) {
      ws.sendMessage(
        MessageFormat.format(
          MESSAGE_TYPE.REQUEST_FIND_PLAYERS_BY_NAME,
          userId,
          "GET",
          { query: searchQuery },
        ),
      );
    } else {
      console.error("WebSocket is not connected!");
    }
  }, 300); // 300ms debounce delay

  searchMatchInput.addEventListener("input", handleSearchInput);

  ws.on(EventType.MESSAGE, (data: any) => {
    try {
      const parsedData = JSON.parse(data);

      console.log(parsedData);
    } catch (err) {
      console.error("Error parsing data from socket: ", err);
    }
  });

  ////////////////////////////////////

  render();
}
