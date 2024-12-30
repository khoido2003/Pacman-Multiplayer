namespace FindMatch {
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

    searchMatchInput.addEventListener("input", render);
  };

  render();
}
