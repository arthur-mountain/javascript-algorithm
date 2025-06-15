/**
 * Status:
 *  - [x] Done
 *  - [x] Follow-up solutions
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

// 優化，次佳解，Recursion
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

// (待複習) 最佳解，使用數學概念，利用位元運算。
// 建議先熟悉上述得遞迴解法，本解法基於遞迴推導出來的數學規律
//
// 概念說明：
//   - 從 root 節點（Level 1，值為 0）開始，整個序列可以想像成一棵二元樹。
//
//   - 範例（Level 1 ~ Level 4）：
//
//     Level 1:            0
//                      /      \
//     Level 2:       0         1
//                  /  \      /  \
//     Level 3:   0     1    1     0
//               / \   / \  / \   / \
//     Level 4: 0   1  1  0 1  0  0  1
//              ↑   ↑  ↑  ↑ ↑  ↑  ↑  ↑
//     Index:   0   1  2  3 4  5  6  7
//
// 因此從 root(level 1) 往下走到 leaf(level 4) 的時候，
// 透過「往左走(L) 記為 0，往右走(R) 記為 1」的約定，從 root 走到 leaf 的路線可以得到一個二進制，可以對應為 k - 1 的二進制表示。
//
// 因為往右走會造成「取反」，計算「路線二進制」中 1 的個數，即為「翻轉次數」，最終結果：
//   - 翻轉次數為偶數 → 返回 0
//   - 翻轉次數為奇數 → 返回 1
//
// 因此具體上述的範例，可以得到：
//   - index = 0 → 對應路線為 000 (LLL) → 即 0-indexed 是 k - 1 = 0 → 000 -> 0 次翻轉 → 結果 0
//
//   - index = 1 → 對應路線為 001 (LLR) → 即 0-indexed 是 k - 1 = 1 → 001 -> 1 次翻轉 → 結果 1
//
//   - index = 2 → 對應路線為 010 (LRL) → 即 0-indexed 是 k - 1 = 2 → 010 -> 1 次翻轉 → 結果 1
//
//   - index = 3 → 對應路線為 011 (LRR) → 即 0-indexed 是 k - 1 = 3 → 011 -> 2 次翻轉 → 結果 0
//
//   - index = 4 → 對應路線為 100 (RLL) → 即 0-indexed 是 k - 1 = 4 → 100 -> 1 次翻轉 → 結果 1
//
//   - index = 5 → 對應路線為 101 (RLR) → 即 0-indexed 是 k - 1 = 5 → 101 -> 2 次翻轉 → 結果 0
//
//   - index = 6 → 對應路線為 110 (RRL) → 即 0-indexed 是 k - 1 = 6 → 110 -> 2 次翻轉 → 結果 0
//
//   - index = 7 → 對應路線為 111 (RRR) → 即 0-indexed 是 k - 1 = 7 → 111 -> 3 次翻轉 → 結果 1
//
// 複雜度分析：
//   - 時間複雜度： O(log k) - 需要處理 k 的每個二進制位
//   - 空間複雜度： O(1)     - 只使用常數額外空間
//   - 是否會通過： 會通過! 最佳解，時間和空間效率都極佳
kthGrammar = function (n, k) {
  // 直接使用 JavaScript 的內建方法計算二進制中 1 的個數
  const binaryString = (k - 1).toString(2);
  const onesCount = (binaryString.match(/1/g) || []).length;

  // 如果 1 的個數是偶數，返回 0；如果是奇數，返回 1
  return onesCount % 2;
};

/* 使用位元運算，自行運算 1 的數量 */
kthGrammar = function (n, k) {
  // 將 k 轉換為從 0 開始的索引
  let index = k - 1;
  // 計算 index 的二進制表示中 1 的個數
  let count = 0;

  // 使用位元操作計算 1 的個數
  while (index > 0) {
    // 如果最低位是 1，計數器加一
    if (index & 1) {
      count++;
    }
    // 右移一位，相當於除以 2
    index >>= 1;
  }

  // 如果 1 的個數是偶數，返回 0；如果是奇數，返回 1
  return count % 2;
};

/* 在位元運算中，也堪稱最效率解，透過快速清除最右側的 1，每一次迴圈都算一個 1*/
kthGrammar = function (n, k) {
  // 使用位元操作的技巧：x & (x-1) 可以消除 x 最右邊的 1
  let count = 0;
  let x = k - 1;

  while (x) {
    count++;
    x &= x - 1; // 消除最右邊的 1
  }

  // 如果 1 的個數是偶數，返回 0；如果是奇數，返回 1
  return count % 2;
};
