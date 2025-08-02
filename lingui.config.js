import {defineConfig} from "@lingui/cli";

export default defineConfig({
  sourceLocale: "en",
  locales: ["de", "en"],
  catalogs: [
    {
      path: "src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
})