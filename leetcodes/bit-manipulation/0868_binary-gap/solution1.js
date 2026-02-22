/**
 * @param {number} n
 * @return {number}
 */
var binaryGap = function (n) {
  // 將整數轉為 binary string，方便逐位檢查
  const binary = n.toString(2);

  // l：上一個 '1' 的索引(-1 表示尚未見過任何 '1')
  // r：當前掃描位置(window 右端)
  let l = -1,
    r = 0;
  let max = 0;

  while (r < binary.length) {
    if (binary[r] === "1") {
      // 只有在之前已見過至少一個 '1' 時，才有「兩兩相鄰」的前提
      if (l !== -1) {
        max = Math.max(max, r - l);
      }
      // 無論如何，將 l 更新為當前 '1' 的位置，作為下一次計算的起點
      l = r;
    }

    r++;
  }

  return max;
};
