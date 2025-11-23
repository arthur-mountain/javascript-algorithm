/**
 * @param {number[][]} mat
 * @return {number[][]}
 */
var updateMatrix = function (mat) {
  // 初始化矩陣的行列數
  const row = mat.length;
  const col = mat[0].length;
  const queue = [];
  const visited = new Set();

  // 將所有值為 0 的 cell 加入 queue，作為多源 BFS 的起點
  // 同時標記這些 0 為已訪問
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (mat[i][j] === 0) {
        queue.push(i, j); // 將 row 和 col 分別 push（成對存放）
        visited.add(i * col + j); // 使用一維化座標作為 key
      }
    }
  }

  // distance 記錄當前 BFS 的層級深度，代表距離起點（0）的距離
  let distance = 0;

  // 四個方向的偏移量：上、右、下、左
  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  // 開始 BFS 遍歷
  while (queue.length > 0) {
    // 計算當前層有多少個 cell（因為是成對存放，所以除以 2）
    const pairLen = queue.length / 2;

    // 遍歷當前層的所有 cell
    for (let i = 0; i < pairLen; i++) {
      const currentRow = queue.shift(); // 取出當前 cell 的 row
      const currentCol = queue.shift(); // 取出當前 cell 的 col

      // 檢查四個方向的鄰居
      for (const [dr, dc] of directions) {
        const newRow = currentRow + dr;
        const newCol = currentCol + dc;
        const key = newRow * col + newCol; // 計算鄰居的一維化座標

        // 邊界檢查和訪問檢查
        if (
          newRow < 0 ||
          newRow >= row ||
          newCol < 0 ||
          newCol >= col ||
          visited.has(key)
        ) {
          continue; // 越界或已訪問，跳過
        }

        // 更新鄰居的距離（當前層距離 + 1）
        mat[newRow][newCol] = distance + 1;

        // 標記鄰居為已訪問
        visited.add(key);

        // 將鄰居加入 queue，用於下一層 BFS
        queue.push(newRow, newCol);
      }
    }

    // 當前層處理完畢，進入下一層，距離加 1
    distance++;
  }

  return mat;
};
