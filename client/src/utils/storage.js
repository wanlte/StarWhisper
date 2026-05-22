const KEYS = {
  HISTORY: 'sw_history',
  BIRTHDAY: 'sw_birthday'
};

export function getHistory() {
  try {
    const data = uni.getStorageSync(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addHistory(item) {
  const list = getHistory();
  list.unshift({ ...item, time: Date.now() });
  if (list.length > 50) list.pop();
  uni.setStorageSync(KEYS.HISTORY, JSON.stringify(list));
}

export function getBirthday() {
  return uni.getStorageSync(KEYS.BIRTHDAY) || '';
}

export function setBirthday(date) {
  uni.setStorageSync(KEYS.BIRTHDAY, date);
}
