/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxAreaOfIsland = function (grid) {
  const row = grid.length;
  const col = grid[0].length;
  let maxLandCount = 0;

  const dfs = (i, j, landCount) => {
    if (i < 0 || i >= row || j < 0 || j >= col || grid[i][j] === 0) {
      return landCount;
    }

    landCount++;
    grid[i][j] = 0;

    landCount = dfs(i - 1, j, landCount); // 上
    landCount = dfs(i, j + 1, landCount); // 右
    landCount = dfs(i + 1, j, landCount); // 下
    landCount = dfs(i, j - 1, landCount); // 左

    return landCount;
  };

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (grid[i][j] === 1) {
        maxLandCount = Math.max(maxLandCount, dfs(i, j, 0));
      }
    }
  }

  return maxLandCount;
};

var maxAreaOfIslandIteration = function (grid) {
  const row = grid.length;
  const col = grid[0].length;
  let maxLandCount = 0;

  const dfs = (i, j, landCount) => {
    const stack = [i, j];

    while (stack.length > 0) {
      j = stack.pop();
      i = stack.pop();

      if (i < 0 || i >= row || j < 0 || j >= col || grid[i][j] === 0) {
        continue;
      }

      landCount++;
      grid[i][j] = 0;

      stack.push(i - 1, j); // 上
      stack.push(i, j + 1); // 右
      stack.push(i + 1, j); // 下
      stack.push(i, j - 1); // 左
    }

    return landCount;
  };

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (grid[i][j] === 1) {
        maxLandCount = Math.max(maxLandCount, dfs(i, j, 0));
      }
    }
  }

  return maxLandCount;
};
