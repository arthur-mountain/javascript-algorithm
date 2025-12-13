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

  // 初始化，將邊界上的 '0' 加入至 queue 中
  const queue = [];
  for (let col = 0; col < COL; col++) {
    // 上、下兩邊
    if (board[0][col] === "O") queue.push([0, col]);
    if (board[ROW - 1][col] === "O") queue.push([ROW - 1, col]);
  }
  for (let row = 0; row < ROW; row++) {
    // 左、右兩邊
    if (board[row][0] === "O") queue.push([row, 0]);
    if (board[row][COL - 1] === "O") queue.push([row, COL - 1]);
  }

  // 標記與邊界的 'O' 相連的格子
  while (queue.length > 0) {
    const [row, col] = queue.shift();
    board[row][col] = "#";

    for (const [dr, dc] of DIRECTIONS) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow < 0 ||
        newRow >= ROW ||
        newCol < 0 ||
        newCol >= COL ||
        board[newRow][newCol] === "X" ||
        board[newRow][newCol] === "#"
      ) {
        continue;
      }

      queue.push([newRow, newCol]);
    }
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
