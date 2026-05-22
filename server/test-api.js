const http = require('http');
const { readJSON } = require('./utils/dataReader');

const BASE = 'http://localhost:3001';
let passed = 0;
let failed = 0;

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(BASE + path, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url = new URL(BASE + path);
    const req = http.request({ hostname: url.hostname, port: url.port, path: url.pathname, method: 'POST', headers: { 'Content-Type': 'application/json' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function check(name, result, condition) {
  if (condition) { passed++; console.log('  PASS:', name); }
  else { failed++; console.log('  FAIL:', name, JSON.stringify(result).substring(0,100)); }
}

async function run() {
  console.log('\n=== API Tests ===\n');

  // 2.1 Health
  const health = await get('/api/health');
  check('Health', health, health.code === 0);

  // 2.2 Zodiac List
  const list = await get('/api/zodiac/list');
  check('Zodiac List', list, list.code === 0 && list.data.length === 12);

  // 2.3 Zodiac Detail
  const detail = await get('/api/zodiac/detail/' + encodeURIComponent('白羊座'));
  check('Zodiac Detail', detail, detail.code === 0 && detail.data.name === '白羊座');

  // 2.4 Zodiac Detail - Not Found
  const notFound = await get('/api/zodiac/detail/火星座');
  check('Zodiac Not Found', notFound, notFound.code !== 0);

  // 2.5 Match
  const match = await get('/api/zodiac/match?zodiac1=' + encodeURIComponent('白羊座') + '&zodiac2=' + encodeURIComponent('狮子座'));
  check('Zodiac Match', match, match.code === 0 && match.data.score === 95);

  // 2.6 Match - Missing params
  const noMatch = await get('/api/zodiac/match');
  check('Match No Params', noMatch, noMatch.code !== 0);

  // 2.7 Daily Tip - Specific
  const tip = await get('/api/zodiac/daily-tip?zodiac=' + encodeURIComponent('双子座'));
  check('Daily Tip Specific', tip, tip.code === 0 && tip.data.zodiacName === '双子座');

  // 2.8 Daily Tip - Random
  const randomTip = await get('/api/zodiac/daily-tip');
  check('Daily Tip Random', randomTip, randomTip.code === 0 && randomTip.data.zodiacName);

  // 2.9 Birthday
  const birthday = await get('/api/zodiac/birthday?month=4&day=15');
  check('Birthday', birthday, birthday.code === 0 && birthday.data.zodiac.name === '白羊座');

  // 2.10 Birthday invalid
  const badBday = await get('/api/zodiac/birthday?month=13&day=1');
  check('Birthday Invalid', badBday, badBday.code !== 0);

  // 2.11 Character List
  const charList = await get('/api/character/list');
  check('Character List', charList, charList.code === 0 && charList.data.length === 12);

  // 2.12 Character Match
  const charMatch = await post('/api/character/match', { zodiac: '白羊座', answers: ['A','B','C','A','A','B'] });
  check('Character Match', charMatch, charMatch.code === 0 && charMatch.data.character && charMatch.data.scores.total >= 0);

  // 2.13 Character Match - Missing answers
  const badMatch = await post('/api/character/match', { zodiac: '白羊座' });
  check('Match Missing Answers', badMatch, badMatch.code !== 0);

  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => { console.error(e); process.exit(1); });
