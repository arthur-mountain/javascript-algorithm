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
      if (board[row][col] === word[0] && bfs(row, col, 0, new Set())) {
        return true;
      }
    }
  }

  return false;
};

// 寫法四：iteration backtracking
// 核心概念：模擬遞迴堆疊行為
// Stack peek 檢查當前節點是否還有子路徑(foundNext)，有就 push 深搜、無路才 pop 回溯。
var exist = function (board, word) {
  const ROW = board.length;
  const COL = board[0].length;
  const DIRECTIONS = [
    [-1, 0], // 0: 上
    [0, 1], // 1: 右
    [1, 0], // 2: 下
    [0, -1], // 3: 左
  ];

  // 遍歷每個格子找起點
  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      if (board[row][col] === word[0]) {
        // 🚀 核心：模擬 DFS 遞迴堆疊
        const stack = [{ row, col, wordIndex: 0, directionIndex: 0 }];
        // 標記起點
        board[row][col] = "#";

        while (stack.length > 0) {
          // 👁️ PEEK 當前狀態（不 pop）
          const { row, col, wordIndex, directionIndex } =
            stack[stack.length - 1];

          // ✅ 終點：走到單詞尾巴
          if (wordIndex === word.length - 1) {
            return true;
          }

          // 🔍 檢查「當前格子是否還有未試的子路徑」
          let foundNext = false;

          // 💡 只從「上次試完的位置」繼續，避免重複！
          for (let i = directionIndex; i < 4; i++) {
            const [dr, dc] = DIRECTIONS[i];
            const newRow = row + dr;
            const newCol = col + dc;

            // 合法檢查
            if (
              newRow >= 0 &&
              newRow < ROW &&
              newCol >= 0 &&
              newCol < COL &&
              board[newRow][newCol] !== "#" &&
              board[newRow][newCol] === word[wordIndex + 1]
            ) {
              // 🚀 找到路：深度優先往前
              board[newRow][newCol] = "#"; // 標記避免重複訪問

              // 📍 記錄「下次從哪個方向開始試」
              // 深度優先後續回到當前節點嘗試其他可能時，才可以從某個方向開始，
              // 因為其他方向已經嘗試過了
              stack[stack.length - 1].directionIndex = i + 1;

              // 🔗 push 新狀態，新狀態從方向 0 開始
              stack.push({
                row: newRow,
                col: newCol,
                wordIndex: wordIndex + 1,
                directionIndex: 0,
              });
              foundNext = true;
              break;
            }
          }

          // 💥 無路可走：當前分支探索完畢，才回溯
          if (!foundNext) {
            // 回溯：恢復狀態 + pop
            board[row][col] = word[wordIndex];
            stack.pop();
          }
        }

        // 🔄 探索完畢，恢復起點
        board[row][col] = word[0];
      }
    }
  }
  return false;
};
