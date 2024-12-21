import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: "./src", // Specify the root directory as src
  build: {
    rollupOptions: {
      input: {
        // Specify your HTML entry points
        main: path.resolve(__dirname, "src/pages/index.html"),
        game: path.resolve(__dirname, "src/pages/game.html"),
        about: path.resolve(__dirname, "src/pages/about.html"),
      },
    },
    outDir: "../dist", // Output folder for the built files
    emptyOutDir: true, // Clean the output directory before building
  },
  server: {
    open: true, // Automatically open the app in the browser
  },
});
