/*
 * - [x] Done
 * - [x] Follow up solutions
 */
/**
 * @param {number[][]} matrix
 * @return {number}
 */
let countSquares = (matrix) => {
  /**
   * Title:
   * found all square submatrices, 1x1 is a square, 2x2 is a square, and so on.
   * Examples:
   *   The all 1x1(side 1) suqare, means the one itself
   *   The all 2x2(side 2) suqare, means the four ones combine as a square.
   *   and so on.
   *
   * Thoughts:
   *
   *  1. **初始化計數器**：
   *     - 設定一個變數 `count`，初始值為 0，用來記錄矩陣中所有符合條件的正方形子矩陣的數量。
   *
   *  2. **遍歷每個矩陣元素**：
   *     - 使用兩層迴圈來遍歷 `matrix` 中的每個元素，
   *       外層迴圈為 `i` 表示行數，內層迴圈為 `j` 表示列數。
   *     - 當 `matrix[i][j]` 等於 0 時，表示這個位置無法成為正方形子矩陣的左上角，直接跳過。
   *
   *  3. **正方形邊長檢查**：
   *     - 初始化 `size` 為 1，表示開始檢查邊長為 1 的正方形子矩陣。
   *     - 使用 `isValidSquare` 函數來檢查以 `matrix[i][j]` 為左上角、邊長為 `size` 的子矩陣是否為滿足條件的正方形。
   *     - 如果檢查結果為真，將 `count` 增加 1，並將 `size` 增加 1，繼續檢查邊長更大的正方形。
   *     - 如果檢查結果為假，表示無法再形成更大的正方形，結束當前元素的檢查。
   *
   *  4. **isValidSquare 函數**：
   *     - 此函數用來檢查是否能在 `matrix[i][j]` 為左上角、邊長為 `size` 的子矩陣內形成一個有效的正方形。
   *     - 首先檢查子矩陣的邊界，如果邊界超出 `matrix` 的範圍，返回 `false`。
   *     - 然後遍歷子矩陣中的每個元素，檢查所有元素是否都等於 1，如果找到任何一個元素為 0，則返回 `false`。
   *     - 如果遍歷完畢且所有元素都為 1，則返回 `true`。
   *
   *  5. **時間和空間複雜度分析**：
   *     - **時間複雜度**：針對每個元素（共 `m × n` 個），可能需要檢查的最大正方形邊長為 `min(m, n)`，而每次檢查正方形的時間為 `O(k²)`。因此總時間複雜度為 `O(m × n × min(m, n)³)`。
   *     - **空間複雜度**：此程式碼僅使用常數空間來記錄幾個變數，因此空間複雜度為 `O(1)`。
   **/
  let count = 0;
  let m = matrix.length;
  let n = matrix[0].length;
  // O(m)
  for (let i = 0; i < m; i++) {
    // O(n)
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 0) continue;

      let size = 1;
      // O(min(m, n))
      while (isValidSquare(i, j, size)) {
        count++;
        size++;
      }
    }
  }

  function isValidSquare(row, col, size) {
    // check boundries
    if (row + size > m || col + size > n) return false;

    // O(size * size)
    for (let i = row; i < row + size; i++) {
      for (let j = col; j < col + size; j++) {
        if (matrix[i][j] === 0) return false;
      }
    }

    return true;
  }

  return count;
};

/**
 * follow up:
 * 1. 使用動態規劃來優化時間複雜度
 * 2. 創建一個 dp 表，dp[i][j] 表示以 (i,j) 為右下角可以形成的最大正方形邊長
 * 3. 遍歷矩陣，填充 dp 表
 * 4. 將所有可能的正方形數量加總
 * 5. 時間複雜度為 O(m × n)，空間複雜度為 O(m × n)
 **/
countSquares = (matrix) => {
  const m = matrix.length;
  const n = matrix[0].length;
  let count = 0;

  // 創建 dp 表，初始化為 0
  // dp[i][j] 表示以 (i,j) 為右下角可以形成的最大正方形邊長
  // 空間複雜度: O(m * n)
  let dp = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  // 填充 dp 表
  // 時間複雜度: O(m * n)
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === 0) continue;

      if (i === 0 || j === 0) {
        // 第一行或第一列，只能形成 1x1 的正方形
        dp[i][j] = 1;
      } else {
        // 取左上、上、左三個位置的最小值 + 1 (+1 -> 加上自己，即 1x1 square)
        dp[i][j] =
          Math.min(
            dp[i - 1][j - 1], // 左上
            dp[i - 1][j], // 上
            dp[i][j - 1], // 左
          ) + 1;
      }
      count += dp[i][j]; // 將所有可能的正方形數量加總
    }
  }

  return count;
};

/**
 * follow up:
 * 同樣使用動態規劃，但不額外建立 dp 表，直接在原矩陣上修改
 * 時間複雜度為 O(m × n)
 * 空間複雜度為 O(1)
 **/
countSquares = (matrix) => {
  let m = matrix.length;
  let n = matrix[0].length;
  let count = 0;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] == 1 && i - 1 >= 0 && j - 1 >= 0) {
        let minVal = Math.min(
          matrix[i - 1][j],
          Math.min(matrix[i - 1][j - 1], matrix[i][j - 1]),
        );
        matrix[i][j] = minVal + 1;
      }
      count += matrix[i][j];
    }
  }
  return count;
};

countSquares = (matrix) => {
  let count = 0;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === 0) continue;

      if (i > 0 && j > 0) {
        matrix[i][j] += Math.min(
          matrix[i - 1][j - 1], // 左上
          matrix[i - 1][j], // 上
          matrix[i][j - 1], // 左
        );
      }

      count += matrix[i][j];
    }
  }

  return count;
};
