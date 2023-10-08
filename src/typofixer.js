const typoFixer = {
  _typos: new Map(),
  add(correct, typos) {
    if (typos.includes(correct)) {
      throw new Error('typos should not contain a correct word')
    }
    for (const typo of typos) {
      this._typos.set(typo, correct)
    }
  },
  fix(text) {
    let result = text
    const pattern = /[a-z]\w+/ig
    let match
    while (match = pattern.exec(text)) {
      const correctWord = this._typos.get(match[0])
      if (!correctWord) {
        continue
      }
      result = result.replaceAll(match[0], correctWord)
    }
    return result
  },
}

typoFixer.add('yesterday', [
  'yersterday',
  'yesteray',
  'yestaday',
  'yesteday',
  'yesteday',
  'yeaterday',
  'yestarday',
  'yestuday',
  'yesterda',
  'yeasterday',
  'yestoday',
  'tyesterday',
  'yesturday',
  'yestaday',
])

typoFixer.add('tomorrow', [
  'tomorow',
  'tommorrow',
  'tomorrou',
  'tormorrow',
  'tmorrow',
  'tomoroow',
  'tommorow',
  'tomorrom',
  'tomorro',
  'tommory',
  'toworrow',
  'tomorror',
  'tomrrow',
  'temorrow',
  'tomorroy',
  'tomomorow',
  'tomower',
  'tomorrw',
  'tomorrov',
  'tommorrw',
  'torrow',
  'twomorrow',
  'tomoorrow',
  'tomorrrow',
  'tomarrow',
  'tomoro',
  'tomorron',
  'toomorrow',
  'tomorrown',
  'tumorow',
  'tummorow',
  'tommow',
  'tommrow',
])

typoFixer.add('monday', [
  'mounday',
  'munday',
  'mondat',
  'mondyy',
  'monsday',
  'moday',
  'mondey',
  'mondy',
  'momday',
  'moonday',
  'mon',
  'manday',
  'monsay',
  'mondays',
  'monady',
  'mandy',
  'mandey',
])

typoFixer.add('tuesdays', [
  'tusday',
  'thuesday',
  'tuesdyas',
  'tues',
  'tusdays',
  'tuesday',
])

typoFixer.add('wednesday', [
  'wensday',
  'wendnesday',
  'wedesday',
  'wendsay',
  'wendesday',
  'wednwsday',
  'wednsday',
  'weedend',
  'wenthday',
  'wesnaesday',
  'wedsday',
  'wedbesday',
  'wedhesday',
  'wedsneday',
  'wedneday',
  'wdnesday',
  'wwdnesday',
  'wesnesday',
  'webnsday',
  'wednesdey',
  'wesday',
  'wednessday',
  'wednesdy',
  'wedsnday',
  'wednesdsy',
  'wednseday',
  'wedsnesday',
  'wednesay',
  'wadnesday',
  'wedenesday',
  'wednesnay',
  'wesneday',
  'wednersday',
  'weednesday',
  'wednesady',
  'wesdney',
  'wednaesday',
  'wednesaday',
  'wednenday',
  'wendsday',
  'wedensday',
  'wenesday',
  'wesdenday',
  'wednasday',
  'westday',
])

typoFixer.add('thursday', [
  'thursady',
  'thirsday',
  'thurday',
  'thursay',
  'thusday',
])

typoFixer.add('friday', [
  'fryday',
  'fraiday',
  'fridy',
  'frady',
])

typoFixer.add('saturday', [
  'sathurday',
  'staurday',
  'satuday',
  'saturdy',
  'saturay',
  'suturday',
  'saterday',
  'satureday',
  'sauterday',
])

typoFixer.add('sunday', [
  'sundy',
  'sunda',
  'subday',
  'sumday',
  'sinday',
  'sonday',
  'soonday',
  'sundary',
  'suday',
  'sanduy',
  'dunday',
  'tunday',
  'saunday',
  'snuday',
  'sanday',
])

typoFixer.add('later', [
  'latre',
  'leter',
])

typoFixer.add('last', [
  'lsat',
])

typoFixer.add('week', [
  'wek',
  'weeek',
])

typoFixer.add('ago', [
  'aog',
])

typoFixer.add('before', [
  'befor',
  'befoer',
])

typoFixer.add('after', [
  'atfer',
  'aftr',
])

typoFixer.add('years', [
  'yaers',
  'yeasr',
  'yers',
  'yars',
])

typoFixer.add('year', [
  'yaer',
  'yer',
])

module.exports = typoFixer
