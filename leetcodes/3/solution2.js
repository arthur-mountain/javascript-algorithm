/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let l = 0;
  let max = 0;

  // 儲存每個字元最後一次出現的索引位置，
  // key 是字元，value 是該字元最後一次出現的位置
  let seen = new Map();

  for (let r = 0; r < s.length; r++) {
    // 如果當前字元之前出現過，而且上次出現位置在當前視窗內
    // （也就是上次出現位置 >= 左指標位置）
    if (seen.has(s[r]) && seen.get(s[r]) >= l) {
      // 將左指標直接移動到重複字元上次出現位置的下一個位置
      // 這樣就保證了新視窗內不會有重複字元
      l = seen.get(s[r]) + 1;
    }

    // 若前面也有重複的字元直接覆蓋，以最大的為主，這樣快速移動才有意義
    seen.set(s[r], r);

    max = Math.max(max, r - l + 1);
  }

  return max;
};
