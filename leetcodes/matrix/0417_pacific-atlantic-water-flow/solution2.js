/**
 * @param {number[][]} heights
 * @return {number[][]}
 */
// DFS（遞迴）
var pacificAtlantic = function (heights) {
  const ROW = heights.length;
  const COL = heights[0].length;

  const DIRECTION = [
    [-1, 0], // 上
    [0, 1], // 右
    [1, 0], // 下
    [0, -1], // 左
  ];

  /**
   * 從當前節點出發，遞迴探索所有可逆流回出發邊界的鄰居。
   * 進入函式前，當前節點已被加入 reachable，此處只處理鄰居的擴散。
   *
   * @param {number} row - 當前節點的 row
   * @param {number} col - 當前節點的 col
   * @param {Set<number>} reachable - 同時作為 visited set 與結果集
   */
  const dfs = (row, col, reachable) => {
    for (const [nr, nc] of DIRECTION) {
      const newRow = row + nr;
      const newCol = col + nc;
      const key = newRow * COL + newCol;

      if (
        newRow < 0 ||
        newRow >= ROW ||
        newCol < 0 ||
        newCol >= COL ||
        reachable.has(key) ||
        // 鄰居高度 < 當前高度，代表水無法逆流到該鄰居，跳過
        heights[newRow][newCol] < heights[row][col]
      ) {
        continue;
      }

      reachable.add(key);
      dfs(newRow, newCol, reachable);
    }
  };

  /**
   * 以給定的起點集合初始化 reachable，再對每個起點執行 DFS。
   *
   * @param {number[][]} starts - 初始邊界節點（[row, col] 格式）
   * @returns {Set<number>} 所有可逆流回出發邊界的節點
   */
  const initReachable = (starts) => {
    // 邊界節點本身即為可達節點，直接加入結果集
    const reachable = new Set(starts.map(([r, c]) => r * COL + c));
    for (const [r, c] of starts) dfs(r, c, reachable);
    return reachable;
  };

  // Pacific 起點：左緣（整行）+ 上緣（整列，排除左上角避免重複）
  const pacificStarts = [];
  for (let row = 0; row < ROW; row++) pacificStarts.push([row, 0]);
  for (let col = 1; col < COL; col++) pacificStarts.push([0, col]);

  // Atlantic 起點：右緣（整行）+ 下緣（整列，排除右下角避免重複）
  const atlanticStarts = [];
  for (let row = 0; row < ROW; row++) atlanticStarts.push([row, COL - 1]);
  for (let col = 0; col < COL - 1; col++) atlanticStarts.push([ROW - 1, col]);

  const pacific = initReachable(pacificStarts);
  const atlantic = initReachable(atlanticStarts);

  // 取兩個結果集的交集，即同時可抵達 Pacific 與 Atlantic 的節點
  const answers = [];
  for (const key of pacific) {
    if (atlantic.has(key)) {
      answers.push([Math.floor(key / COL), key % COL]);
    }
  }

  return answers;
};

// DFS Iteration
const pacificAtlanticIteratoin = function (heights) {
  const ROW = heights.length;
  const COL = heights[0].length;
  const DIRECTION = [
    [-1, 0], // 上
    [0, 1], // 右
    [1, 0], // 下
    [0, -1], // 左
  ];

  /**
   * 從給定的起點集合出發，以顯式 stack 模擬 DFS 反向擴散。
   *
   * 與遞迴版本的差異：
   * - 遞迴版將待處理節點隱式壓入 call stack（受 JS 引擎堆疊深度限制）
   * - 此版本改用顯式 stack（heap 記憶體），規避大型矩陣下 stack overflow 的風險
   * - stack.pop() 維持 LIFO 順序，確保展開順序與遞迴版一致（若改用 shift() 則退化為 BFS）
   *
   * @param {number[][]} starts - 初始邊界節點（[row, col] 格式）
   * @returns {Set<number>} 所有可逆流回出發邊界的節點
   */
  const dfs = (starts) => {
    // 邊界節點本身即為可達節點，直接加入結果集
    const reachable = new Set(starts.map(([r, c]) => r * COL + c));
    const stack = [...starts];

    while (stack.length > 0) {
      const [row, col] = stack.pop();

      for (const [nr, nc] of DIRECTION) {
        const newRow = row + nr;
        const newCol = col + nc;
        const key = newRow * COL + newCol;

        if (
          newRow < 0 ||
          newRow >= ROW ||
          newCol < 0 ||
          newCol >= COL ||
          reachable.has(key) ||
          // 鄰居高度 < 當前高度，代表水無法逆流到該鄰居，跳過
          heights[newRow][newCol] < heights[row][col]
        ) {
          continue;
        }

        reachable.add(key);
        stack.push([newRow, newCol]);
      }
    }

    return reachable;
  };

  // Pacific 起點：左緣（整行）+ 上緣（整列，排除左上角避免重複）
  const pacificStarts = [];
  for (let row = 0; row < ROW; row++) pacificStarts.push([row, 0]);
  for (let col = 1; col < COL; col++) pacificStarts.push([0, col]);

  // Atlantic 起點：右緣（整行）+ 下緣（整列，排除右下角避免重複）
  const atlanticStarts = [];
  for (let row = 0; row < ROW; row++) atlanticStarts.push([row, COL - 1]);
  for (let col = 0; col < COL - 1; col++) atlanticStarts.push([ROW - 1, col]);

  const pacific = dfs(pacificStarts);
  const atlantic = dfs(atlanticStarts);

  // 取兩個結果集的交集，即同時可抵達 Pacific 與 Atlantic 的節點
  const answers = [];
  for (const key of pacific) {
    if (atlantic.has(key)) {
      answers.push([Math.floor(key / COL), key % COL]);
    }
  }

  return answers;
};
