/**
 * 日付オブジェクトを文字列に変換します。
 * @param {string} date
 */
function convertDateToString(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/**
 * 日付オブジェクト(時間)を文字列に変換します。
 * @param {string} date 
 */
function convertDateTimeToString(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

/**
 * 日付文字列(時間)を整形します。
 * @param {string} date 日付文字列(時間)
 */
function formatDateTimeString(date) {
  return date.replace('.000+09:00', '').replace('T', ' ');
}

/**
 * 本日日付の文字列を取得します。
 * @return {string} 本日日付((YYYY-MM-DD)
 */
function getTodayString() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

/**
 * 現在時刻の文字列を取得します。
 * @return {string} 本日日付((YYYY-MM-DD hh:mm:dd)
 */
function getNow() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;;
}

/**
 * 今月末の文字列を取得します。
 * @return {string} 今月末日付((YYYY-MM-DD)
 */
function getThisMonthLastDay() {
  const today = new Date();
  const nextMonthLastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return `${nextMonthLastDay.getFullYear()}-${nextMonthLastDay.getMonth() + 1}-${nextMonthLastDay.getDate()}`;
}

/**
 * 来月末日付の文字列を取得します。
 * @return {string} 来月末日付(YYYY-MM-DD)
 */
function getNextMonthLastDay() {
  const today = new Date();
  const nextMonthLastDay = new Date(today.getFullYear(), today.getMonth() + 2, 0);
  return `${nextMonthLastDay.getFullYear()}-${nextMonthLastDay.getMonth() + 1}-${nextMonthLastDay.getDate()}`;
}
/**
 * 請求番号を作成します。
 * パターン1：YYYYMMDD-hhmmdd
 * パターン2：YYYY-MMDD-hhmmdd
 * @return {string} 請求番号(YYYYMMDD-hhmmdd)
 */
function getBillingNumber(pattern = 1) {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const date = today.getDate().toString().padStart(2, '0');
  const hours = today.getHours().toString().padStart(2, '0');
  const minutes = today.getMinutes().toString().padStart(2, '0');
  const seconds = today.getSeconds().toString().padStart(2, '0');
  if (pattern === 2) {
    return `${today.getFullYear()}-${month}${date}-${hours}${minutes}${seconds}`
  }
  return `${today.getFullYear()}${month}${date}-${hours}${minutes}${seconds}`;
}

