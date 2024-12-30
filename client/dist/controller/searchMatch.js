"use strict";
var FindMatch;
(function (FindMatch) {
    const matchesElement = document.getElementById("matchList");
    const searchMatchInput = document.getElementById("searchMatchInput");
    const prevPageBtn = document.getElementById("prevPageButton");
    const nextPageBtn = document.getElementById("nextPageButton");
    /////////////////////////////////////////////
    // States
    let matches = [];
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
})(FindMatch || (FindMatch = {}));
