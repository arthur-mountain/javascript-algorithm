/**
 * @param {number[][]} grid
 * @return {number}
 */
var minDays = function (grid) {
  const cols = grid.length;
  const rows = grid[0].length;
  let count = 0;

  if (cols === 1) {
    if (rows === 2) return rows;

    for (let rowI = 0; rowI < rows; rowI++) {
      if (grid[0][rowI] === 1) {
        if (grid[0][rowI + 1] === 1) {
          grid[0][rowI + 1] = 0;
          rowI++;
          count++;
        }
      }
    }

    return count;
  }

  for (let colI = 0; colI < cols; colI++) {
    for (let rowI = 0; rowI < rows; rowI++) {
      if (grid[colI][rowI] === 0) continue;

      // left
      if (grid[colI]?.[rowI - 1] === 1) {
        grid[colI][rowI - 1] = 0;
        count++;
      }

      // right
      if (grid[colI]?.[rowI + 1] === 1) {
        grid[colI][rowI + 1] = 0;
        count++;
      }

      // top
      if (grid[colI + 1]?.[rowI] === 1) {
        grid[colI + 1][rowI] = 0;
        count++;
      }

      // bottom
      if (grid[colI - 1]?.[rowI] === 1) {
        grid[colI - 1][rowI] = 0;
        count++;
      }
    }
  }

  return count;
};
