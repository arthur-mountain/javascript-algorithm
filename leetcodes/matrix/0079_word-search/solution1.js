/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
// 寫法一：先檢查 borad[row][col] === word[$i]，再決定是否進到 dfs
var exist = function (board, word) {
  const ROW = board.length;
  const COL = board[0].length;
  const DIRECTIONS = [
    [-1, 0], // 上
    [0, 1], // 右
    [1, 0], // 下
    [0, -1], // 左
  ];

  const bfs = (row, col, wordIndex, used) => {
    const key = row * COL + col;
    used.add(key);

    if (wordIndex === word.length - 1) {
      return true;
    }

    for (const [dr, dc] of DIRECTIONS) {
      const newRow = row + dr;
      const newCol = col + dc;
      const newWordIndex = wordIndex + 1;
      const newKey = newRow * COL + newCol;

      if (
        newRow < 0 ||
        newRow >= ROW ||
        newCol < 0 ||
        newCol >= COL ||
        used.has(newKey)
      ) {
        continue;
      }

      if (
        board[newRow][newCol] === word[newWordIndex] &&
        bfs(newRow, newCol, newWordIndex, used)
      ) {
        return true;
      }
    }

    used.delete(key);
    return false;
  };

  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      if (board[row][col] === word[0] && bfs(row, col, 0, new Set())) {
        return true;
      }
    }
  }

  return false;
};

// 寫法二：一律進到 dfs 檢查，整體寫法比較統一可讀
var exist = function (board, word) {
  const ROW = board.length;
  const COL = board[0].length;
  const DIRECTIONS = [
    [-1, 0], // 上
    [0, 1], // 右
    [1, 0], // 下
    [0, -1], // 左
  ];

  const bfs = (row, col, wordIndex, used) => {
    if (board[row][col] !== word[wordIndex]) {
      return false;
    }

    if (wordIndex === word.length - 1) {
      return true;
    }

    const key = row * COL + col;
    used.add(key);

    for (const [dr, dc] of DIRECTIONS) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow < 0 ||
        newRow >= ROW ||
        newCol < 0 ||
        newCol >= COL ||
        used.has(newRow * COL + newCol)
      ) {
        continue;
      }

      if (bfs(newRow, newCol, wordIndex + 1, used)) {
        return true;
      }
    }

    used.delete(key);
    return false;
  };

  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      if (bfs(row, col, 0, new Set())) {
        return true;
      }
    }
  }

  return false;
};

// 寫法三：把檢查都統一放到 dfs 開頭，不落在其他地方，最可讀
var exist = function (board, word) {
  const ROW = board.length;
  const COL = board[0].length;
  const DIRECTIONS = [
    [-1, 0], // 上
    [0, 1], // 右
    [1, 0], // 下
    [0, -1], // 左
  ];

  const bfs = (row, col, wordIndex, used) => {
    const key = row * COL + col;
    if (used.has(key)) {
      return false;
    }

    if (board[row][col] !== word[wordIndex]) {
      return false;
    }

    if (wordIndex === word.length - 1) {
      return true;
    }

    used.add(key);

    for (const [dr, dc] of DIRECTIONS) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow < 0 || newRow >= ROW || newCol < 0 || newCol >= COL) {
        continue;
      }

      if (bfs(newRow, newCol, wordIndex + 1, used)) {
        return true;
      }
    }

    used.delete(key);
    return false;
  };

  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      if (board[row][col] && bfs(row, col, 0, new Set())) {
        return true;
      }
    }
  }

  return false;
};
