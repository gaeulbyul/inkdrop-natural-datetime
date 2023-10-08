'use strict'

const chrono = require('chrono-node')
const dayjs = require('dayjs')
dayjs.extend(require('dayjs/plugin/localizedFormat'))

const knownLocales = require('./known-locales.json')
const typoFixer = require('./typofixer')

const DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DD A hh:mm'
function parserByLocale(locale_) {
  if (typeof locale_ != 'string') {
    return chrono.parseDate
  }
  const locale = locale_.toLowerCase()
  const isValid = knownLocales.chrono.includes(locale)
  if (!isValid) {
    return chrono.parseDate
  }
  if (locale == 'zh.hant') {
    return chrono.zh.hant.parseDate
  }
  if (locale == 'zh.hans') {
    return chrono.zh.hans.parseDate
  }
  return chrono[locale].parseDate || chrono.parseDate
}

function parse(datestr_) {
  const locale = inkdrop.config.get('inkdrop-natural-datetime.localeToParsing')
  const preferForwardDate = inkdrop.config.get('inkdrop-natural-datetime.preferForwardDate')
  let datestr = datestr_
  let forwardDate = preferForwardDate
  if (datestr.startsWith('!')) {
    datestr = datestr.slice(1)
    forwardDate = !forwardDate
  }
  const typoFixed = typoFixer.fix(datestr)
  const chronoDateParser = parserByLocale(locale)
  const resultDate = chronoDateParser(typoFixed, new Date(), {
    forwardDate,
  })
  if (!resultDate) {
    return null
  }
  return dayjs(resultDate)
}

function format(dayjsDatetime) {
  const locale = inkdrop.config.get('inkdrop-natural-datetime.localeToFormatting')
  const format = inkdrop.config.get('inkdrop-natural-datetime.dayjsFormat')
  if (locale != 'en' && knownLocales.dayjs.includes(locale)) {
    try {
      require('dayjs/locale/' + locale)
    } catch (err) {
      console.error('[inkdrop-natural-datetime] failed to load locale %s with %o', locale, err)
    }
  }
  const localizedDate = dayjsDatetime.locale(locale)
  return localizedDate.format(format)
}

function handleChange(cm, changeObj) {
  if (!inkdrop.config.get('inkdrop-natural-datetime.expandAngleBracketNotation')) {
    return
  }
  const { text } = changeObj
  const closed = text == '>'
  if (!closed) {
    return
  }
  const currentLine = cm.getLine(changeObj.to.line)
  // \x3E = ">"
  const pattern = /<([^\n\x3E]+)>/
  const matches = pattern.exec(currentLine)
  if (!matches) {
    return
  }
  if (matches[1].includes('://') || matches[1].startsWith('!--') || matches[1].endsWith('\\')) {
    return
  }
  const parsedDate = parse(matches[1])
  if (!parsedDate) {
    return
  }
  const formattedDate = format(parsedDate)
  const replaceFrom = {
    line: changeObj.from.line,
    ch: matches.index,
  }
  const replaceTo = {
    line: changeObj.to.line,
    ch: changeObj.to.ch + 1,
  }
  cm.replaceRange(formattedDate, replaceFrom, replaceTo)
}

function handleConvertSelection() {
  if (!inkdrop.isEditorActive()) {
    return
  }
  const activeEditor = inkdrop.getActiveEditor()
  const codeMirror = activeEditor.cm
  const cmDocument = codeMirror.getDoc()
  const selections = cmDocument.getSelections()
  const converted = selections.map(sel => {
    const parsedDate = parse(sel)
    if (!parsedDate) {
      return sel
    }
    const formattedDate = format(parsedDate)
    return formattedDate
  })
  cmDocument.replaceSelections(converted)
}

let convertSelectionCommand

function activate() {
  inkdrop.onEditorLoad(event => {
    const codeMirror = event.cm
    codeMirror.on('change', handleChange)
  })
  convertSelectionCommand = inkdrop.commands.add(document.body, {
    'inkdrop-natural-datetime:convert-selection': handleConvertSelection,
  })
}

function deactivate() {
  if (!inkdrop.isEditorActive()) {
    return
  }
  const activeEditor = inkdrop.getActiveEditor()
  const codeMirror = activeEditor.cm
  codeMirror.off('change', handleChange)
  convertSelectionCommand?.dispose()
}

const config = {
  expandAngleBracketNotation: {
    type: 'boolean',
    default: true,
    title: 'Expand angle bracket notation such as: <Tomorrow>. default: true',
  },
  preferForwardDate: {
    type: 'boolean',
    default: true,
    title: 'Prefer future(forward) date when evaluating string. default: true',
  },
  dayjsFormat: {
    type: 'string',
    default: DEFAULT_DATETIME_FORMAT,
    title: 'Format of date. default: ' + DEFAULT_DATETIME_FORMAT,
    description: 'See https://day.js.org/docs/en/display/format. It also supports "Localized formats"',
  },
  localeToParsing: {
    type: 'string',
    default: 'en',
    title: 'Locale code to parse text with chrono. default: "en"',
    enum: knownLocales.chrono,
  },
  localeToFormatting: {
    type: 'string',
    default: 'en',
    title: 'Locale code to format datetime with dayjs. default: "en"',
    enum: knownLocales.dayjs,
  },
}

module.exports = { config, activate, deactivate }
