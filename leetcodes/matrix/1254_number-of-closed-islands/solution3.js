/**
 * @param {number[][]} grid
 * @return {number}
 */
var closedIsland = function (grid) {
  const ROW = grid.length;
  const COL = grid[0].length;

  const DIRECTIONS = [
    [-1, 0], // 上
    [0, 1], // 右
    [1, 0], // 下
    [0, -1], // 左
  ];
  const bfs = (queue) => {
    while (queue.length > 0) {
      const [row, col] = queue.shift();

      for (const [dr, dc] of DIRECTIONS) {
        const newRow = row + dr;
        const newCol = col + dc;

        // 越界或者格子不是 land 都跳過
        if (
          newRow < 0 ||
          newRow >= ROW ||
          newCol < 0 ||
          newCol >= COL ||
          grid[newRow][newCol] === 1
        ) {
          continue;
        }

        grid[newRow][newCol] = 1;
        queue.push([newRow, newCol]);
      }
    }
  };

  // 標記邊界島嶼
  const edgeIslandQueue = [];
  for (let row = 0; row < ROW; row++) {
    if (grid[row][0] === 0) {
      edgeIslandQueue.push([row, 0]);
      grid[row][0] = 1;
    }
    if (grid[row][COL - 1] === 0) {
      edgeIslandQueue.push([row, COL - 1]);
      grid[row][COL - 1] = 1;
    }
  }
  for (let col = 0; col < COL; col++) {
    if (grid[0][col] === 0) {
      edgeIslandQueue.push([0, col]);
      grid[0][col] = 1;
    }
    if (grid[ROW - 1][col] === 0) {
      edgeIslandQueue.push([ROW - 1, col]);
      grid[ROW - 1][col] = 1;
    }
  }
  bfs(edgeIslandQueue);

  // 計算封閉島嶼數量
  let closedIslandCount = 0;
  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      if (grid[row][col] === 0) {
        closedIslandCount++;
        const closedIslandQueue = [[row, col]];
        grid[row][col] = 1;
        bfs(closedIslandQueue);
      }
    }
  }

  return closedIslandCount;
};
