/**
 * BFS / DFS（圖遍歷策略）— 標準實作模板集
 *
 * 核心思想：系統性地沿著邊展開搜尋，用 visited 集合保證每個節點最多處理一次、
 *          每條邊最多檢查一次 → O(V + E)
 * 適用前提：問題可建模為圖（明確的節點與鄰居定義）
 *
 * BFS vs DFS 的本質差異：容器決定展開順序
 *   - Queue (FIFO) → BFS → 先近後遠 → 最短路徑
 *   - Stack (LIFO) → DFS → 先深後廣 → 連通性、環檢測、路徑枚舉
 *
 * **底層依賴檢查**：
 * - ✅ Queue：repository 中已有 `data-structures/Queue` 實作（Array-based 和 Linked List-based）。BFS 模板中若效能敏感應使用 Linked List Queue 避免 `Array.shift()` 的 O(n) 問題。以下模板為了清晰度使用 Array，實戰中應替換。
 * - ✅ Graph：repository 中已有 `data-structures/Graph` 的 Adjacency List 實作。
 * - ⚠️ Deque：0-1 BFS 需要 Deque（前後端 O(1) 操作）。repository 中尚未確認有 Deque 實作，目前以 Array 模擬（`unshift` 為 O(n)，會退化）。需先補齊再正式使用 0-1 BFS 變體。
 */

// ====================================================================
// BFS 模板 1：標準 BFS（單源層級遍歷 / 最短路徑）
// ====================================================================
/**
 * 標準 BFS - 單源逐層遍歷，求無權圖最短距離
 *
 * @param {Object|Map} graph - adjacency list，graph[node] = [neighbors]
 * @param {*} source - 起點節點
 * @return {Map} 從起點到每個可達節點的最短距離
 *
 * 適用場景：無權圖最短路徑、最少步數、層級遍歷
 * 觸發條件：「最短距離 / 最少步數」+ 每步代價相同（無權圖）+ adjacency list 輸入
 *
 * 時間複雜度：O(V + E) — 每個節點入列/出列各一次，每條邊檢查一次
 * 空間複雜度：O(V) — queue + visited 各最多存 V 個節點
 */
function bfs(graph, source) {
  // Step 1: Initialize — 起點入列並標記
  const queue = [source];
  const visited = new Set([source]);
  let level = 0;
  const result = new Map([[source, 0]]);

  while (queue.length) {
    // 逐層處理：先快照當前層的節點數，
    // 這樣在迴圈中加入的新節點（下一層）不會影響當前層的邊界
    const size = queue.length;

    for (let i = 0; i < size; i++) {
      // Step 2: Extract — 從 queue 前端取出（FIFO 保證層級順序）
      const node = queue.shift();
      // ⚠️ 易錯點：Array.shift() 是 O(n)，大量資料應使用 Linked List Queue
      // 複雜度來源：若用 Array.shift()，此處退化為 O(V) per operation，總計 O(V²)

      // Step 3: Process — 根據題目需求處理 node
      // [例如：if (node === target) return level; — Extract 時機：第一次到達即為最短]

      // Step 4: Expand — 將未訪問的鄰居加入 queue
      for (const neighbor of graph[node] || []) {
        if (!visited.has(neighbor)) {
          // 易錯點：必須在加入 queue 時「立刻」標記 visited
          // 原因：若延遲到取出時才標記，同一個鄰居會被多個父節點推入 queue
          //       → 重複入列浪費時間，且可能被更遠的路徑先取出導致距離錯誤
          // 前提條件依賴：此處假設邊權相等，因此第一次到達即為最短
          visited.add(neighbor);
          queue.push(neighbor);
          result.set(neighbor, level + 1);
        }
      }
    }

    level++;
  }

  return result;
}

// ====================================================================
// BFS 模板 2：Grid BFS（二維網格特化）
// ====================================================================
/**
 * Grid BFS - 二維網格上的 BFS，cell 為節點，四方向為邊
 *
 * @param {*[][]} grid - 二維網格
 * @param {number} sr - 起點 row
 * @param {number} sc - 起點 col
 * @return {number} 到達目標的最短距離（或 -1）
 *
 * 適用場景：迷宮最短路徑、Grid 上的最少步數
 * 觸發條件：二維網格 + 上下左右移動 + 求最短
 *
 * 時間複雜度：O(R × C) — R = rows, C = cols
 * 空間複雜度：O(R × C)
 */
function gridBfs(grid, sr, sc /*, targetCheck */) {
  const rows = grid.length,
    cols = grid[0].length;
  // 與標準 BFS 的差異：鄰居用四方向偏移量定義，而非 adjacency list
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // Step 1: Initialize — 與標準 BFS 的差異：visited 用矩陣取代 Set
  const queue = [[sr, sc]];
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  visited[sr][sc] = true;
  let level = 0;

  while (queue.length) {
    const size = queue.length;

    for (let i = 0; i < size; i++) {
      // Step 2: Extract
      const [r, c] = queue.shift();

      // Step 3: Process
      // [例如：if (targetCheck(r, c)) return level;]

      // Step 4: Expand — 與標準 BFS 的差異：四方向偏移 + 邊界檢查
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        // 易錯點：忘記邊界檢查會導致 runtime error（陣列越界）
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          !visited[nr][nc] &&
          grid[nr][nc] !== 0 // [根據題目定義「可通行」條件]
        ) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }

    level++;
  }

  return -1; // 不可達
}

// ====================================================================
// BFS 模板 3：Multi-source BFS（多源 BFS）
// ====================================================================
/**
 * Multi-source BFS - 多個起點同時向外擴散
 *
 * @param {*[][]} grid - 二維網格
 * @param {[number,number][]} sources - 所有起點座標
 * @return {number[][]} 每個位置到最近起點的距離（-1 = 不可達）
 *
 * 適用場景：「每個位置到最近的 X」（腐爛的橘子、01 矩陣距離）
 * 觸發條件：多個源頭同時擴散 / 求到最近源頭的距離
 *
 * 時間複雜度：O(R × C) — 與標準 BFS 相同，多源不影響漸進複雜度
 * 空間複雜度：O(R × C)
 */
function multiSourceBfs(grid, sources) {
  const rows = grid.length,
    cols = grid[0].length;
  const dist = Array.from({ length: rows }, () => Array(cols).fill(-1));
  const queue = [];
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // Step 1: Initialize — 與標準 BFS 的唯一差異：所有起點同時入列
  // 直覺：多顆石頭同時丟進水面，漣漪同時擴散
  for (const [r, c] of sources) {
    queue.push([r, c]);
    dist[r][c] = 0; // 距離 0 同時兼做 visited 標記（-1 = 未訪問）
  }

  // Step 2-4：與標準 BFS 完全一致，不需任何修改
  while (queue.length) {
    const [r, c] = queue.shift();

    for (const [dr, dc] of dirs) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }

  return dist;
}

// ====================================================================
// BFS 模板 4：0-1 BFS（邊權僅 0 和 1）
// ====================================================================
/**
 * 0-1 BFS - 邊權只有 0 和 1 的最短路徑
 *
 * @param {Map} graph - adjacency list，graph.get(node) = [{neighbor, weight}]
 * @param {*} source - 起點
 * @return {Map} 從起點到每個可達節點的最短距離
 *
 * 適用場景：邊權僅 ∈ {0, 1}（某些路徑免費，某些花 1 步）
 * 觸發條件：最短路徑 + 邊權 ∈ {0, 1}
 *
 * 與標準 BFS 的差異：
 *   Step 1: 容器從 Queue 換成 Deque
 *   Step 4: 根據邊權決定從前端或後端加入
 *   - 權重 0 的鄰居 → 前端（等同「不花代價，同層」）
 *   - 權重 1 的鄰居 → 後端（等同「花一步，下一層」）
 *   - 這保證 Deque 中節點始終按距離遞增排列
 *
 * 時間複雜度：O(V + E) — 每個節點最多被加入 deque 兩次
 *            （因 weight=0 和 weight=1 各一次），總操作 ≤ 2V，
 *             除以 V 次取出操作後平均每次 O(1)——這就是攤銷（amortized）
 * 空間複雜度：O(V)
 */
function zeroOneBfs(graph, source) {
  const dist = new Map();
  dist.set(source, 0);
  // Step 1: Initialize — 與標準 BFS 的差異：容器換成 Deque
  // ⚠️ 前提條件依賴：0-1 BFS 的正確性依賴 Deque 的前後端 O(1) 操作
  // Array.unshift() 是 O(n)，大量資料下會退化為 O(V × E)
  // TODO: 若 repository 有 Deque 實作應替換
  const deque = [source];

  while (deque.length) {
    // Step 2: Extract — 從前端取出（與標準 BFS 相同）
    const node = deque.shift();
    const d = dist.get(node);

    // Step 3: Process
    // [例如：if (node === target) return d;]

    // Step 4: Expand — 與標準 BFS 的關鍵差異：根據邊權決定加入位置
    for (const { neighbor, weight } of graph.get(node) || []) {
      const newDist = d + weight;
      if (!dist.has(neighbor) || newDist < dist.get(neighbor)) {
        dist.set(neighbor, newDist);
        if (weight === 0) {
          deque.unshift(neighbor); // 權重 0 → 前端（同層級，優先處理）
        } else {
          deque.push(neighbor); // 權重 1 → 後端（下一層級）
        }
      }
    }
  }

  return dist;
}

// ====================================================================
// BFS 模板 5：雙向 BFS（Bidirectional BFS）
// ====================================================================
/**
 * 雙向 BFS - 從起點和終點同時搜尋，交會時結束
 *
 * @param {Object|Map} graph - adjacency list
 * @param {*} source - 起點
 * @param {*} target - 終點
 * @return {number} 最短距離，-1 表示不可達
 *
 * 適用場景：已知起點與終點，搜尋空間分支因子大（如 Word Ladder）
 * 觸發條件：標準 BFS 超時 + 已知終點 + 搜尋空間大致對稱
 *
 * 與標準 BFS 的差異：
 *   Step 1: 建立兩組容器和 visited（前向 + 後向）
 *   Step 2-4: 每輪只擴展較小的前沿
 *   Step 4: 新增交會檢查（鄰居在另一方 visited 中）
 *   搜尋量從 O(b^d) 降至 O(b^(d/2))
 *
 * 時間複雜度：O(b^(d/2)) — b = 分支因子, d = 最短路徑長
 * 空間複雜度：O(b^(d/2))
 */
function bidirectionalBfs(graph, source, target) {
  if (source === target) return 0;

  // Step 1: Initialize — 與標準 BFS 的差異：建立兩組容器和 visited
  let frontVisited = new Map([[source, 0]]);
  let backVisited = new Map([[target, 0]]);
  let frontQueue = [source];
  let backQueue = [target];

  while (frontQueue.length && backQueue.length) {
    // 策略：每次擴展「較小的前沿」，平衡兩邊搜尋量
    // 這避免了一邊過度膨脹而另一邊幾乎沒展開的不平衡情況
    if (frontQueue.length > backQueue.length) {
      [frontQueue, backQueue] = [backQueue, frontQueue];
      [frontVisited, backVisited] = [backVisited, frontVisited];
    }

    const nextQueue = [];
    for (const node of frontQueue) {
      // Step 2: Extract（隱含在 for...of 中）
      const currentDist = frontVisited.get(node);

      // Step 4: Expand — 與標準 BFS 的差異：新增交會檢查
      for (const neighbor of graph[node] || []) {
        if (backVisited.has(neighbor)) {
          // 交會！路徑長度 = 前向距離 + 1 + 後向距離
          return currentDist + 1 + backVisited.get(neighbor);
        }
        if (!frontVisited.has(neighbor)) {
          frontVisited.set(neighbor, currentDist + 1);
          nextQueue.push(neighbor);
        }
      }
    }

    frontQueue = nextQueue;
  }

  return -1; // 不可達
}

// ====================================================================
// DFS 模板 1：遞迴 DFS
// ====================================================================
/**
 * 遞迴 DFS - 最基礎的深度優先遍歷
 *
 * @param {Object|Map} graph - adjacency list
 * @param {*} node - 當前節點
 * @param {Set} visited - 已訪問集合（外部建立並傳入）
 * @param {Function} [processNode] - 可選的節點處理函式
 *
 * 適用場景：連通分量、flood fill、路徑探索
 * 觸發條件：深度優先遍歷 + 圖規模不會導致 stack overflow（V < ~10^4）
 *
 * 時間複雜度：O(V + E) — 每個節點和每條邊各處理一次
 * 空間複雜度：O(V) — call stack 深度最壞 V 層（鏈狀圖）
 */
function dfsRecursive(graph, node, visited, processNode) {
  // Step 1: Initialize — 進入時立刻標記
  // 易錯點：若不在此處立刻標記，同一節點可能被不同鄰居同時觸發遞迴
  visited.add(node);

  // Step 3: Process
  if (processNode) processNode(node);

  // Step 4: Expand — 遞迴呼叫本身包含 Step 2（Extract）
  for (const neighbor of graph[node] || []) {
    if (!visited.has(neighbor)) {
      dfsRecursive(graph, neighbor, visited, processNode);
    }
  }
}

// ====================================================================
// DFS 模板 2：Grid DFS（二維網格特化）
// ====================================================================
/**
 * Grid DFS - 二維網格上的遞迴 DFS
 *
 * @param {*[][]} grid - 二維網格
 * @param {number} r - 當前 row
 * @param {number} c - 當前 col
 * @param {boolean[][]} visited - 訪問矩陣
 *
 * 適用場景：Number of Islands、flood fill、連通區域計數
 * 觸發條件：Grid + 連通性 / 區域標記
 *
 * 時間複雜度：O(R × C)
 * 空間複雜度：O(R × C) — call stack 最深 R × C 層
 */
function gridDfs(grid, r, c, visited) {
  const rows = grid.length,
    cols = grid[0].length;
  // 與遞迴 DFS 的差異：鄰居用四方向偏移量，而非 adjacency list
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // Step 1: Initialize — 進入時標記（與遞迴 DFS 相同）
  visited[r][c] = true;

  // Step 3: Process
  // [根據題目需求處理 grid[r][c]]

  // Step 4: Expand — 與遞迴 DFS 的差異：四方向偏移 + 邊界檢查
  for (const [dr, dc] of dirs) {
    const nr = r + dr,
      nc = c + dc;
    // 易錯點：忘記邊界檢查會導致 runtime error
    if (
      nr >= 0 &&
      nr < rows &&
      nc >= 0 &&
      nc < cols &&
      !visited[nr][nc] &&
      grid[nr][nc] !== 0 // [根據題目定義「可通行」條件]
    ) {
      gridDfs(grid, nr, nc, visited);
    }
  }
}

// ====================================================================
// DFS 模板 3：迭代 DFS（顯式 Stack）
// ====================================================================
/**
 * 迭代 DFS - 使用顯式 Stack 避免 stack overflow
 *
 * @param {Object|Map} graph - adjacency list
 * @param {*} source - 起點
 * @param {Function} [processNode] - 可選的節點處理函式
 *
 * 適用場景：圖深度大（鏈狀圖、深樹）、面試中被要求非遞迴版本
 * 觸發條件：遞迴 DFS 可能 stack overflow（V > ~10^4）
 *
 * 與遞迴 DFS 的關鍵差異（標記時機）：
 * - 遞迴 DFS：在進入函式時立即標記 `visited`。
 * - 迭代 DFS：在「取出時」才標記 `visited`。
 * 原因：Stack 中可能存在同一節點的多個副本（因為在鄰居擴展時無法預知路徑），
 * 必須確保僅在第一次從 stack 彈出時才進行邏輯處理。
 *
 * 時間複雜度：O(V + E)
 * 空間複雜度：O(V)
 */
function dfsIterative(graph, source, processNode) {
  // Step 1: Initialize
  // 建立 Stack 並將起點放入；visited 用於記錄「已正式處理過」的節點。
  const stack = [source];
  const visited = new Set();

  while (stack.length) {
    // Step 2: Extract
    // 易錯點：迭代 DFS 的核心機制是「延遲標記」。
    // 若節點已在之前被處理過，代表這是該節點的重複路徑，直接跳過以避免重複邏輯。
    const node = stack.pop();

    if (visited.has(node)) continue;
    visited.add(node);

    // Step 3: Process
    if (processNode) processNode(node);

    // Step 4: Expand
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }
}

// ====================================================================
// DFS 模板 4：三色標記 DFS（環檢測 / 拓撲排序）
// ====================================================================
/**
 * 三色標記 DFS - 有向圖環檢測與拓撲排序
 *
 * @param {Object|Map} graph - 有向圖 adjacency list
 * @param {number} numNodes - 節點總數（假設節點編號 0 ~ numNodes-1）
 * @return {number[]|null} 拓撲排序結果；有環則回傳 null
 *
 * 適用場景：Course Schedule、任務排程、編譯順序
 * 觸發條件：有向圖 + 依賴關係 + 環檢測或求執行順序
 *
 * 與遞迴 DFS 的差異：
 *   - visited 從二值(有/無)擴展為三色(pending/processign/completed)
 *   - Step 4（Expand）中遇到 GRAY = 環
 *   - Step 3（Process）拆為進入時 GRAY + 離開時 BLACK 並收集結果
 *
 * 三色的語義：
 *   WHITE (0)：未訪問 — 還沒開始處理
 *   GRAY  (1)：處理中 — 在當前 DFS 路徑上（其子孫尚未全部完成）
 *   BLACK (2)：已完成 — 該節點及其所有子孫都已處理完畢
 *
 * 環檢測原理：若展開鄰居時遇到 GRAY 節點，
 *             代表「從當前節點往下走，又走回了當前路徑上的某個祖先」→ 環
 *
 * 時間複雜度：O(V + E)
 * 空間複雜度：O(V) — color 陣列 + call stack
 */
function topologicalSortDfs(graph, numNodes) {
  const WHITE = 0,
    GRAY = 1,
    BLACK = 2;
  const color = new Array(numNodes).fill(WHITE);
  const result = []; // 拓撲排序結果（後序收集，最後反轉）
  let hasCycle = false;

  function dfs(node) {
    // 剪枝：一旦發現環，後續所有遞迴都立即返回
    if (hasCycle) return;

    // Step 1 + Step 3a: Initialize
    // 與遞迴 DFS 的差異：標記為 GRAY（「我正在處理中，我的子孫還沒全部完成」）
    color[node] = GRAY;

    // Step 4: Expand — 與遞迴 DFS 的差異：檢查 GRAY = 環檢測
    for (const neighbor of graph[node] || []) {
      if (color[neighbor] === GRAY) {
        // 遇到 GRAY 鄰居 → 回到了當前 DFS 路徑上的祖先 → 環！
        hasCycle = true;
        return;
      }
      if (color[neighbor] === WHITE) {
        // 未訪問的鄰居 → 繼續深入
        dfs(neighbor);
      }
      // color === BLACK 的鄰居：已完成處理，安全跳過
    }

    // Step 3b: Process（後序）
    // 與遞迴 DFS 的差異：離開時標記 BLACK 並收集結果，「我和我的所有子孫都處理完了」
    color[node] = BLACK;
    // 後序收集：一個節點的所有依賴都處理完後才加入結果
    // 因此結果是反向的拓撲排序，最後需要 reverse
    // 複雜度來源：reverse 是 O(V)，不影響整體 O(V + E)
    result.push(node);
  }

  // 對所有未訪問的節點啟動 DFS
  // 處理非連通圖：可能存在多個獨立的子圖
  for (let i = 0; i < numNodes; i++) {
    if (color[i] === WHITE) {
      dfs(i);
      if (hasCycle) return null;
    }
  }

  // 後序反轉 = 拓撲排序
  // 原因：後序中最後完成的節點是依賴最少的（應該排在最前面）
  return result.reverse();
}

// ====================================================================
// 輔助工具：連通分量計數（示範 BFS/DFS 的典型應用）
// ====================================================================
/**
 * 連通分量計數 - 計算無向圖中有幾個連通分量
 *
 * @param {Object|Map} graph - 無向圖 adjacency list
 * @param {*[]} allNodes - 所有節點的列表
 * @return {number} 連通分量數量
 *
 * 適用場景：Number of Islands、朋友圈數量、Province 計數
 *
 * 時間複雜度：O(V + E)
 * 空間複雜度：O(V)
 */
function countComponents(graph, allNodes) {
  const visited = new Set();
  let count = 0;

  for (const node of allNodes) {
    if (!visited.has(node)) {
      // 每次啟動一次 DFS = 發現一個新的連通分量
      count++;
      dfsRecursive(graph, node, visited);
    }
  }

  return count;
}

module.exports = {
  // BFS 變體
  bfs,
  gridBfs,
  multiSourceBfs,
  zeroOneBfs,
  bidirectionalBfs,
  // DFS 變體
  dfsRecursive,
  gridDfs,
  dfsIterative,
  topologicalSortDfs,
  // 輔助工具（非核心模板）
  countComponents,
};
