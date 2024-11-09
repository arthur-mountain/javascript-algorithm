/*
 * Status:
 *  - [x] Done
 *  - [x] Follow up solutions
 *
 * Title:
 *  2463. Minimum Total Distance Traveled
 *
 * Topics:
 *
 * Statements:
 *  1. A factory allowed factory[j][1]'s robot at position of factory[j][0].
 *
 *  2. Robot's start position is robot[i]. We could choose any direction to move initially.
 *
 *  3. The robot do not collide with each other.
 *
 *  4. If the factory is full, the robot will crosses the factory.
 *
 *  5. If the robot moved from a position x to a position y, the distance it moved is |y - x|.
 *
 *  6. Return the minimum total distance traveled by all the robots
 *
 * Thoughts:
 *  1. Pre process the factory to a hashtable. { position: limit }
 *
 *  2.
 **/
/**
 * @param {number[]} robot
 * @param {number[][]} factory
 * @return {number}
 */
let minimumTotalDistance = (robot, factory) => {};

/*
 * follow up -> top-down
 *
 * Time: O(n log n + m log m + n * m * L)
 * Space: O(n * m * L) for memorization
 * */
minimumTotalDistance = (robot, factory) => {
  robot.sort((a, b) => a - b); // O(n log n)，n 是機器人數量
  factory.sort((a, b) => a[0] - b[0]); // O(m log m)，m 是工廠數量

  const n = robot.length;
  const m = factory.length;
  const memo = new Map();

  function dp(i, j, k) {
    // i: 機器人index (0 to n)
    // j: 工廠index (0 to m)
    // k: 當前工廠已使用的容量 (0 to L), L is factory limit
    if (i === n) return 0;
    if (j === m) return Infinity;

    const key = `${i},${j},${k}`;
    if (memo.has(key)) return memo.get(key);

    // 不在當前工廠修理
    let res = dp(i, j + 1, 0);

    // 在當前工廠(還有limit)修理
    if (k < factory[j][1]) {
      const cost = Math.abs(robot[i] - factory[j][0]);
      res = Math.min(res, dp(i + 1, j, k + 1) + cost);
    }

    memo.set(key, res);
    return res;
  }

  return dp(0, 0, 0);
};

/**
 * follow up -> update memo key
 *
 * const key = `${i},${j},${k}`;  // 例如: "1,2,3"
 * 每個字符要用 2 bytes (UTF-16)，加上分隔，對於 "1,2,3" 需要 10+ bytes
 *
 * const key = i * (m * L) + j * L + k;  // 例如: 123
 * JavaScript 中的數字通常是 8 bytes
 *
 * 例如：m = 4, L = 3
 * 對於狀態 (i=2, j=1, k=2)：
 * key = 2 * (4 * 3) + 1 * 3 + 2
 *     = 2 * 12 + 3 + 2
 *     = 24 + 5
 *     = 29
 *
 * 這個數字是唯一的，因為：
 * i 部分：以 m*L 為單位增加
 * j 部分：以 L 為單位增加
 * k 部分：以 1 為單位增加
 *
 *
 * 需注意數字 overflow ，需要另外處理，這邊沒處理
 **/
function minimumTotalDistance(robot, factory) {
  robot.sort((a, b) => a - b);
  factory.sort((a, b) => a[0] - b[0]);

  const n = robot.length;
  const m = factory.length;
  const memo = new Map();

  // 計算最大工廠容量，用於key的計算
  const maxLimit = Math.max(...factory.map((f) => f[1]));

  function dp(i, j, k) {
    if (i === n) return 0;
    if (j === m) return Infinity;

    // 使用數字key
    const key = i * (m * maxLimit) + j * maxLimit + k;
    if (memo.has(key)) return memo.get(key);

    let res = dp(i, j + 1, 0);
    if (k < factory[j][1]) {
      const cost = Math.abs(robot[i] - factory[j][0]);
      res = Math.min(res, dp(i + 1, j, k + 1) + cost);
    }

    memo.set(key, res);
    return res;
  }

  return dp(0, 0, 0);
}

/**
 * followup -> bottom-up
 *
 * Time Complexity: O(N * M * (N + M)), where N is number of robots, M is number of factories
 * Space Complexity: O(N + M)
 */
minimumTotalDistance = (robots, factories) => {
  // Sort both robots and factories for optimal assignment
  robots.sort((a, b) => a - b);
  factories.sort((a, b) => a[0] - b[0]);

  const n = robots.length;
  const m = factories.length;

  // dp[i][j][k] represents min distance to repair robots[i...n-1]
  // using factories[j...m-1] with k robots already assigned to factories[j]
  const dp = Array(n + 1)
    .fill(0)
    .map(() =>
      Array(m + 1)
        .fill(0)
        .map(() => Array(n + 1).fill(Infinity)),
    );

  // Base case: when no robots left to repair
  for (let j = 0; j <= m; j++) {
    for (let k = 0; k <= n; k++) {
      dp[n][j][k] = 0;
    }
  }

  // Fill dp table
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      for (let k = 0; k <= factories[j][1]; k++) {
        // Option 1: Skip current factory
        dp[i][j][k] = dp[i][j + 1][0];

        // Option 2: Use current factory if capacity allows
        if (k < factories[j][1]) {
          const distance = Math.abs(robots[i] - factories[j][0]);
          dp[i][j][k] = Math.min(dp[i][j][k], distance + dp[i + 1][j][k + 1]);
        }
      }
    }
  }

  return dp[0][0][0] === Infinity ? -1 : dp[0][0][0];
};
