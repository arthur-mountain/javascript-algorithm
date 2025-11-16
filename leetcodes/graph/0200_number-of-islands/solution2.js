/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
  let islands = 0;
  const m = grid.length;
  const n = grid[0].length;
  const DIRECTIONS = [
    [0, -1], // 上
    [1, 0], // 右
    [0, 1], // 下
    [-1, 0], // 左
  ];

  const isIdxInBound = (i, j) => i >= 0 && i < m && j >= 0 && j < n;
  const bfs = (i, j) => {
    const queue = [[i, j]];
    grid[i][j] = "0"; // mark as visited immediately

    while (queue.length > 0) {
      const [i, j] = queue.shift();
      for (const [x, y] of DIRECTIONS) {
        if (isIdxInBound(i + x, j + y) && grid[i + x][j + y] === "1") {
          grid[i + x][j + y] = "0"; // mark before enqueue
          queue.push([i + x, j + y]);
        }
      }
    }
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === "1") {
        bfs(i, j);
        islands++;
      }
    }
  }
  return islands;
};
