/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  // l 和 r 左、右邊界; 無重複字母，需要一個 set 紀錄當前窗口的字母
  //
  // 以「閉區間 [l, r]」定義窗口，先收縮左界滿足約束後，再更新全域最優解。
  //
  // 核心邏輯：
  // 專注維持 [l, r] 這個區間。
  // 當進到 s[r] 時，若窗口內有重複元素，就一直刪到沒有。
  // 最後先把 s[r] 加進窗口，確保區間合法，再更新答案。

  let l = 0;
  let max = 0;
  let set = new Set();

  for (let r = 0; r < s.length; r++) {
    // 可以不用判斷這個 if。
    // 透過 while 判斷，先收縮左界，直到窗口滿足「無重複」的約束; 否則會直接跳過
    // if (set.has(s[r])) { }

    // 先收縮窗口，若窗口不滿足「無重複」的約束
    while (set.has(s[r])) {
      set.delete(s[l++]);
    }
    // 把當前元素加入窗口。確保符合「閉區間」不變量定義(包含 l and r)
    set.add(s[r]);
    // 現在窗口是乾淨合法的，更新答案
    max = Math.max(max, r - l + 1);
  }

  return max;
};
