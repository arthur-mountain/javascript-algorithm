/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxAreaOfIsland = function (grid) {
  const row = grid.length;
  const col = grid[0].length;
  let maxLandCount = 0;

  const bfs = (i, j, landCount) => {
    const queue = [i, j];

    while (queue.length > 0) {
      i = queue.shift();
      j = queue.shift();

      if (i < 0 || i >= row || j < 0 || j >= col || grid[i][j] === 0) {
        continue;
      }

      landCount++;
      grid[i][j] = 0;

      queue.push(i - 1, j); // 上
      queue.push(i, j + 1); // 右
      queue.push(i + 1, j); // 下
      queue.push(i, j - 1); // 左
    }

    return landCount;
  };

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (grid[i][j] === 1) {
        maxLandCount = Math.max(maxLandCount, bfs(i, j, 0));
      }
    }
  }

  return maxLandCount;
};
