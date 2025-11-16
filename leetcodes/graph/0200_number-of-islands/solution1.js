/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
  const m = grid.length;
  const n = grid[0].length;
  let islands = 0;

  const visit = (i, j) => {
    if (i >= 0 && i < m && j >= 0 && j < n && grid[i][j] === "1") {
      grid[i][j] = "0";
      visit(i, j - 1);
      visit(i + 1, j);
      visit(i, j + 1);
      visit(i - 1, j);
    }
  };

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === "1") {
        visit(i, j);
        islands++;
      }
    }
  }
  return islands;
};
