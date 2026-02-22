/**
 * @param {number} n
 * @return {number}
 */
var binaryGap = function (n) {
  // l：上一個 '1' 的 bit 索引(-1 表示尚未見過任何 '1')
  // position：當前正在檢查的 bit 索引，從 LSB(最低有效位)的位置 0 開始
  let l = -1;
  let position = 0;
  let max = 0;

  while (n > 0) {
    // n & 1：用 bitmask 取出最低位(LSB)
    // 結果為 1 代表當前 bit 為 '1'，為 0 則跳過
    if (n & 1) {
      // l !== -1：確認之前已出現過至少一個 '1'，才有「兩兩相鄰」的前提
      if (l !== -1) {
        max = Math.max(max, position - l);
      }
      // 無論如何，將 l 更新為當前 '1' 的索引，作為下一次計算的起點
      l = position;
    }

    // 右移一位，將下一個 bit 移至最低位，等同於移向下一個 bit 的位置
    n >>= 1;
    position++;
  }

  return max;
};
