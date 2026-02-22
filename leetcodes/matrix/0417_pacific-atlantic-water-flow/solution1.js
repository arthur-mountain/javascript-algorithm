/**
 * @param {number[][]} heights
 * @return {number[][]}
 */
var pacificAtlantic = function (heights) {
  const ROW = heights.length;
  const COL = heights[0].length;
  const DIRECTION = [
    [-1, 0], // 上
    [1, 0], // 下
    [0, -1], // 左
    [0, 1], // 右
  ];

  /**
   * 從給定的起點集合出發，進行 BFS 反向擴散。
   *
   * 反向邏輯：正向是水往低處流，反向是從邊界逆流往高處爬。
   * 因此鄰居節點的高度必須 >= 當前節點，才允許加入 queue。
   *
   * reachable 同時作為 visited set 與結果集，
   * 避免建立兩個語意重複的資料結構。
   *
   * @param {number[][]} queue - 初始邊界節點（已轉為 [row, col] 格式）
   * @returns {Set<number>} 所有可逆流回出發邊界的節點（以 row * COL + col 作為 key）
   */
  const bfs = (queue) => {
    const reachable = new Set(queue.map(([r, c]) => r * COL + c));

    while (queue.length > 0) {
      const [row, col] = queue.shift();

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
        queue.push([newRow, newCol]);
      }
    }

    return reachable;
  };

  // Pacific 起點：左緣（整行）+ 上緣（整列，排除左上角避免重複）
  const pacificQueue = [];
  for (let row = 0; row < ROW; row++) pacificQueue.push([row, 0]);
  for (let col = 1; col < COL; col++) pacificQueue.push([0, col]);

  // Atlantic 起點：右緣（整行）+ 下緣（整列，排除右下角避免重複）
  const atlanticQueue = [];
  for (let row = 0; row < ROW; row++) atlanticQueue.push([row, COL - 1]);
  for (let col = 0; col < COL - 1; col++) atlanticQueue.push([ROW - 1, col]);

  const pacific = bfs(pacificQueue);
  const atlantic = bfs(atlanticQueue);

  // 取兩個結果集的交集，即同時可抵達 Pacific 與 Atlantic 的節點
  const answers = [];
  for (const key of pacific) {
    if (atlantic.has(key)) {
      answers.push([Math.floor(key / COL), key % COL]);
    }
  }

  return answers;
};
