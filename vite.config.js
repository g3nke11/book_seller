import { dirname, resolve } from "path";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "src/",
  publicDir: resolve(__dirname, "src/public"),

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        genre_page: resolve(__dirname, "src/shop-by-genre.html"),
        base: resolve(__dirname, "src/base.html"),
        bestsellter: resolve(__dirname, "src/bestseller.html"),
        about_us: resolve(__dirname, "src/about-us.html"),
        cart: resolve(__dirname, "src/cart.html")
      }
    }
  }
});
