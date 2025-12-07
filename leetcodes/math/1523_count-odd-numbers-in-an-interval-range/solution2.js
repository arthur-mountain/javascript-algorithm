/**
 * @param {number} low
 * @param {number} high
 * @return {number}
 */
var countOdds = function (low, high) {
  // 核心洞察：奇數和偶數交替出現（1, 2, 3, 4, 5...）
  //
  // 1 到 n 的奇數個數公式
  //   - n 是奇數: (n+1)/2  (例如 1到5 → 1,3,5 → (5+1)/2 = 3個)
  //   - n 是偶數: n/2      (例如 1到6 → 1,3,5 → 6/2 = 3個)
  //   - 統一公式: Math.floor((n+1)/2)
  //
  // 區間技巧：[low, high] = [1, high] - [1, low-1]
  //
  // 推導：
  //   - [1, low-1] 的奇數個數 = Math.floor((low-1+1)/2) = Math.floor(low/2)
  //   - [1,  high] 的奇數個數 = Math.floor((high+1)/2)
  //   - 上述兩者相減得到 [low, high] 的奇數
  return Math.floor((high + 1) / 2) - Math.floor(low / 2);
};
