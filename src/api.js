import { GM_getValue, GM_setValue, GM_xmlhttpRequest } from '$';

export async function getCnyToKrwRate() {
  return fetchRate('cny_krw_rate', 'cny_krw_time', 'https://open.er-api.com/v6/latest/CNY');
}

export async function getUsdToKrwRate() {
  return fetchRate('usd_krw_rate', 'usd_krw_time', 'https://open.er-api.com/v6/latest/USD');
}
/**
 * @param {string} cacheKey
 * @param {string} timeKey
 * @param {string} apiUrl
 * @returns {Promise<number>}
 */
// 중복 코드를 줄이기 위한 공통 호출 함수
function fetchRate(cacheKey, timeKey, apiUrl) {
  const CACHE_DURATION = 12 * 60 * 60 * 1000;
  const cachedRate = GM_getValue(cacheKey);
  const cachedTime = GM_getValue(timeKey);
  const now = Date.now();

  if (cachedRate && cachedTime && (now - cachedTime < CACHE_DURATION)) {
    return Promise.resolve(cachedRate);
  }

  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: apiUrl,
      onload: function(response) {
        try {
          const data = JSON.parse(response.responseText);
          if (data && data.rates && data.rates.KRW) {
            const rate = data.rates.KRW;
            GM_setValue(cacheKey, rate);
            GM_setValue(timeKey, now);
            resolve(rate);
          } else {
            reject('API 응답에서 KRW 환율을 찾을 수 없습니다.');
          }
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : String(e);
          reject('파싱 에러: ' + errorMessage);
        }
      },
      onerror: function() {
        reject('API 호출 에러');
      }
    });
  });
}