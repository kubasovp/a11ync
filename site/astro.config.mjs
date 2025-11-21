// @ts-check
import mdx from "@astrojs/mdx";
import { defineConfig } from 'astro/config';

export default defineConfig({
  integrations: [mdx()],
  vite: {
    resolve: {
      alias: {
        a11ync: new URL("../src/", import.meta.url).pathname
      }
    }
  }
});
