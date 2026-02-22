/**
 * @param {number[][]} heights
 * @return {number[][]}
 */
var pacificAtlantic = function (heights) {
  const ROW = heights.length;
  const COL = heights[0].length;
  const DIRECTION = [
    [0, -1], // 上
    [1, 0], // 右
    [-1, 0], // 左
    [0, 1], // 下
  ];

  // 左上 -> 右下
  const s1 = new Set(); // 收集可以回出發邊界的節點
  const v1 = new Set(); // 拜訪過的節點
  const q1 = []; // 待處理的節點
  for (let row = 0; row < ROW; row++) {
    q1.push([row, 0]);
    v1.add(row * COL);
    s1.add(row * COL);
  }
  for (let col = 0; col < COL; col++) {
    q1.push([0, col]);
    v1.add(col);
    s1.add(col);
  }
  while (q1.length > 0) {
    const [row, col] = q1.shift();

    for (const [nr, nc] of DIRECTION) {
      const newRow = row + nr;
      const newCol = col + nc;
      const key = newRow * COL + newCol;

      if (
        newRow < 0 ||
        newRow >= ROW ||
        newCol < 0 ||
        newCol >= COL ||
        v1.has(key) ||
        // 如果新的島嶼高度比鄰居小，代表沒辦法回到出發的邊界，所以跳過
        heights[newRow][newCol] < heights[row][col]
      ) {
        continue;
      }

      v1.add(key);
      s1.add(key);
      q1.push([newRow, newCol]);
    }
  }

  // 右下 -> 左上
  const s2 = new Set(); // 收集可以回出發邊界的節點
  const v2 = new Set(); // 拜訪過的節點
  const q2 = []; // 待處理的節點
  for (let row = ROW - 1; row >= 0; row--) {
    q2.push([row, COL - 1]);
    v2.add(row * COL + COL - 1);
    s2.add(row * COL + COL - 1);
  }
  for (let col = COL - 1; col >= 0; col--) {
    q2.push([ROW - 1, col]);
    v2.add((ROW - 1) * COL + col);
    s2.add((ROW - 1) * COL + col);
  }
  while (q2.length > 0) {
    const [row, col] = q2.shift();

    for (const [nr, nc] of DIRECTION) {
      const newRow = row + nr;
      const newCol = col + nc;
      const key = newRow * COL + newCol;

      if (
        newRow < 0 ||
        newRow >= ROW ||
        newCol < 0 ||
        newCol >= COL ||
        v2.has(key) ||
        // 如果新的島嶼高度比鄰居小，代表沒辦法回到出發的邊界，所以跳過
        heights[newRow][newCol] < heights[row][col]
      ) {
        continue;
      }

      v2.add(key);
      s2.add(key);
      q2.push([newRow, newCol]);
    }
  }

  // 收集兩個交集(代表可以同時回到兩個邊界的節點)
  const answers = [];

  for (const key of s1) {
    if (s2.has(key)) {
      const row = Math.floor(key / COL);
      const col = key % COL;
      answers.push([row, col]);
    }
  }

  return answers;
};
