/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  // l 和 r 左、右邊界; 無重複字母，需要一個 Map 紀錄字元最後出現的索引
  //
  // 以「閉區間 [l, r]」定義窗口，先收縮左界滿足約束後，再更新全域最優解。
  //
  // 核心邏輯：
  // 專注維持 [l, r] 這個區間。
  // 當進到 s[r] 時，若窗口內有重複元素，就直接跳到窗口內最後一次出現 s[r] 的下一格。
  // 最後更新當前元素的索引座標，確保區間合法後，再更新答案。

  let l = 0;
  let max = 0;
  let lastseen = new Map();

  for (let r = 0; r < s.length; r++) {
    // 窗口不合法(不符合「無重複」的約束)，因此要從窗口中移除 s[r]
    // 如果 s[r] 曾出現過，找到 l 跳轉到它的下一個位置(使窗口符合「閉區間」不變量，因此是跳轉到它的下一個位置才能讓窗口符合「無重複」的約束)
    // 但要確保 l 只能往右跳（不能跳到窗口外的索引），所以跟目前的 l 取最大值
    if (lastseen.has(s[r])) {
      l = Math.max(l, lastseen.get(s[r]) + 1);
    }
    // 紀錄當前 char(s[r]) 最後一次出現的位置
    lastseen.set(s[r], r);
    // 現在窗口 [l, r] 是乾淨合法的，更新答案
    max = Math.max(max, r - l + 1);
  }

  return max;
};
