const http = require("http");
const fs = require("fs");
const path = require("path");

// This will run the html file with node
const server = http.createServer((req, res) => {
  let filePath;

  // Handle multiple page
  switch (req.url) {
    case "/":
      filePath = path.join(__dirname, "./src/pages/index.html");
      break;

    default:
      filePath = path.join(__dirname, "./src/pages/404.html");
  }

  // Show file as request
  fs.readFile(filePath, (err, data) => {
    // If the file has problem
    if (err) {
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Internal server error");
      return;
    }

    res.writeHead(200, {
      "content-type": "text/html",
    });
    res.end(data);
  });
});

const PORT = 3214;

server.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
