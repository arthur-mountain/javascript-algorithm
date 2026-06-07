# BFS / DFS（圖遍歷策略）

## 🎯 設計理念

### 存在意義

**這個演算法策略被發明出來，是為了解決什麼類型的問題？**

- **暴力法**：不追蹤「哪些節點已經處理過」的搜尋，在有環圖中會陷入無限迴圈（A → B → A → B → …），在無環圖中會因重複展開同一節點而導致指數級膨脹（例如 DAG 中一個節點被多條路徑抵達時，其子孫會被重複計算 O(2^d) 次）。
- **可利用的結構特性**：一個節點一旦被處理過，從它出發能到達的所有資訊就已經被記錄，不需要再處理它。用一個 visited 集合追蹤已處理的節點，就能將「指數級重複」壓縮為「每個節點和每條邊各處理一次」。
- **核心加速原理**：系統性地沿著邊展開搜尋，用 visited 集合保證每個節點最多處理一次、每條邊最多檢查一次，將遍歷複雜度降至 O(V + E)。

**BFS 與 DFS 的分工**：

```plaintext
同一個核心思想（系統性遍歷 + 避免重複）的兩種展開順序：

BFS（Breadth-First Search）：
  按「距離起點的層級」展開 → 先近後遠
  保證：第一次到達某節點時，走的就是最短路徑（無權圖）
  用途：最短路徑、層級遍歷、最少步數

DFS（Depth-First Search）：
  按「一條路走到底，走不通再回頭」展開 → 先深後廣
  保證：能探索完從某節點出發的所有可達節點後才回溯
  用途：連通性、環檢測、路徑枚舉、拓撲排序
```

### 心智模型

**BFS 類比：水波擴散**

```plaintext
把一顆石頭丟進平靜的水面：
- 起點 = 石頭落水處
- 每一圈漣漪 = 一個層級（距離）
- 漣漪同時向所有方向擴散 = 同一層的所有節點同時被處理
- 先擴散到的位置 = 距離較近的節點

局限：真實水波是連續的，BFS 是離散的（一層一層跳）；
水波速度均勻，但加權圖中不同邊的「速度」不同（需要 Dijkstra）。
```

**DFS 類比：走迷宮的「靠牆法」**

```plaintext
你在迷宮裡，用右手摸著牆走：
- 每到一個岔路口，選一條路走到底
- 走到死路就回頭，嘗試岔路口的下一條路
- 在走過的地方做記號，避免重複走

局限：靠牆法在所有牆壁連通的迷宮中有效，但在有「孤島」的迷宮中可能遺漏。
DFS 用 visited 集合確保不遺漏，但不保證找到的路徑最短。
```

---

## 🏗️ 運作機制

### 核心組件

| 組件                      | 功能                   | 為什麼需要                                                                                                                       |
| ------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **容器（Queue / Stack）** | 儲存待處理的節點       | BFS 用 Queue（FIFO）保證層級順序；DFS 用 Stack（LIFO）或遞迴 call stack 保證深度優先。容器類型決定展開順序，展開順序決定算法特性 |
| **Visited Set**           | 記錄已訪問的節點       | 防止重複訪問——在有環圖中避免無限迴圈，在 DAG 中避免指數級重複展開                                                                |
| **起點（Source）**        | 搜尋的起始位置         | 搜尋必須有明確的起始節點才能啟動；起點的數量（單源 vs 多源）直接決定初始化方式和答案語義                                         |
| **鄰居存取方式**          | 取得當前節點的所有鄰居 | 定義搜尋的展開方向——adjacency list 直接查表、grid 用四/八方向偏移量、狀態圖用轉換函式                                            |

### 狀態表示

- **變數與初始狀態**：

  - BFS：`queue = [source]`（待處理節點）、`visited = { source }`（已訪問集合）、`level = 0`（當前層級，可選）
  - DFS：`stack = [source]`（迭代版）或遞迴 call stack（遞迴版）、`visited = {}`（迭代版取出時標記）或 `visited = { source }`（遞迴版進入時標記）

- **Invariant（合法條件）**：

  - BFS：queue 裡的節點最多只來自兩個相鄰的層級——當前層和下一層。當前層的節點一定排在下一層前面，因為它們先被加入 queue。這保證了每次取出的節點距離起點是非遞減的
  - 遞迴 DFS：call stack 中的函式呼叫鏈 = 當前正在探索的路徑，棧頂即路徑最深點
  - 迭代 DFS：stack 是「待探索節點的候選集」（不代表單一路徑）；已在 visited 中的節點不會再被處理
  - 通用：任何已在 visited 中的節點不會再被取出處理——這保證每個節點最多被處理一次

- **Maintenance（狀態維護）**：
  BFS/DFS 屬於建構型——每一步從容器中取出一個合法節點，處理後將其未訪問的鄰居加入容器，逐步擴大已探索區域。

  - BFS：取出節點後展開鄰居，鄰居的層級 = 當前層級 + 1。因為 FIFO 順序，新加入的節點（下一層）一定排在 queue 尾端，不會插到當前層節點前面，所以 Invariant（層級非遞減）自動維持
  - DFS：遞迴版在進入子節點時標記 visited，回溯時不刪除標記（與 Backtracking 的差異），保證每個節點只處理一次。迭代版在取出時標記，跳過已標記的重複節點

- **Extract（結果提取）**：

  - BFS 最短路徑：在 Process 步驟中，當取出的節點為目標時，當前 `level` 即為最短距離（因為 Invariant 保證第一次到達就是最短）
  - BFS 全域遍歷：遍歷結束後，`visited` 集合即為所有可達節點；`level` 為最遠距離
  - DFS 連通性：遍歷結束後，`visited` 集合即為從起點出發的連通分量
  - DFS 環檢測（三色）：在 Expand 步驟中，遇到 GRAY 節點時立即回傳「有環」
  - DFS 拓撲排序：所有節點標記為 BLACK 後，後序收集結果並反轉

- **Termination（終止條件）**：
  - 容器為空（所有可達節點都已處理）
  - 或找到目標節點（提前終止）

### 適用前提條件

**使用這個策略之前，必須確認以下前提條件成立：**

| 前提條件                                 | 為什麼需要                                                       | 違反時的後果                                                           | 替代方案                                                            |
| ---------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 問題可建模為圖（節點 + 邊）              | BFS/DFS 是圖上的操作，需要明確的「節點」和「鄰居」定義           | 概念上不適用（硬性：無法執行）                                         | 數學分析、暴力枚舉                                                  |
| BFS 求最短路徑時，邊權必須相等（或無權） | BFS 的層級 = 距離，前提是每步代價相同                            | 得到的不是真正的最短路徑（硬性：結果錯誤）                             | Dijkstra（加權非負）、Bellman-Ford（含負權）、0-1 BFS（權重僅 0/1） |
| 圖的規模在記憶體可承受範圍內             | BFS 的 queue 在最壞情況下存 O(V) 個節點；DFS 的遞迴深度可達 O(V) | BFS：記憶體爆炸；DFS：stack overflow（軟性：算法邏輯正確但實作不可行） | 雙向 BFS（減少記憶體）、迭代加深 DFS（限制深度）                    |
| 搜尋空間有限（或能被 visited 有效剪枝）  | 無限搜尋空間中 BFS/DFS 永遠不會終止                              | 程式無法停止（硬性：無法得到結果）                                     | A\* search、迭代加深、設定深度上限                                  |

### 與資料結構的關聯

底層所依賴的資料結構來儲存資料與維護狀態：

| 資料結構                | 角色               | 在本演算法中的用途                                                                                | 典型題目/場景                            |
| ----------------------- | ------------------ | ------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Graph（adjacency list） | 輸入載體           | 儲存節點與邊的連接關係                                                                            | 所有圖遍歷問題                           |
| 2D Array（grid）        | 輸入載體           | 隱式圖，每個 cell 是節點，上下左右是邊                                                            | Number of Islands、Shortest Path in Grid |
| Queue                   | 狀態維護           | BFS 的 FIFO 容器，保證層級順序                                                                    | 所有 BFS 問題                            |
| Stack                   | 狀態維護           | DFS 迭代版的 LIFO 容器                                                                            | DFS 迭代版本（避免 stack overflow）      |
| HashSet / boolean[]     | 狀態維護           | visited 集合，記錄已訪問節點                                                                      | 有環圖的遍歷                             |
| Deque                   | 狀態維護           | 0-1 BFS 中取代 Queue，按權重從前端或後端加入以維持距離排序。缺了它 0-1 BFS 無法保證正確的展開順序 | 邊權只有 0 和 1 的最短路徑               |
| HashMap                 | 狀態維護（條件性） | 記錄 parent 指標以還原路徑。僅在需要輸出具體路徑的問題中使用；不需要路徑時可省略                  | 需要輸出具體路徑時                       |

**關鍵洞察**：BFS/DFS 定義「以什麼順序展開搜尋」的邏輯，容器（Queue vs Stack vs Deque）負責維持這個順序，Visited Set 防止重複。選擇哪種容器，就決定了是 BFS 還是 DFS。

### 流程步驟

**本演算法的流程類型**：執行期流程（Runtime Flow）

BFS 和 DFS 共享相同的四步驟骨架，唯一差異在於容器類型（Queue vs Stack）：

---

1. **Initialize（初始化）**

**目的**：建立容器與 visited 集合，將起點放入

**關鍵決策點**：起點是單一節點還是多個節點（單源 vs 多源）？容器類型選 Queue（BFS）還是 Stack（DFS）？

```javascript
// BFS — 起點入列並標記
const queue = [source];
const visited = new Set([source]);

// DFS（迭代）— 起點入 stack，visited 稍後在取出時標記
const stack = [source];
const visited = new Set();

// DFS（遞迴）— 起點標記後進入遞迴
const visited = new Set();
visited.add(source);
dfs(source);
```

---

2. **Extract（取出節點）**

**目的**：從容器中取出下一個要處理的節點

**關鍵決策點**：BFS 用 `queue.shift()`（或更高效的 Queue 實作），DFS 用 `stack.pop()` 或遞迴的 function call

```javascript
// BFS
const node = queue.shift();

// DFS（迭代）— 取出時才標記 visited 並跳過重複
const node = stack.pop();
if (visited.has(node)) continue;
visited.add(node);
```

---

3. **Process（處理節點）**

**目的**：對當前節點執行題目要求的操作（計數、記錄、判斷終止等）

**關鍵決策點**：是否需要提前終止（找到目標就 return）？是否需要記錄額外資訊（層級、路徑、狀態）？

```javascript
// 範例：找到目標就提前終止
if (node === target) return level; // BFS 回傳距離
if (node === target) return path; // DFS 回傳路徑
```

---

4. **Expand（展開鄰居）**

**目的**：將當前節點的未訪問鄰居加入容器

**關鍵決策點**：

- **鄰居定義**：adjacency list 直接查表 vs grid 四方向偏移量
- **visited 標記時機**（BFS vs DFS 最關鍵的差異）：
  - BFS 在**加入 queue 時立刻標記**——防止同一個鄰居被多個父節點推入 queue（否則會重複入列且距離可能錯誤）
  - DFS 迭代版**不在加入 stack 時標記**——允許同一節點從不同路徑入 stack，取出時再檢查
  - DFS 遞迴版在**進入遞迴前標記**——防止同一節點被不同鄰居同時觸發遞迴

```javascript
// BFS：加入時標記 visited（防止重複入列）
for (const neighbor of graph[node]) {
  if (!visited.has(neighbor)) {
    visited.add(neighbor); // ← 加入時立刻標記
    queue.push(neighbor);
  }
}

// DFS（迭代）：加入時不標記（取出時才標記，見 Step 2）
for (const neighbor of graph[node]) {
  if (!visited.has(neighbor)) {
    stack.push(neighbor);
  }
}

// DFS（遞迴）：進入遞迴前標記
for (const neighbor of graph[node]) {
  if (!visited.has(neighbor)) {
    visited.add(neighbor);
    dfs(neighbor);
  }
}
```

---

**BFS 層級追蹤的額外機制**：

很多 BFS 問題需要知道「當前是第幾層」，有兩種常見寫法：

```javascript
// 方法一：逐層處理（記錄每層的節點數）
let level = 0;
while (queue.length) {
  const size = queue.length; // 快照當前層的節點數
  for (let i = 0; i < size; i++) {
    const node = queue.shift();
    // process + expand...
  }
  level++;
}

// 方法二：儲存 [node, level] pair
queue.push([source, 0]);
while (queue.length) {
  const [node, level] = queue.shift();
  // process...
  queue.push([neighbor, level + 1]);
}
```

### 模式分類

**變體總覽**：

```plaintext
BFS / DFS
├── BFS
│   ├── 標準 BFS（adjacency list，單源最短路徑 / 層級遍歷）
│   ├── Grid BFS（二維網格特化，鄰居 = 四方向偏移）
│   ├── Multi-source BFS（多個起點同時擴展）
│   ├── 0-1 BFS（邊權只有 0 和 1，用 Deque）
│   └── 雙向 BFS（從起點和終點同時搜尋）
└── DFS
    ├── 遞迴 DFS（adjacency list，最直覺的寫法）
    ├── Grid DFS（二維網格特化，鄰居 = 四方向偏移）
    ├── 迭代 DFS（顯式 Stack，避免 stack overflow）
    └── 三色標記 DFS（環檢測 / 拓撲排序用三色標記）
```

---

**變體 BFS-1：標準 BFS（單源層級遍歷 / 最短路徑）**

**觸發條件**：無權圖（或等權圖）的最短路徑、最少步數、層級遍歷。輸入為 adjacency list。

**與其他變體的差異**：最基礎的形式，單一起點，逐層展開。其他 BFS 變體都是在此基礎上修改特定 Step。

```javascript
/**
 * 標準 BFS 模板 - 單源層級遍歷
 *
 * @param {Map|Object} graph - adjacency list 表示的圖
 * @param {*} source - 起點
 * @return {Map} 從起點到每個可達節點的最短距離
 *
 * 適用場景：無權圖最短路徑、最少步數、層級遍歷
 * 觸發條件：求最短距離/最少步數 + 無權圖 + adjacency list 輸入
 *
 * 時間複雜度：O(V + E)
 * 空間複雜度：O(V)
 */
function bfs(graph, source) {
  // Step 1: Initialize
  const queue = [source];
  const visited = new Set([source]);
  let level = 0;

  while (queue.length) {
    const size = queue.length;

    for (let i = 0; i < size; i++) {
      // Step 2: Extract
      const node = queue.shift();

      // Step 3: Process
      // [根據題目需求處理 node，例如：if (node === target) return level;]

      // Step 4: Expand
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    level++;
  }
}
```

---

**變體 BFS-2：Grid BFS（二維網格特化）**

**觸發條件**：輸入為二維網格，求最短路徑或最少步數。

**與標準 BFS 的差異**：Step 4（Expand）中，鄰居的取得方式從 `graph[node]` 改為「四方向偏移量 + 邊界檢查」；visited 用 `boolean[][]` 矩陣取代 `Set`（避免座標轉字串開銷）。

```javascript
/**
 * Grid BFS 模板 - 二維網格上的 BFS
 *
 * @param {*[][]} grid - 二維網格
 * @param {number} sr - 起點 row
 * @param {number} sc - 起點 col
 * @return {number} 到達目標的最短距離（或 -1 表示不可達）
 *
 * 適用場景：迷宮最短路徑、Grid 上的最少步數
 * 觸發條件：二維網格 + 上下左右移動 + 求最短
 *
 * 時間複雜度：O(R × C)
 * 空間複雜度：O(R × C)
 */
function gridBfs(grid, sr, sc /*, targetCheck */) {
  const rows = grid.length,
    cols = grid[0].length;
  // 與標準 BFS 的差異：鄰居用四方向偏移量定義
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // Step 1: Initialize — visited 用矩陣取代 Set
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

      // Step 4: Expand — 與標準 BFS 的差異：四方向 + 邊界檢查
      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          !visited[nr][nc] &&
          grid[nr][nc] !== 0 /* 根據題目定義「可通行」條件 */
        ) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
    level++;
  }

  return -1;
}
```

---

**變體 BFS-3：Multi-source BFS（多源 BFS）**

**觸發條件**：多個起點同時向外擴散，求「每個位置到最近起點」的距離。

**與標準 BFS 的差異**：Step 1（Initialize）中，將所有起點同時放入 queue 並標記距離為 0。Step 2-4 完全不變。直覺上像「多顆石頭同時丟入水中，漣漪同時擴散」。

```javascript
/**
 * Multi-source BFS 模板 - 多個起點同時擴展
 *
 * @param {*[][]} grid - 二維網格
 * @param {[number,number][]} sources - 所有起點座標
 * @return {number[][]} 每個位置到最近起點的距離
 *
 * 適用場景：多個源頭同時擴散（腐爛的橘子、01 矩陣距離）
 * 觸發條件：「每個位置到最近的 X」
 *
 * 時間複雜度：O(V + E) — 多源不影響漸進複雜度
 * 空間複雜度：O(V)
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

  // Step 1: Initialize — 與標準 BFS 的差異：所有起點同時入列
  for (const [r, c] of sources) {
    queue.push([r, c]);
    dist[r][c] = 0;
  }

  // Step 2-4：與標準 BFS 完全相同
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
```

---

**變體 BFS-4：0-1 BFS（邊權僅 0 和 1）**

**觸發條件**：邊權只有 0 和 1 的最短路徑問題。

**與標準 BFS 的差異**：Step 1 中容器從 Queue 換成 Deque。Step 4（Expand）中，根據邊權決定加入位置——權重 0 的鄰居從前端加入（等同「不花代價，繼續當前層」），權重 1 的鄰居從後端加入（等同「花一步，進入下一層」）。這保證了 Deque 中的節點始終按距離遞增排列。

```javascript
/**
 * 0-1 BFS 模板 - 邊權僅 0 和 1 的最短路徑
 *
 * @param {Map} graph - adjacency list，graph.get(node) = [{neighbor, weight}]
 * @param {*} source - 起點
 * @return {Map} 從起點到每個可達節點的最短距離
 *
 * 適用場景：邊權只有 0 和 1（如：某些格子免費通過，某些格子花 1 步）
 * 觸發條件：最短路徑 + 邊權 ∈ {0, 1}
 *
 * 時間複雜度：O(V + E) — 每個節點最多被加入 deque 兩次（因 weight=0 和 weight=1 各一次），
 *             總操作 ≤ 2V，平均每次取出是 O(1)——這就是攤銷（amortized）
 * 空間複雜度：O(V)
 */
function zeroOneBfs(graph, source) {
  const dist = new Map();
  dist.set(source, 0);
  // Step 1: Initialize — 與標準 BFS 的差異：容器換成 Deque
  // ⚠️ 需要 Deque（前後端 O(1)），Array.unshift() 是 O(n) 會退化
  const deque = [source];

  while (deque.length) {
    // Step 2: Extract — 從前端取出（與標準 BFS 相同）
    const node = deque.shift();
    const d = dist.get(node);

    // Step 3: Process — [例如：if (node === target) return d;]

    // Step 4: Expand — 與標準 BFS 的差異：根據邊權決定加入位置
    for (const { neighbor, weight } of graph.get(node) || []) {
      const newDist = d + weight;
      if (!dist.has(neighbor) || newDist < dist.get(neighbor)) {
        dist.set(neighbor, newDist);
        if (weight === 0) {
          deque.unshift(neighbor); // 權重 0 → 前端（同層級）
        } else {
          deque.push(neighbor); // 權重 1 → 後端（下一層級）
        }
      }
    }
  }

  return dist;
}
```

---

**變體 BFS-5：雙向 BFS（Bidirectional BFS）**

**觸發條件**：已知起點和終點，搜尋空間的分支因子大，標準 BFS 太慢。

**與標準 BFS 的差異**：Step 1 中同時建立兩組容器和 visited（前向 + 後向）。Step 2-4 每輪只擴展較小的前沿。新增交會檢查（Step 4 中，若鄰居在另一方的 visited 中，路徑長度 = 兩邊距離之和 + 1）。搜尋空間從 O(b^d) 降至 O(b^(d/2))。

```javascript
/**
 * 雙向 BFS 模板 - 從起點和終點同時搜尋
 *
 * @param {Map|Object} graph - adjacency list
 * @param {*} source - 起點
 * @param {*} target - 終點
 * @return {number} 最短距離，-1 表示不可達
 *
 * 適用場景：已知起點和終點，分支因子大（如 Word Ladder）
 * 觸發條件：BFS 超時 + 已知終點 + 搜尋空間大致對稱
 *
 * 時間複雜度：O(b^(d/2))
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
    // 策略：每次擴展較小的前沿，平衡兩邊的搜尋量
    if (frontQueue.length > backQueue.length) {
      [frontQueue, backQueue] = [backQueue, frontQueue];
      [frontVisited, backVisited] = [backVisited, frontVisited];
    }

    const nextQueue = [];
    for (const node of frontQueue) {
      const currentDist = frontVisited.get(node);
      // Step 4: Expand — 與標準 BFS 的差異：新增交會檢查
      for (const neighbor of graph[node]) {
        if (backVisited.has(neighbor)) {
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

  return -1;
}
```

---

**變體 DFS-1：遞迴 DFS**

**觸發條件**：需要深度優先探索、路徑枚舉、連通分量計算。預設選擇，除非有 stack overflow 風險。

**與 BFS 的核心差異**：用遞迴 call stack 取代 Queue，天然實現 LIFO 順序。

```javascript
/**
 * 遞迴 DFS 模板 - 最基礎的深度優先遍歷
 *
 * @param {Map|Object} graph - adjacency list
 * @param {*} source - 起點
 * @param {Set} visited - 已訪問集合（外部傳入以支援多次呼叫）
 *
 * 適用場景：連通分量、flood fill、路徑探索
 * 觸發條件：需要深度優先 + 圖規模不會導致 stack overflow（V < ~10^4）
 *
 * 時間複雜度：O(V + E)
 * 空間複雜度：O(V) — call stack 最深 V 層
 */
function dfsRecursive(graph, source, visited) {
  // Step 1: Initialize（進入時標記）
  visited.add(source);

  // Step 3: Process
  // [根據題目需求處理 source]

  // Step 4: Expand — 遞迴呼叫本身包含 Step 2（Extract）
  for (const neighbor of graph[source]) {
    if (!visited.has(neighbor)) {
      dfsRecursive(graph, neighbor, visited);
    }
  }
}
```

---

**變體 DFS-2：Grid DFS（二維網格特化）**

**觸發條件**：輸入為二維網格，需要深度優先探索連通區域。

**與遞迴 DFS 的差異**：與 Grid BFS 同理——Step 4（Expand）中鄰居從 adjacency list 查表改為四方向偏移量 + 邊界檢查；visited 用 `boolean[][]` 矩陣。

```javascript
/**
 * Grid DFS 模板 - 二維網格上的遞迴 DFS
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
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // Step 1: Initialize（進入時標記）
  visited[r][c] = true;

  // Step 3: Process
  // [根據題目需求處理 grid[r][c]]

  // Step 4: Expand — 與遞迴 DFS 的差異：四方向 + 邊界檢查
  for (const [dr, dc] of dirs) {
    const nr = r + dr,
      nc = c + dc;
    if (
      nr >= 0 &&
      nr < rows &&
      nc >= 0 &&
      nc < cols &&
      !visited[nr][nc] &&
      grid[nr][nc] !== 0 /* 根據題目定義「可通行」條件 */
    ) {
      gridDfs(grid, nr, nc, visited);
    }
  }
}
```

---

**變體 DFS-3：迭代 DFS（顯式 Stack）**

**觸發條件**：圖的深度可能很大（如鏈狀圖），遞迴會 stack overflow；或需要在 DFS 過程中靈活控制流程。

**與遞迴 DFS 的差異**：用顯式 Stack 取代 call stack。Step 2（Extract）中在取出時才標記 visited 並跳過重複（遞迴版在進入時標記）。

```javascript
/**
 * 迭代 DFS 模板 - 使用顯式 Stack 避免 stack overflow
 *
 * @param {Map|Object} graph - adjacency list
 * @param {*} source - 起點
 *
 * 適用場景：圖深度大（鏈狀圖）、需要避免遞迴深度限制
 * 觸發條件：遞迴 DFS 可能 stack overflow
 *
 * 時間複雜度：O(V + E)
 * 空間複雜度：O(V)
 */
function dfsIterative(graph, source) {
  const stack = [source];
  const visited = new Set();

  while (stack.length) {
    // Step 2: Extract — 與遞迴 DFS 的差異：取出時才標記
    const node = stack.pop();
    if (visited.has(node)) continue;
    visited.add(node);

    // Step 3: Process
    // [根據題目需求處理 node]

    // Step 4: Expand
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }
}
```

---

**變體 DFS-4：三色標記 DFS（環檢測 / 拓撲排序）**

**觸發條件**：有向圖的環檢測、拓撲排序。

**與遞迴 DFS 的差異**：visited 從二值（有/無）擴展為三色——WHITE（未訪問）、GRAY（正在處理，在當前 DFS 路徑上）、BLACK（已完成處理）。Step 4（Expand）中若遇到 GRAY 節點表示存在環。Step 3（Process）拆分為進入時標記 GRAY 和離開時標記 BLACK 並收集結果。

```javascript
/**
 * 三色標記 DFS 模板 - 有向圖環檢測 / 拓撲排序
 *
 * @param {Map|Object} graph - 有向圖 adjacency list
 * @param {number} numNodes - 節點總數
 * @return {number[]|null} 拓撲排序結果，有環則回傳 null
 *
 * 適用場景：Course Schedule、有向圖環檢測、拓撲排序
 * 觸發條件：有向圖 + 依賴關係 + 需判斷是否有環或求執行順序
 *
 * 時間複雜度：O(V + E)
 * 空間複雜度：O(V)
 */
function topologicalSortDfs(graph, numNodes) {
  const WHITE = 0,
    GRAY = 1,
    BLACK = 2;
  const color = new Array(numNodes).fill(WHITE);
  const result = [];
  let hasCycle = false;

  function dfs(node) {
    if (hasCycle) return;

    // Step 1 + Step 3a: Initialize — 進入時標記 GRAY（「正在處理」）
    color[node] = GRAY;

    // Step 4: Expand — 與遞迴 DFS 的差異：檢查 GRAY = 環檢測
    for (const neighbor of graph[node] || []) {
      if (color[neighbor] === GRAY) {
        hasCycle = true; // 遇到 GRAY → 當前路徑形成環
        return;
      }
      if (color[neighbor] === WHITE) {
        dfs(neighbor);
      }
      // BLACK = 已完成，安全跳過
    }

    // Step 3b: Process（後序）— 與遞迴 DFS 的差異：離開時標記 BLACK 並收集
    color[node] = BLACK;
    result.push(node); // 後序收集（之後需反轉）
  }

  for (let i = 0; i < numNodes; i++) {
    if (color[i] === WHITE) {
      dfs(i);
      if (hasCycle) return null;
    }
  }

  return result.reverse();
}
```

---

### 複雜度總結

| 變體             | 時間複雜度 | 空間複雜度 | 備註                                                          |
| ---------------- | ---------- | ---------- | ------------------------------------------------------------- |
| 標準 BFS         | O(V + E)   | O(V)       | V = 節點數, E = 邊數                                          |
| Grid BFS         | O(R × C)   | O(R × C)   | R = 行數, C = 列數；等效於 V = R×C, E = 4V                    |
| Multi-source BFS | O(V + E)   | O(V)       | 多起點不影響漸進複雜度                                        |
| 0-1 BFS          | O(V + E)   | O(V)       | 需要 Deque（前後端 O(1)）；用 Array.unshift 會退化為 O(V × E) |
| 雙向 BFS         | O(b^(d/2)) | O(b^(d/2)) | b = 分支因子, d = 最短路徑長                                  |
| 遞迴 DFS         | O(V + E)   | O(V)       | call stack 深度最壞 O(V)                                      |
| Grid DFS         | O(R × C)   | O(R × C)   | call stack 深度最壞 R × C                                     |
| 迭代 DFS         | O(V + E)   | O(V)       | 避免 stack overflow                                           |
| 三色標記 DFS     | O(V + E)   | O(V)       | 環檢測 + 拓撲排序                                             |

**符號定義**：

- `V`：圖中節點（Vertex）的數量
- `E`：圖中邊（Edge）的數量
- `R`：網格行數（Rows）
- `C`：網格列數（Columns）
- `b`：分支因子（每個節點的平均鄰居數）
- `d`：最短路徑長度

---

## ⭐ 抽象化翻譯器

**這是最關鍵的部分——建立「問題情境 → 抽象工具」的映射能力**

### 識別核心抽象

> 這個工具的核心對象是：**圖中的節點（Vertex）**
>
> 它管理的是這些對象之間的什麼關係？**可達性（Reachability）與距離（Distance）**

### 建立映射維度

| 維度          | 要回答的問題                               | 這個答案決定了什麼                                               |
| ------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| 1. 圖建模     | 什麼是節點？什麼是邊？                     | Step 4（Expand）中鄰居的取得方式                                 |
| 2. 起點與終點 | 從哪裡開始？什麼時候結束？                 | Step 1（Initialize）的 queue 初始值、Step 3（Process）的終止判斷 |
| 3. 搜尋目標   | 求最短距離、連通性、還是枚舉所有路徑？     | BFS vs DFS 的選擇                                                |
| 4. 邊的權重   | 每步代價相同嗎？                           | 標準 BFS / 0-1 BFS / Dijkstra                                    |
| 5. 狀態定義   | visited 只記錄位置，還是需要記錄更多資訊？ | 狀態空間的維度（影響複雜度）                                     |

### 實戰檢查表

```plaintext
題目:_______________

1. 圖建模：
   - 節點是什麼？ _______________
   - 鄰居怎麼定義？ _______________（adjacency list / grid 四方向 / 狀態轉換）

2. 搜尋設定：
   - 起點？ _______________（單源 / 多源）
   - 終點 / 終止條件？ _______________（到達目標 / 遍歷完所有 / 滿足條件）

3. 目標類型：
   - □ 最短距離/最少步數 → BFS
   - □ 連通性/分量計數 → BFS 或 DFS 皆可
   - □ 路徑枚舉/回溯 → DFS
   - □ 環檢測/拓撲排序 → DFS 三色標記
   - □ 層級相關操作 → BFS 逐層處理

4. 邊權：
   - □ 無權/等權 → 標準 BFS
   - □ 0 和 1 → 0-1 BFS
   - □ 非負不等權 → Dijkstra（超出本模組）
   - □ 含負權 → Bellman-Ford（超出本模組）

5. 狀態定義：
   - visited 需要記錄什麼？ _______________（僅位置 / 位置+方向 / 位置+已收集的鑰匙...）

填完後，選擇對應的變體模板，填入題目特定的值即可實作。
```

### 映射範例

**題目 A**：[994. Rotting Oranges](https://leetcode.com/problems/rotting-oranges/)

| 維度   | 具體問題                       | 抽象映射                     |
| ------ | ------------------------------ | ---------------------------- |
| 圖建模 | 每個 cell 是節點；上下左右是邊 | Grid 隱式圖 → 用四方向偏移量 |
| 起點   | 所有腐爛的橘子（值為 2）       | **多源** → Step 1 全部入列   |
| 目標   | 所有新鮮橘子被感染的最短時間   | 最短距離（最大層級）→ BFS    |
| 邊權   | 每步 1 分鐘，等權              | 標準 BFS                     |
| 狀態   | 僅座標                         | visited = dist 矩陣          |

**從映射到實作的關鍵步驟**：套用 Multi-source BFS 模板 → Step 1 把所有腐爛橘子入列 → Step 3 不需提前終止 → BFS 完成後取最大距離 → 檢查是否有未被感染的新鮮橘子

**題目 B**：[207. Course Schedule](https://leetcode.com/problems/course-schedule/)

| 維度   | 具體問題                              | 抽象映射                  |
| ------ | ------------------------------------- | ------------------------- |
| 圖建模 | 每門課是節點；先修關係是有向邊        | 有向圖 adjacency list     |
| 起點   | 所有入度為 0 的課程（或所有節點）     | 全圖掃描（外層 for loop） |
| 目標   | 是否存在環（有環 = 無法完成所有課程） | **環檢測** → DFS 三色標記 |
| 邊權   | 無權                                  | N/A                       |
| 狀態   | 三色標記（WHITE/GRAY/BLACK）          | Step 4 遇到 GRAY = 環     |

**從映射到實作的關鍵步驟**：套用三色標記 DFS 模板 → 建立有向圖 adjacency list → 對所有 WHITE 節點啟動 DFS → Step 4 若遇到 GRAY 節點回傳 false

---

## 🔍 觸發器（模式識別）

### 正向觸發器

看到什麼特徵應該想到 BFS/DFS？

| 層級         | 特徵                                   | 為什麼這個特徵指向 BFS/DFS            |
| ------------ | -------------------------------------- | ------------------------------------- |
| **關鍵字**   | 「最短路徑」「最少步數」「最近的」     | 無權圖最短路徑 = BFS 的天然領域       |
| **關鍵字**   | 「連通」「島嶼」「區域」「flood fill」 | 連通分量問題 = BFS/DFS 遍歷           |
| **關鍵字**   | 「是否可達」「是否存在路徑」           | 可達性 = 圖遍歷的基本問題             |
| **關鍵字**   | 「排程」「依賴順序」「先修課程」       | 拓撲排序 = DFS 三色標記               |
| **結構**     | 二維網格（grid）+ 上下左右移動         | Grid = 隱式圖，cell = 節點，方向 = 邊 |
| **結構**     | 明確的圖（adjacency list / matrix）    | 直接套用 BFS/DFS                      |
| **結構**     | 狀態轉換（如密碼鎖的撥動）             | 每個狀態 = 節點，轉換 = 邊            |
| **目標**     | 求最少/最短 + 每步代價相同             | BFS 層級 = 距離                       |
| **目標**     | 列舉所有路徑/組合                      | DFS 回溯                              |
| **目標**     | 檢測環 / 判斷 DAG                      | DFS 三色標記                          |
| **操作模式** | 「同時擴散」「感染」「擴展」           | Multi-source BFS                      |
| **約束**     | n ≤ 10^4 且需要遍歷所有節點            | O(V + E) 的 BFS/DFS 可行              |

**一句話觸發規則**：看到「圖/網格上的搜尋、最短路徑、連通性、層級遍歷、環檢測」→ 想到 BFS/DFS，再根據「求最短用 BFS、求連通/路徑/環用 DFS」做選擇。

### 反向觸發器

什麼情況下「看起來適用但其實不是」？

| 陷阱情境                                           | 為什麼不適用                                 | 更好的選擇                                 |
| -------------------------------------------------- | -------------------------------------------- | ------------------------------------------ |
| 加權圖求最短路徑，邊權不相等                       | BFS 假設每步代價相同，加權圖會得到錯誤結果   | Dijkstra（非負權）、Bellman-Ford（含負權） |
| 求「最優值」但狀態有複雜約束（如背包容量）         | 不是簡單的可達性問題，狀態空間需要 DP 來優化 | Dynamic Programming                        |
| 求所有組合/排列的數量                              | 枚舉所有可能太慢，且不需要圖結構             | DP / 數學組合                              |
| 搜尋空間是數值範圍且具有單調性                     | 不需要建圖，二分搜尋更高效                   | Binary Search on Answer                    |
| 搜尋空間無限或狀態數過大（如棋盤遊戲的全狀態空間） | BFS/DFS 無法在有限時間/記憶體內完成          | A\* search、啟發式搜尋、迭代加深 DFS       |

### 與類似工具的決策點

```plaintext
圖上的搜尋問題
├── 無權圖 / 等權圖
│   ├── 求最短路徑 → BFS
│   ├── 求連通性 → BFS 或 DFS 皆可
│   ├── 求所有路徑 → DFS + 回溯
│   └── 環檢測 / 拓撲排序 → DFS 三色標記（或 Kahn's BFS）
├── 加權圖
│   ├── 邊權 ∈ {0, 1} → 0-1 BFS
│   ├── 邊權非負 → Dijkstra
│   └── 邊權含負 → Bellman-Ford
└── 動態連通性（邊不斷加入，反覆查詢）
    └── Union-Find

BFS vs DFS 的選擇
├── 需要最短距離 → BFS（保證第一次到達就是最短）
├── 需要層級資訊 → BFS（天然逐層展開）
├── 需要枚舉路徑 → DFS（天然沿路徑深入）
├── 需要環檢測 → DFS 三色標記（GRAY 節點 = 環）
├── 記憶體有限 → DFS（stack 深度通常小於 BFS 的 queue 寬度）
└── 解在淺層 → BFS（不用深入就能找到）
```

---

## ⚠️ 注意事項

### 常見陷阱

| 陷阱                                               | 錯誤寫法                                                                          | 正確寫法                                                                                      | 為什麼                                                                                                             |
| -------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| BFS 中 visited 標記太晚（Step 4）                  | `queue.push(neighbor);` 之後才 `visited.add(neighbor);`，或在 Step 2 取出時才標記 | `visited.add(neighbor); queue.push(neighbor);`（加入時立刻標記）                              | 標記太晚會讓同一節點被多個父節點推入 queue。例如 A→C 和 B→C 同時把 C 入列兩次，第二次取出 C 時距離可能已經不是最短 |
| DFS 迭代版 visited 標記太早（Step 4）              | `visited.add(neighbor); stack.push(neighbor);`（加入時就標記）                    | `const node = stack.pop(); if (visited.has(node)) continue; visited.add(node);`（取出時標記） | 加入 stack 時標記會阻止同一節點從不同路徑被探索，在某些需要「找到所有可達節點」的問題中會漏掉節點                  |
| Grid BFS/DFS 忘記邊界檢查（Step 4）                | `grid[nr][nc]`（直接存取）                                                        | `if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) { grid[nr][nc]; }`（先檢查）               | 陣列越界 → runtime error                                                                                           |
| 有向圖用無向圖的思維建圖（Step 1 前的建模）        | 建圖時 `graph[a].push(b); graph[b].push(a);`（雙向）                              | 有向圖只建 `graph[a].push(b);`（單向）                                                        | 多建的反向邊會讓遍歷到達不該到達的節點，環檢測和拓撲排序結果錯誤                                                   |
| Grid DFS 忘記在遞迴前標記 visited（Step 1/4 交界） | 只在 `gridDfs()` 函式的第一行標記                                                 | 在呼叫 `gridDfs(nr, nc)` 前就標記 `visited[nr][nc] = true`，或至少在函式第一行立刻標記        | 多個鄰居可能同時嘗試對同一 cell 發起遞迴，不預先標記會導致重複處理                                                 |
| BFS 用 `Array.shift()` 處理大量資料                | `const node = queue.shift();`（O(n) 搬移）                                        | 使用 Linked List Queue 或雙指標模擬（front 指標遞增取代搬移）                                 | `Array.shift()` 要把後面每個元素往前搬一格，在 queue 長度 n 大時每次取出是 O(n)，總複雜度退化為 O(V²)              |

### 常見變體

| 變體                       | 基於哪個模板的哪個 Step                  | 修改內容                                                                          | 適用場景                                         |
| -------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------ |
| BFS + 記錄路徑             | 標準 BFS 的 Step 4（Expand）             | 加入 `parent.set(neighbor, node)`；結束後從 target 沿 parent 回溯                 | 需要輸出具體路徑（不只是距離）                   |
| DFS + 回溯（Backtracking） | 遞迴 DFS 的 Step 4（Expand）後           | 離開時 `visited.delete(node)`，允許其他路徑重新訪問                               | 枚舉所有可能的路徑                               |
| BFS + 狀態壓縮             | 標準 BFS 的 Step 1（Initialize）+ Step 4 | visited 的 key 改為 `(位置, 額外狀態)` 的組合，如 `${row},${col},${keys_bitmask}` | 搜尋中有可改變的環境條件（鑰匙、門）             |
| DFS + 記憶化               | 遞迴 DFS 的 Step 1（Initialize）         | visited 存的不只是「有無訪問」而是「從此節點出發的結果」，遞迴回傳時記錄          | DFS 路徑有重疊子問題時（DFS + Memoization ≈ DP） |
| Iterative Deepening DFS    | 迭代 DFS 外層包一個 depth limit 迴圈     | 限制 DFS 深度，逐步加深上限（depth = 1, 2, 3, ...）                               | 空間有限但需要 BFS 的最短路徑保證                |
