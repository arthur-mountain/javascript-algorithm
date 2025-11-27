/**
 * @param {number[][]} mat
 * @return {number[][]}
 */
var updateMatrix = function (mat) {
  const ROW = mat.length;
  const COL = mat[0].length;

  const getSafeValue = (row, col) =>
    row < 0 || row >= ROW || col < 0 || col >= COL ? Infinity : mat[row][col];

  // 第一輪迴圈，處理從左上到右下的最短路徑。比較「左方節點」、「上方節點」
  // 只處理當前節點為 1 時的最短路徑，如果當前節點為 0，那最短路徑就會是 0，所以不用比較
  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      if (mat[row][col] !== 0) {
        mat[row][col] =
          Math.min(
            // 左節點。也可以寫成「col - 1 >= 0 ? mat[row][col - 1] : Infinity」
            getSafeValue(row, col - 1),
            // 上節點。也可以寫成「row - 1 >= 0 ? mat[row - 1][col] : Infinity」
            getSafeValue(row - 1, col),
          ) + 1; // 鄰居節點加一步才會是當前節點的值
      }
    }
  }

  // 處理從右下到左上的最短路徑。
  // 比較「當前節點」、「右方節點」、「下方節點」
  // 當前節點(作為第一次遍歷左上的最短路徑的結果)跟右、下方節點比較，是否有再更短的路徑
  for (let row = ROW - 1; row >= 0; row--) {
    for (let col = COL - 1; col >= 0; col--) {
      if (mat[row][col] !== 0) {
        mat[row][col] = Math.min(
          mat[row][col],
          // 右節點。也可以寫成「col + 1 < COL ? mat[row][col + 1] + 1 : Infinity」
          getSafeValue(row, col + 1) + 1, // 鄰居節點加一步才會是當前節點的值
          // 下節點。也可以寫成「row + 1 < ROW ? mat[row + 1][col] + 1 : Infinity」
          getSafeValue(row + 1, col) + 1, // 鄰居節點加一步才會是當前節點的值
        );
      }
    }
  }

  return mat;
};
