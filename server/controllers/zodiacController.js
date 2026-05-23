const { readJSON } = require('../utils/dataReader');
const { success, fail } = require('../utils/response');

function getList(req, res) {
  const zodiacs = readJSON('zodiac.json');
  const list = zodiacs.map(({ id, name, nameEn, emoji, dateRange, element }) => ({
    id, name, nameEn, emoji, dateRange, element
  }));
  res.json(success(list));
}

function getByName(req, res) {
  const { name } = req.params;
  const zodiacs = readJSON('zodiac.json');
  const zodiac = zodiacs.find(z => z.name === decodeURIComponent(name));
  if (!zodiac) return res.json(fail('未找到该星座'));
  res.json(success(zodiac));
}

function getMatch(req, res) {
  const { zodiac1, zodiac2 } = req.query;
  if (!zodiac1 || !zodiac2) return res.json(fail('请提供两个星座名称'));

  const matchData = readJSON('match.json');
  const pair = matchData.pairs.find(
    p => (p.zodiac1 === zodiac1 && p.zodiac2 === zodiac2) ||
         (p.zodiac1 === zodiac2 && p.zodiac2 === zodiac1)
  );
  if (!pair) return res.json(fail('暂未收录该星座配对数据'));

  res.json(success(pair));
}

function getDailyTip(req, res) {
  const { zodiac } = req.query;
  const tips = readJSON('daily-tips.json');

  if (zodiac) {
    const tip = tips.tips.find(t => t.zodiacName === zodiac);
    if (!tip) return res.json(fail('未找到该星座的今日建议'));
    return res.json(success(tip));
  }

  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const idx = dayOfYear % tips.tips.length;
  res.json(success(tips.tips[idx]));
}

function getBirthday(req, res) {
  const { month, day } = req.query;
  if (!month || !day) return res.json(fail('请提供生日月份和日期'));

  const m = parseInt(month), d = parseInt(day);
  if (m < 1 || m > 12 || d < 1 || d > 31) return res.json(fail('日期格式无效'));

  const zodiacs = readJSON('zodiac.json');

  const toOrdinal = (mon, day) => mon * 100 + day;
  const target = toOrdinal(m, d);

  const found = zodiacs.find(z => {
    const parts = z.dateRange.split(' - ');
    const startParts = parts[0].split('月');
    const endParts = parts[1].split('月');

    const sm = parseInt(startParts[0]);
    const sd = parseInt(startParts[1].replace('日', ''));
    const em = parseInt(endParts[0]);
    const ed = parseInt(endParts[1].replace('日', ''));

    const start = toOrdinal(sm, sd);
    const end = toOrdinal(em, ed);

    if (start <= end) {
      return target >= start && target <= end;
    }
    // Cross-year range (e.g. 摩羯座 12/22 - 1/19)
    return target >= start || target <= end;
  });

  if (!found) return res.json(fail('未找到匹配的星座'));

  res.json(success({ birthday: `${m}月${d}日`, zodiac: found }));
}

module.exports = { getList, getByName, getMatch, getDailyTip, getBirthday };
