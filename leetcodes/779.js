/**
 * Status:
 *  - [x] Done
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

// 優化，次加解，Recursion
kthGrammar = function (n, k) {
  // 規律：
  //   可以看到第 4 個 row 的
  //   前半部分：0110 ← 是第 3 個 row！
  //   後半部分：1001 ← 是第 3 個 row，0110 的每一位取反
  //   每一行都有這樣的結構：**當前行 = 前一行 + 前一行的每位取反**
  //
  // 解法：
  //   測試資料： n = 4, k = 5，kthGrammar(4, 5)：
  //   - 第一步判斷： 第4行長度是8，中點是4。由於 k=5 > 4，所以第5個位置在後半部分
  //   - 遞迴轉換  ： 後半部分是前一行的取反，所以我們需要找第3行第1個位置（5-4=1），然後取反
  //   - 繼續遞迴  ： 對於 kthGrammar(3, 1)，第3行長度是4，中點是2。由於 k=1 ≤ 2，在前半部分
  //   - 再次遞迴  ： 前半部分就是前一行本身，所以找第2行第1個位置
  //   - 最後遞迴  ： 對於 kthGrammar(2, 1)，第2行長度是2，中點是1。由於 k=1 ≤ 1，在前半部分
  //   - 基礎情況  ： kthGrammar(1, 1) 返回 0
  //   - 回溯過程  ： 0 → 0 → 0 → 1-0 = 1

  // base case：第一行只有一個符號 "0"
  if (n === 1) {
    return 0;
  }

  // 計算第 n 行的總長度，第 n 行的長度是 2^(n-1)
  const length = 2 ** (n - 1);
  // 計算中點，用來判斷 k 在前半部分還是後半部分
  const mid = length / 2;

  // 情境1：k 在前半部分
  // 前半部分就是前一行的完整內容
  // 所以直接遞迴到第 (n-1) 行的第 k 個位置
  if (k <= mid) {
    return kthGrammar(n - 1, k);
  }

  // 情境2：k 在後半部分
  // 後半部分是前一行的取反，所以先遞迴到第 (n-1) 行對應的位置，然後取反
  // 對應位置是 k - mid，因為後半部分相當於重新從1開始計算
  // 取反：0 變成 1，1 變成 0
  return 1 - kthGrammar(n - 1, k - mid);

  // 時間複雜度： O(n) - 最多遞迴 n 層，每層只做常數時間的運算
  // 空間複雜度： O(n) - 遞迴調用堆疊的深度為 n
  // 是否會通過： 會通過! 即使 n=30，也只需要30次遞迴調用
};
