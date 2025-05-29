import { dirname, resolve } from "path";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        genre_page: resolve(__dirname, "src/shop-by-genre"),
        about_us: resolve(__dirname, "src/about-us.html")
      }
    }
  }
});
