// #ifdef H5
const BASE_URL = '';
// #endif
// #ifdef MP-WEIXIN
const BASE_URL = 'https://your-server.com';
// #endif

function request(path, options = {}) {
  const { method = 'GET', data = null } = options;

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + path,
      method,
      data,
      header: {
        'Content-Type': 'application/json'
      },
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
}

const api = {
  get: (path) => request(path),
  post: (path, data) => request(path, { method: 'POST', data })
};

export default api;
