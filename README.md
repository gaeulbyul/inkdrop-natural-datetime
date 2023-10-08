# inkdrop-natural-datetime

inkdrop-natural-datetime is a plugin for the Inkdrop. It parse & convert datetime that written in natural language into formal date.

inkdrop-natural-datetime is powered by these libraries:
* [chrono](https://github.com/wanasit/chrono) for parsing.
* [dayjs](https://github.com/iamkun/dayjs) for formatting.

## Config

* `expandAngleBracketNotation`: boolean
  * Expand angle bracket notation, such as `<Tomorrow>`
  * default: `true`
* `preferForwardDate`: boolean
  * Prefer future date when evaluating string. Note that prepending "!" on text will behaves opposite from this option.
  * default: `true`
* `dayjsFormat`: string
  * Format of the date. see https://day.js.org/docs/en/display/format. It also supports "Localized Formats".
  * default: `'YYYY-MM-DD A hh:mm'`
* `localeToParsing`: string
  * Locale code to parse text with chrono. see https://github.com/wanasit/chrono/tree/v2.7.0#locales
  * default: `'en'`
* `localeToFormatting`: string
  * Locale code to format datetime with dayjs. see https://cdn.jsdelivr.net/npm/dayjs@1.11.10/locale.json
  * default: `'en'`

## Examples (with "en" locale)

* `<now>` or `<today>`
* `<tomorrow>`
* `<next friday>`
* `<2 weeks later>`
* `<may 5th>`
