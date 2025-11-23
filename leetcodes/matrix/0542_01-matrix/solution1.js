/**
 * @param {number[][]} mat
 * @return {number[][]}
 */
var updateMatrix = function (mat) {
  const row = mat.length;
  const col = mat[0].length;

  const bfs = (startRow, startCol) => {
    let min = 0;
    const queue = [startRow, startCol];
    const visited = new Set();
    while (queue.length > 0) {
      const size = queue.length;

      for (let i = 0; i < size; i += 2) {
        const currentRow = queue.shift();
        const currentCol = queue.shift();
        if (
          visited.has(currentRow * col + currentCol) ||
          currentRow < 0 ||
          currentRow >= row ||
          currentCol < 0 ||
          currentCol >= col
        ) {
          continue;
        }
        visited.add(currentRow * col + currentCol);
        if (mat[currentRow][currentCol] === 0) {
          mat[startRow][startCol] = min;
          return;
        }
        queue.push(currentRow - 1, currentCol); // 上
        queue.push(currentRow, currentCol + 1); // 右
        queue.push(currentRow + 1, currentCol); // 下
        queue.push(currentRow, currentCol - 1); // 左
      }

      min++;
    }
  };

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (mat[i][j] !== 0) {
        bfs(i, j);
      }
    }
  }

  return mat;
};
