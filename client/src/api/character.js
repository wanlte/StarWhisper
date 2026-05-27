import api from './request';

export function getCharacterList() {
  return api.get('/api/character/list');
}

export function getQuestions() {
  return api.post('/api/character/questions');
}

export function matchCharacter(zodiac, answers) {
  return api.post('/api/character/match', { zodiac, answers });
}
