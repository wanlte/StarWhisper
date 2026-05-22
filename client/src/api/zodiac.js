import api from './request';

export function getZodiacList() {
  return api.get('/api/zodiac/list');
}

export function getZodiacDetail(name) {
  return api.get('/api/zodiac/detail/' + encodeURIComponent(name));
}

export function getZodiacMatch(zodiac1, zodiac2) {
  return api.get('/api/zodiac/match?zodiac1=' + encodeURIComponent(zodiac1) + '&zodiac2=' + encodeURIComponent(zodiac2));
}

export function getDailyTip(zodiac) {
  const q = zodiac ? '?zodiac=' + encodeURIComponent(zodiac) : '';
  return api.get('/api/zodiac/daily-tip' + q);
}

export function getBirthday(month, day) {
  return api.get('/api/zodiac/birthday?month=' + month + '&day=' + day);
}
