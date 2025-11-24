# Documentation: Translation System

## Adding Languages

Edit `lingui.config.js` in the project root. Modify the `locales` array (line 5) and append new language codes. The
content inside `<Trans>` or `t` tags must use the `sourceLocale` language. In this project, the source and fallback
language is English.

Example `<Trans>` and `t` usage:

```
<Trans> example text </Trans>
const someString = t`example text`
```

Example `lingui.config.js`:

```
 1   import { defineConfig } from "@lingui/cli";
 2
 3   export default defineConfig({
 4     sourceLocale: "en",
 5     locales: ["de", "en"],   // Add new locales here
 6     catalogs: [
 7       {
 8         path: "src/locales/{locale}/messages",
 9         include: ["src"],
10       },
11     ],
12   })
```

## Translation File Structure

Translation data is located under `src/locales/`. Each language has its own directory containing:

- `.po` files for translators
- Compiled `.ts` files for production

When new translatable text is added or when new languages are introduced, the translation files must be regenerated or
updated.

Extraction command:

```
npm run extract
```

Compilation command:

```
npm run compile
```
