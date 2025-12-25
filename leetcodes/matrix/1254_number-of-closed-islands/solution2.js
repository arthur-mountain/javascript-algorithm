/**
 * @param {number[][]} grid
 * @return {number}
 */
var closedIsland = function (grid) {
  const ROW = grid.length;
  const COL = grid[0].length;

  const bfs = (row, col) => {
    let isClosed = true;
    const queue = [[row, col]];

    while (queue.length > 0) {
      const [row, col] = queue.shift();

      // 越界或者格子不是 land 都跳過
      if (
        row < 0 ||
        row >= ROW ||
        col < 0 ||
        col >= COL ||
        grid[row][col] === 1
      ) {
        continue;
      }

      // 遇到邊界(且此時一定是陸地，因為如果是水域前面會返回)，
      // 因此與邊界陸地相鄰的不是封閉的島嶼
      if (row === 0 || col === 0 || row === ROW - 1 || col === COL - 1) {
        isClosed = false;
      }

      grid[row][col] = 1;
      queue.push([row - 1, col]); // 上
      queue.push([row, col + 1]); // 右
      queue.push([row + 1, col]); // 下
      queue.push([row, col - 1]); // 左
    }

    return isClosed;
  };

  let count = 0;
  for (let col = 0; col < COL; col++) {
    for (let row = 0; row < ROW; row++) {
      if (grid[row][col] === 0 && bfs(row, col)) {
        count++;
      }
    }
  }

  return count;
};
