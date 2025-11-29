/**
 * @param {number[][]} grid
 * @return {number}
 */
var shortestPathBinaryMatrix = function (grid) {
  const ROW = grid.length;
  const COL = grid[0].length;

  // 當起點跟終點為 1 實則不存在 clear path，直接返回 -1
  if (grid[0][0] === 1 || grid[ROW - 1][COL - 1] === 1) {
    return -1;
  }

  const queue = [0, 0, 1];
  const visited = new Set([0]);
  const NEIGHBOR_DIRECTIONS = [
    [-1, 0], // 上
    [0, 1], // 右
    [1, 0], // 下
    [0, -1], // 左
    [-1, -1], // 左上
    [-1, 1], // 右上
    [1, -1], // 左下
    [1, 1], // 右下
  ];
  while (queue.length > 0) {
    const row = queue.shift();
    const col = queue.shift();
    const pathCount = queue.shift();

    // 先抵達終點的這條路徑一定是最短得，所以可以直接返回
    if (row === ROW - 1 && col === COL - 1) {
      return pathCount;
    }

    for (const [dr, dc] of NEIGHBOR_DIRECTIONS) {
      const newRow = row + dr;
      const newCol = col + dc;
      const newPathCount = pathCount + 1;
      const key = newRow * COL + newCol;

      if (
        // 越界檢查
        newRow < 0 ||
        newRow >= ROW ||
        newCol < 0 ||
        newCol >= COL ||
        // 此路不通
        grid[newRow][newCol] === 1 ||
        // 該鄰居節點訪問過
        visited.has(key)
      ) {
        continue;
      }

      visited.add(key);
      queue.push(newRow, newCol, newPathCount);
    }
  }

  return -1;
};
