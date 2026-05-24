const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const fs = require('fs')
const path = require('path')

function readJSON(filename) {
  const raw = fs.readFileSync(path.join(__dirname, filename), 'utf-8')
  return JSON.parse(raw)
}

function success(data, message = 'ok') {
  return { code: 0, message, data }
}

function fail(message = 'error', code = -1) {
  return { code, message, data: null }
}

function handleList() {
  const zodiacs = readJSON('zodiac.json')
  const list = zodiacs.map(({ id, name, nameEn, emoji, dateRange, element }) => ({
    id, name, nameEn, emoji, dateRange, element
  }))
  return success(list)
}

function handleDetail(name) {
  const zodiacs = readJSON('zodiac.json')
  const zodiac = zodiacs.find(z => z.name === decodeURIComponent(name))
  if (!zodiac) return fail('未找到该星座')
  return success(zodiac)
}

function handleMatch(zodiac1, zodiac2) {
  if (!zodiac1 || !zodiac2) return fail('请提供两个星座名称')

  const matchData = readJSON('match.json')
  const pair = matchData.pairs.find(
    p => (p.zodiac1 === zodiac1 && p.zodiac2 === zodiac2) ||
         (p.zodiac1 === zodiac2 && p.zodiac2 === zodiac1)
  )
  if (!pair) return fail('暂未收录该星座配对数据')
  return success(pair)
}

function handleDailyTip(zodiac) {
  const tips = readJSON('daily-tips.json')

  if (zodiac) {
    const tip = tips.tips.find(t => t.zodiacName === zodiac)
    if (!tip) return fail('未找到该星座的今日建议')
    return success(tip)
  }

  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
  const idx = dayOfYear % tips.tips.length
  return success(tips.tips[idx])
}

function handleBirthday(month, day) {
  if (!month || !day) return fail('请提供生日月份和日期')

  const m = parseInt(month), d = parseInt(day)
  if (m < 1 || m > 12 || d < 1 || d > 31) return fail('日期格式无效')

  const zodiacs = readJSON('zodiac.json')

  const toOrdinal = (mon, day) => mon * 100 + day
  const target = toOrdinal(m, d)

  const found = zodiacs.find(z => {
    const parts = z.dateRange.split(' - ')
    const startParts = parts[0].split('月')
    const endParts = parts[1].split('月')

    const sm = parseInt(startParts[0])
    const sd = parseInt(startParts[1].replace('日', ''))
    const em = parseInt(endParts[0])
    const ed = parseInt(endParts[1].replace('日', ''))

    const start = toOrdinal(sm, sd)
    const end = toOrdinal(em, ed)

    if (start <= end) {
      return target >= start && target <= end
    }
    return target >= start || target <= end
  })

  if (!found) return fail('未找到匹配的星座')
  return success({ birthday: `${m}月${d}日`, zodiac: found })
}

const handlers = { list: handleList, detail: handleDetail, match: handleMatch, 'daily-tip': handleDailyTip, birthday: handleBirthday }

exports.main = async (event) => {
  const { action, ...params } = event
  const handler = handlers[action]
  if (!handler) return fail(`未知的 action: ${action}`)

  switch (action) {
    case 'list': return handler()
    case 'detail': return handler(params.name)
    case 'match': return handler(params.zodiac1, params.zodiac2)
    case 'daily-tip': return handler(params.zodiac)
    case 'birthday': return handler(params.month, params.day)
    default: return fail(`未知的 action: ${action}`)
  }
}
