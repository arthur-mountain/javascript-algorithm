/**
 * Status:
 *  - [] Done
 *  - [] Follow-up solutions
 *
 * Title:
 *  K-th Symbol in Grammar
 *
 * Topics:
 *  - Math
 *  - Bit Manipulation
 *  - Recursion
 *
 * Statements:
 *  第一個 row 會是 0，
 *  接下來的每一個 row 都會是將前一個 row 的 0 翻轉成 01、1 翻轉為 10 組成，持續 n 次，
 *  回傳第 n 個 row 的第 k index 的 symbol
 *
 *  範例：
 *   第1個 row -> 0
 *   第2個 row -> 01
 *   第3個 row -> 0110
 *   第4個 row -> 01101001
 *
 * Constraints:
 *   - 1 <= n <= 30
 *
 *   - 1 <= k <= 2n - 1*
 **/
/**
 * @param {number} n
 * @param {number} k
 * @return {number}
 */

// 暴力解
let kthGrammar = function (n, k) {
  // 從第一行開始：只有一個 "0"
  let currentRow = "0";

  // 逐行生成，直到第 n 行
  for (let i = 1; i < n; i++) {
    let nextRow = ""; // 用來存放下一行的內容

    // 對當前行的每個字符應用替換規則
    for (let j = 0; j < currentRow.length; j++) {
      if (currentRow[j] === "0") {
        nextRow += "01"; // 0 替換成 01
      } else {
        // currentRow[j] === '1'
        nextRow += "10"; // 1 替換成 10
      }
    }

    currentRow = nextRow; // 更新為新生成的行
  }

  // 返回第 k 個位置的字符（注意：k是從1開始，所以要減1）
  return +currentRow[k - 1];

  // 時間複雜度： O(2^n) - 因為需要生成長度為 2^(n-1) 的字串，而生成過程需要遍歷每個字符
  // 空間複雜度： O(2^n) - 需要儲存長度為 2^(n-1) 的字串
  // 是否會通過： 不會通過，因為當 n = 30 時，2^29 超過5億個字符，會導致記憶體爆炸和超時
};
