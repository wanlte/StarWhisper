// #ifdef H5
const BASE_URL = '';
// #endif

// #ifdef MP-WEIXIN
import { CLOUD_ENV_ID } from './config';
wx.cloud.init({ env: CLOUD_ENV_ID });
// #endif

function request(path, options = {}) {
  const { method = 'GET', data: bodyData = null } = options;

  // #ifdef MP-WEIXIN
  return new Promise((resolve, reject) => {
    // 解析路径：/api/{函数名}/{action}[/{pathParam}][?query...]
    const urlParts = path.split('?');
    const pathOnly = urlParts[0];
    const queryString = urlParts[1] || '';
    const segments = pathOnly.split('/').filter(s => s);

    const functionName = segments[1];  // zodiac | character
    const action = segments[2];        // list | detail | match | ...
    const pathParam = segments[3] || null;

    const queryParams = {};
    if (queryString) {
      queryString.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        queryParams[key] = decodeURIComponent(value || '');
      });
    }

    const callData = { action, ...queryParams };
    if (pathParam) callData.name = decodeURIComponent(pathParam);
    if (bodyData) Object.assign(callData, bodyData);

    wx.cloud.callFunction({ name: functionName, data: callData })
      .then(res => {
        if (res.result.code === 0) {
          resolve(res.result.data);
        } else {
          uni.showToast({ title: res.result.message || '请求失败', icon: 'none' });
          reject(res.result);
        }
      })
      .catch(err => {
        uni.showToast({ title: '云函数调用失败', icon: 'none' });
        reject(err);
      });
  });
  // #endif

  // #ifdef H5
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + path,
      method,
      data: bodyData,
      header: { 'Content-Type': 'application/json' },
      success: (res) => {
        if (res.statusCode === 200) {
          const result = res.data;
          if (result.code === 0) {
            resolve(result.data);
          } else {
            uni.showToast({ title: result.message || '请求失败', icon: 'none' });
            reject(result);
          }
        } else {
          uni.showToast({ title: '网络错误', icon: 'none' });
          reject(new Error('Network error'));
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络连接失败', icon: 'none' });
        reject(err);
      }
    });
  });
  // #endif
}

const api = {
  get: (path) => request(path),
  post: (path, data) => request(path, { method: 'POST', data })
};

export default api;
