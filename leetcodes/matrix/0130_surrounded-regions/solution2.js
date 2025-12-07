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

  const dfs = (row, col) => {
    if (
      row < 0 ||
      row >= ROW ||
      col < 0 ||
      col >= COL ||
      board[row][col] === "X" ||
      board[row][col] === "#"
    ) {
      return;
    }

    board[row][col] = "#";
    for (const [dr, dc] of DIRECTIONS) {
      dfs(row + dr, col + dc);
    }
  };

  // 遍歷上、下兩邊
  for (let col = 0; col < COL; col++) {
    dfs(0, col);
    dfs(ROW - 1, col);
  }
  // 遍歷左、右兩邊
  for (let row = 0; row < ROW; row++) {
    dfs(row, 0);
    dfs(row, COL - 1);
  }

  // '#' 代表與邊界聯通的 'O'，還原回 'O'
  // 'O' 代表不與邊界聯通的 'O'，翻轉成 'X'
  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      if (board[row][col] === "O") board[row][col] = "X";
      if (board[row][col] === "#") board[row][col] = "O";
    }
  }

  return board;
};
