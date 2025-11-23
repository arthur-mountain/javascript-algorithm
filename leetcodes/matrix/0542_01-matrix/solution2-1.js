/**
 * @param {number[][]} mat
 * @return {number[][]}
 */
var updateMatrix = function (mat) {
  const ROW = mat.length;
  const COL = mat[0].length;
  const queue = [];
  const visited = Array.from({ length: ROW }, () => Array(COL).fill(false));

  // 將所有為 0 的節點放入 queue，下面從節點為 0 的位置開始擴散，找最短距離
  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      if (mat[row][col] === 0) {
        queue.push([row, col, 0]); // row, col, distance
        visited[row][col] = true;
      }
    }
  }

  // 四個方向的偏移量：上、右、下、左
  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];
  while (queue.length > 0) {
    const [row, col, distance] = queue.shift();
    mat[row][col] = distance;

    for (let i = 0; i < directions.length; i++) {
      const [dr, dc] = directions[i];
      const nr = row + dr;
      const nc = col + dc;

      if (nr < 0 || nr >= ROW || nc < 0 || nc >= COL || visited[nr][nc]) {
        continue;
      }

      visited[nr][nc] = true;
      queue.push([nr, nc, distance + 1]);
    }
  }

  return mat;
};
