import { formatter } from "@lingui/format-json"

module.exports = {
  locales: ['en', 'de'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: formatter({style: "minimal"})
};
