const http = require("http");
const fs = require("fs").promises; // Use promises for async operations
const path = require("path");

const server = http.createServer(async (req, res) => {
  let filePath;
  let contentType = "text/html"; // Default content type

  try {
    // Routes handler
    if (req.url === "/match") {
      filePath = path.join(__dirname, "./src/pages/index.html");
    } else if (req.url === "/") {
      filePath = path.join(__dirname, "./src/pages/welcome.html");
    } else if (req.url === "/lobby") {
      filePath = path.join(__dirname, "./src/pages/lobby.html");
    } else if (req.url === "/searchMatch") {
      filePath = path.join(__dirname, "./src/pages/searchMatch.html");
    } else if (req.url === "/searchPlayer") {
      filePath = path.join(__dirname, "./src/pages/searchPlayer.html");
    } else if (req.url === "/createMatch") {
      filePath = path.join(__dirname, "./src/pages/createMatch.html");
    }

    /////////////////////////////////////////////////////////////

    // Resourse handler
    else if (req.url.startsWith("/styles/")) {
      filePath = path.join(__dirname, "src", req.url);
      contentType = "text/css";
    } else if (req.url.startsWith("/dist/")) {
      filePath = path.join(__dirname, req.url);
      if (!filePath.endsWith(".js")) {
        filePath += ".js";
      }
      const extname = path.extname(filePath);
      if (extname === ".js") {
        contentType = "application/javascript";
      } else if (extname === ".css") {
        contentType = "text/css";
      } else if (extname === ".json") {
        contentType = "application/json";
      } else if (extname === ".html") {
        contentType = "text/html";
      }
    } else if (req.url.startsWith("/assets/")) {
      console.log(req.url);
      filePath = path.join(__dirname, "src", req.url);
      const extname = path.extname(filePath);
      if (extname === ".json") {
        contentType = "application/json";
      }
      if (extname === ".png") {
        contentType = "image/png";
      } else if (extname === ".jpg" || extname === ".jpeg") {
        contentType = "image/jpeg";
      } else if (extname === ".gif") {
        contentType = "image/gif";
      } else if (extname === ".svg") {
        contentType = "image/svg+xml";
      } else if (extname === ".webp") {
        contentType = "image/webp";
      } else {
        contentType = "application/octet-stream"; // Default binary file type
      }
    } else {
      filePath = path.join(__dirname, "./src/pages/404.html");
    }

    const data = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (err) {
    console.error(`Error serving ${req.url}:`, err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

const PORT = 3214;
server.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});
