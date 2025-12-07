/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solve = function (board) {
  const ROW = board.length;
  const COL = board[0].length;
  const DIRECTIONS = [
    [-1, 0], // 上
    [0, 1], // 右
    [1, 0], // 下
    [0, -1], // 左
  ];

  const getKey = (row, col) => row * COL + col;
  const isInBound = (row, col) =>
    row >= 0 && row < ROW && col >= 0 && col < COL;

  const visited = new Set();
  const dfs = (row, col, regionCells = []) => {
    const key = getKey(row, col);
    if (visited.has(key)) {
      return;
    }

    regionCells.push(key);
    visited.add(key);
    for (const [dr, dc] of DIRECTIONS) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (isInBound(newRow, newCol) && board[newRow][newCol] === "O") {
        dfs(newRow, newCol, regionCells);
      }
    }
  };

  const isEdge = (row, col) =>
    row === 0 || col === 0 || row === ROW - 1 || col === COL - 1;
  const markAsSurrounded = (regionCells) => {
    if (
      regionCells.some((regionKey) => {
        const regionRow = Math.floor(regionKey / COL);
        const regionCol = regionKey % COL;
        return (
          isEdge(regionRow, regionCol) && board[regionRow][regionCol] === "O"
        );
      })
    ) {
      return;
    }
    for (const regionKey of regionCells) {
      const regionRow = Math.floor(regionKey / COL);
      const regionCol = regionKey % COL;
      board[regionRow][regionCol] = "X";
    }
  };

  for (let row = 1; row < ROW - 1; row++) {
    for (let col = 1; col < COL - 1; col++) {
      if (board[row][col] === "O") {
        const regionCells = [];
        dfs(row, col, regionCells);
        markAsSurrounded(regionCells);
      }
    }
  }
};
