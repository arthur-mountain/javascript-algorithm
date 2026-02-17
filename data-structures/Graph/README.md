# Graph（圖）

## 🎯 設計理念

### 存在意義

**這個工具被發明出來，是為了解決什麼類型的問題？**

- **痛點**：現實世界中存在大量「多對多」關係的問題——城市之間的道路網絡、社交網絡中的好友關係、網頁之間的超連結、課程之間的先修關係。這些問題無法用線性結構（Array、Linked List）或層級結構（Tree）有效表達，因為這些結構都假設了特定的拓撲限制。

- **價值主張**：提供一個通用的數學抽象，能夠表達任意實體之間的任意關係，並支援在這些關係上進行系統性的搜尋與分析。

- **一句話本質**：Graph 是描述「實體」與「關係」的通用資料結構，是所有關係型問題的統一抽象框架。

```plaintext
【核心洞察】
Tree 是特殊的 Graph（無環連通圖）
Linked List 是特殊的 Tree（每個節點最多一個子節點）
Array 是特殊的 Linked List（連續記憶體配置）

Graph 是這些結構的「最一般化形式」——
移除所有拓撲限制後，剩下的就是 Graph。
```

### 心智模型

**用生活化的類比建立直覺**

**類比：城市與道路網絡**

```plaintext
想像一張地圖：
- 城市 = 節點（Vertex / Node）
- 道路 = 邊（Edge）
- 單行道 = 有向邊（Directed Edge）
- 雙向道 = 無向邊（Undirected Edge）
- 道路長度 = 邊的權重（Weight）

當你要從 A 城市到 B 城市：
- BFS = 尋找「經過最少城市」的路線（轉乘次數最少）
- DFS = 沿著一條路一直走到底，走不通再回頭
- Dijkstra = 尋找「總距離最短」的路線
```

**類比：社交網絡**

```plaintext
- 人 = 節點
- 好友關係 = 無向邊（你是我朋友 = 我是你朋友）
- 追蹤關係 = 有向邊（我追蹤你 ≠ 你追蹤我）
- 互動頻率 = 邊的權重

「六度分隔理論」本質上是在問：
這個 Graph 的直徑（最長最短路徑）是多少？
```

**局限性**：

- 真實地圖有地理座標，Graph 本身不包含位置資訊
- 真實社交關係有強弱程度的連續變化，Graph 的邊權重是離散的
- Graph 假設關係是靜態的，但現實關係會動態變化

---

## 🏗️ 抽象結構

### 核心組件

| 組件                  | 功能             | 為什麼需要                             |
| --------------------- | ---------------- | -------------------------------------- |
| **Vertex（節點）**    | 代表實體         | Graph 的基本單位，沒有節點就沒有 Graph |
| **Edge（邊）**        | 代表關係         | 連接兩個節點，定義它們之間的關聯       |
| **Weight（權重）**    | 量化關係強度     | 區分不同邊的「成本」或「距離」（可選） |
| **Direction（方向）** | 定義關係的方向性 | 區分單向與雙向關係（有向 vs 無向）     |

### 狀態表示

Graph 有兩種主要的底層表示方式：

#### 表示法一：Adjacency List（鄰接表）

```javascript
// 使用 Object 或 Map 儲存
adjacencyList = {
  A: ["B", "C"], // A 連接到 B 和 C
  B: ["A", "D"], // B 連接到 A 和 D
  C: ["A", "D"], // C 連接到 A 和 D
  D: ["B", "C"], // D 連接到 B 和 C
};

// 視覺化：
//     A
//    / \
//   B   C
//    \ /
//     D
```

**空間複雜度**：O(V + E)

- V 個節點各需要一個 entry
- 每條邊在無向圖中儲存 2 次，有向圖中儲存 1 次

#### 表示法二：Adjacency Matrix（鄰接矩陣）

```javascript
// 使用 2D Array 儲存
// 假設節點編號為 0, 1, 2, 3（對應 A, B, C, D）
adjacencyMatrix = [
  //   A  B  C  D
  [0, 1, 1, 0], // A
  [1, 0, 0, 1], // B
  [1, 0, 0, 1], // C
  [0, 1, 1, 0], // D
];

// matrix[i][j] = 1 表示節點 i 和節點 j 之間有邊
// matrix[i][j] = 0 表示沒有邊
// 對於加權圖，可以存權重值而非 0/1
```

**空間複雜度**：O(V²)

- 固定需要 V × V 的空間，與邊的數量無關

#### 如何選擇表示法？

| 特性               | Adjacency List    | Adjacency Matrix |
| ------------------ | ----------------- | ---------------- |
| **空間複雜度**     | O(V + E)          | O(V²)            |
| **適合圖類型**     | 稀疏圖（E << V²） | 稠密圖（E ≈ V²） |
| **查詢邊是否存在** | O(degree)         | O(1)             |
| **遍歷所有邊**     | O(V + E)          | O(V²)            |
| **新增邊**         | O(1)              | O(1)             |
| **刪除邊**         | O(degree)         | O(1)             |
| **新增節點**       | O(1)              | O(V²) 需重建矩陣 |

```plaintext
【選擇決策樹】
你的 Graph 是：
├── 稀疏圖（邊數遠小於 V²）→ Adjacency List
│   └── 例：社交網絡、道路網、網頁連結
├── 稠密圖（邊數接近 V²）→ Adjacency Matrix
│   └── 例：完全圖、某些 DP 問題
└── 需要 O(1) 查詢邊是否存在 → Adjacency Matrix
    └── 例：某些需要頻繁檢查連接的演算法
```

### 核心操作

#### 1. addVertex（新增節點）

**目的**：在 Graph 中加入一個新的節點

**輸入/輸出**：

- 輸入：節點識別符（vertex）
- 輸出：無（修改原 Graph）

**不變量**：新增後，該節點存在於 Graph 中，但沒有任何邊

**Adjacency List 實作**：

```javascript
addVertex(vertex) {
  // 只有當節點不存在時才新增
  // 避免覆蓋已存在節點的鄰居列表
  if (!this.adjacencyList[vertex]) {
    this.adjacencyList[vertex] = [];
  }
}
```

**時間複雜度**：O(1)

---

#### 2. addEdge（新增邊）

**目的**：在兩個節點之間建立連接

**輸入/輸出**：

- 輸入：source（起點）、destination（終點）
- 輸出：無（修改原 Graph）

**不變量**：

- 兩個節點都必須存在於 Graph 中
- 無向圖：雙向都要加入
- 有向圖：只加入 source → destination

**Adjacency List 實作（無向圖）**：

```javascript
addEdge(source, destination) {
  // 確保兩個節點都存在
  if (!this.adjacencyList[source]) this.addVertex(source);
  if (!this.adjacencyList[destination]) this.addVertex(destination);

  // 無向圖：雙向都要加入
  this.adjacencyList[source].push(destination);
  this.adjacencyList[destination].push(source);
}
```

**Adjacency List 實作（有向圖）**：

```javascript
addEdge(source, destination) {
  if (!this.adjacencyList[source]) this.addVertex(source);
  if (!this.adjacencyList[destination]) this.addVertex(destination);

  // 有向圖：只加入單向
  this.adjacencyList[source].push(destination);
}
```

**時間複雜度**：O(1)

---

#### 3. BFS（廣度優先搜尋）

**目的**：從起點開始，按「層級」順序訪問所有可達節點

**輸入/輸出**：

- 輸入：start（起始節點）
- 輸出：訪問順序的陣列

**不變量**：

- 每個節點最多被訪問一次
- 距離起點越近的節點越先被訪問

**核心思想**：使用 Queue（FIFO）確保「先發現的先處理」

```javascript
bfs(start) {
  const queue = [start];          // Queue：待處理的節點
  const visited = { [start]: true }; // 標記已訪問，避免重複
  const result = [];              // 訪問順序

  while (queue.length > 0) {
    // 取出 queue 最前面的節點（先進先出）
    const current = queue.shift();
    result.push(current);

    // 將所有未訪問的鄰居加入 queue
    for (const neighbor of this.adjacencyList[current]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;  // 標記為已訪問
        queue.push(neighbor);      // 加入待處理 queue
      }
    }
  }

  return result;
}
```

**視覺化說明**：

```plaintext
Graph:          BFS from A:
    A
   /|\          Layer 0: [A]
  B C D         Layer 1: [B, C, D]
  |   |         Layer 2: [E, F]
  E   F
                訪問順序: A → B → C → D → E → F
```

**時間複雜度**：O(V + E)

- 每個節點被訪問一次：O(V)
- 每條邊被檢查一次（無向圖兩次）：O(E)

**空間複雜度**：O(V)

- Queue 最多存 V 個節點
- visited 存 V 個節點

---

#### 4. DFS（深度優先搜尋）

**目的**：從起點開始，沿著一條路徑盡可能深入，然後回溯

**輸入/輸出**：

- 輸入：start（起始節點）
- 輸出：訪問順序的陣列

**不變量**：

- 每個節點最多被訪問一次
- 優先深入探索，而非廣度擴展

**核心思想**：使用 Stack（LIFO）或遞迴確保「後發現的先處理」

**迭代版本（使用 Stack）**：

```javascript
dfs(start) {
  const stack = [start];          // Stack：待處理的節點
  const visited = { [start]: true };
  const result = [];

  while (stack.length > 0) {
    // 取出 stack 最上面的節點（後進先出）
    const current = stack.pop();
    result.push(current);

    // 將所有未訪問的鄰居加入 stack
    for (const neighbor of this.adjacencyList[current]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        stack.push(neighbor);
      }
    }
  }

  return result;
}
```

**遞迴版本**：

```javascript
dfsRecursive(start) {
  const result = [];
  const visited = {};

  const dfsHelper = (vertex) => {
    if (!vertex) return;

    visited[vertex] = true;
    result.push(vertex);

    for (const neighbor of this.adjacencyList[vertex]) {
      if (!visited[neighbor]) {
        dfsHelper(neighbor);  // 遞迴深入
      }
    }
  };

  dfsHelper(start);
  return result;
}
```

**視覺化說明**：

```plaintext
Graph:          DFS from A (假設鄰居順序為 B, C, D):
    A
   /|\          探索路徑: A → B → E → (回溯) → C → (回溯) → D → F
  B C D
  |   |         訪問順序: A → B → E → C → D → F
  E   F         (實際順序取決於鄰居的儲存順序)
```

**時間複雜度**：O(V + E)

**空間複雜度**：O(V)

- 迭代版：Stack 最多存 V 個節點
- 遞迴版：Call stack 深度最多 V

---

### 核心操作複雜度總結

#### Adjacency List

| 操作         | 時間複雜度 | 空間複雜度 | 備註                 |
| ------------ | ---------- | ---------- | -------------------- |
| **節點操作** |            |            |                      |
| addVertex    | O(1)       | O(1)       | 新增一個空陣列       |
| removeVertex | O(V + E)   | O(1)       | 需移除所有相關邊     |
| **邊操作**   |            |            |                      |
| addEdge      | O(1)       | O(1)       | 直接 push            |
| removeEdge   | O(E)       | O(1)       | 需在鄰居列表中搜尋   |
| hasEdge      | O(degree)  | O(1)       | 需遍歷鄰居列表       |
| **遍歷**     |            |            |                      |
| BFS          | O(V + E)   | O(V)       | Queue + visited      |
| DFS          | O(V + E)   | O(V)       | Stack/遞迴 + visited |
| **查詢**     |            |            |                      |
| getNeighbors | O(1)       | O(1)       | 直接返回鄰居列表     |

#### Adjacency Matrix

| 操作         | 時間複雜度 | 空間複雜度 | 備註                         |
| ------------ | ---------- | ---------- | ---------------------------- |
| **節點操作** |            |            |                              |
| addVertex    | O(V²)      | O(V)       | 需重建整個矩陣               |
| removeVertex | O(V²)      | O(1)       | 需重建整個矩陣               |
| **邊操作**   |            |            |                              |
| addEdge      | O(1)       | O(1)       | 直接設定 matrix[i][j]        |
| removeEdge   | O(1)       | O(1)       | 直接設定 matrix[i][j] = 0    |
| hasEdge      | O(1)       | O(1)       | 直接查詢 matrix[i][j]        |
| **遍歷**     |            |            |                              |
| BFS          | O(V²)      | O(V)       | 需檢查每個節點的所有可能鄰居 |
| DFS          | O(V²)      | O(V)       | 同上                         |
| **查詢**     |            |            |                              |
| getNeighbors | O(V)       | O(V)       | 需掃描整行找出所有鄰居       |

**符號定義**：

- `V`：節點數量（Vertices）
- `E`：邊的數量（Edges）
- `degree`：節點的度數（連接的邊數）

**結構本身的空間複雜度**：

- Adjacency List：O(V + E)
- Adjacency Matrix：O(V²)

---

## ⭐ 抽象化翻譯器

### 識別核心抽象

> **Graph 的核心對象是：節點（Vertex）與邊（Edge）**
>
> **它管理的是這些對象之間的：連接關係與可達性**

Graph 問題的本質是：

1. **建模**：如何把問題轉換成 Graph
2. **探索**：如何在 Graph 上搜尋資訊
3. **分析**：如何利用 Graph 的結構特性

### 建立映射維度

當拿到一道新題目時，需要回答以下問題：

| 維度                 | 要回答的問題                   | 這個答案決定了什麼            |
| -------------------- | ------------------------------ | ----------------------------- |
| **維度 1：節點定義** | 問題中的「什麼」是節點？       | Graph 的規模、節點的 identity |
| **維度 2：邊的定義** | 什麼條件下兩個節點有邊？       | Graph 的稀疏/稠密程度         |
| **維度 3：方向性**   | 關係是單向還是雙向？           | 有向圖 vs 無向圖              |
| **維度 4：權重**     | 邊有成本/距離/容量嗎？         | 是否需要加權圖演算法          |
| **維度 5：目標**     | 要找什麼？路徑？連通性？最短？ | 選擇哪種 Graph 演算法         |

### 實戰檢查表

```plaintext
題目：_______________

維度 1 - 節點是什麼？_______________
  例：格子座標 (i, j)、字串狀態、數字

維度 2 - 何時有邊？_______________
  例：相鄰格子、一次操作可達、有相同字母

維度 3 - 有向/無向？_______________
  例：狀態轉移通常有向、好友關係通常無向

維度 4 - 有權重嗎？_______________
  例：距離、成本、機率

維度 5 - 目標是什麼？_______________
  □ 是否可達 → BFS/DFS
  □ 最短路徑（無權重）→ BFS
  □ 最短路徑（有權重）→ Dijkstra / Bellman-Ford
  □ 連通分量 → Union-Find / DFS
  □ 拓撲排序 → Kahn's / DFS
  □ 檢測環 → DFS 標記狀態
```

### 映射範例

#### 題目 A：200. Number of Islands

**題目**：給定一個 2D grid，'1' 代表陸地，'0' 代表水，計算島嶼數量。

| 維度   | 具體問題                 | 抽象映射                |
| ------ | ------------------------ | ----------------------- |
| 維度 1 | 每個格子 (i, j)          | 每個 '1' 格子是一個節點 |
| 維度 2 | 上下左右相鄰的 '1'       | 相鄰的陸地格子之間有邊  |
| 維度 3 | 相鄰關係是雙向的         | 無向圖                  |
| 維度 4 | 只需判斷連通，無距離概念 | 無權重                  |
| 維度 5 | 計算有幾個連通分量       | DFS/BFS 計算連通分量數  |

**從映射到實作**：

```javascript
// 不需要顯式建構 Graph
// Grid 本身就是隱式的 Adjacency List
// 鄰居 = 四個方向的相鄰格子

function numIslands(grid) {
  let count = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === "1") {
        count++;
        dfs(grid, i, j); // 標記整個連通分量
      }
    }
  }

  return count;
}

function dfs(grid, i, j) {
  // 邊界檢查 + 是否為陸地
  if (
    i < 0 ||
    i >= grid.length ||
    j < 0 ||
    j >= grid[0].length ||
    grid[i][j] !== "1"
  ) {
    return;
  }

  grid[i][j] = "0"; // 標記已訪問（原地修改）

  // 探索四個方向（鄰居）
  dfs(grid, i + 1, j);
  dfs(grid, i - 1, j);
  dfs(grid, i, j + 1);
  dfs(grid, i, j - 1);
}
```

---

#### 題目 B：133. Clone Graph

**題目**：給定無向圖的某個節點，返回該圖的深拷貝。

| 維度   | 具體問題           | 抽象映射                        |
| ------ | ------------------ | ------------------------------- |
| 維度 1 | Node 物件          | 每個 Node 是一個節點            |
| 維度 2 | neighbors 陣列     | 已經明確給出邊的關係            |
| 維度 3 | 無向圖             | 無向圖                          |
| 維度 4 | 無權重             | 無權重                          |
| 維度 5 | 遍歷所有節點並複製 | BFS/DFS 遍歷 + HashMap 記錄映射 |

**從映射到實作**：

```javascript
function cloneGraph(node) {
  if (!node) return null;

  // HashMap: 原節點 → 複製節點
  const visited = new Map();

  function dfs(original) {
    // 如果已經複製過，直接返回複製版本
    if (visited.has(original)) {
      return visited.get(original);
    }

    // 創建複製節點
    const clone = new Node(original.val);
    visited.set(original, clone);

    // 遞迴複製所有鄰居
    for (const neighbor of original.neighbors) {
      clone.neighbors.push(dfs(neighbor));
    }

    return clone;
  }

  return dfs(node);
}
```

---

## 🔍 觸發器（模式識別）

### 正向觸發器

| 層級         | 特徵                                         | 為什麼這個特徵指向 Graph          |
| ------------ | -------------------------------------------- | --------------------------------- |
| **關鍵字**   | 「連通」「可達」「路徑」「相鄰」「網絡」     | 這些詞彙直接描述 Graph 的核心概念 |
| **結構**     | 2D Grid、矩陣、多對多關係                    | 隱式的 Graph 結構                 |
| **目標**     | 「最短」「所有路徑」「是否存在」「幾個群組」 | 經典的 Graph 問題類型             |
| **操作模式** | 狀態轉移、從 A 到 B 的方法數                 | 狀態空間可以建模為 Graph          |

**一句話觸發規則**：**看到「從 X 到 Y」或「有幾組」，想 Graph + BFS/DFS**

### 反向觸發器

| 陷阱情境                             | 為什麼不適用            | 更好的選擇             |
| ------------------------------------ | ----------------------- | ---------------------- |
| 「求最短路徑」但有**負權重邊**       | Dijkstra 不適用         | Bellman-Ford           |
| 「連通性」但需要**動態增刪邊**       | 每次 DFS/BFS 太慢       | Union-Find             |
| 「最短路徑」但邊數量級 >> 節點數量級 | 可能是特殊結構          | 考慮是否有更直接的方法 |
| 看起來是 Graph 但只有**線性關係**    | 過度設計                | 簡單的陣列/Linked List |
| **樹形結構**的問題                   | Tree 有更強的性質可利用 | Tree-specific 演算法   |

### 與類似工具的決策點

```plaintext
「關係/連接」問題
├── 需要動態判斷連通性（頻繁 Union/Find）→ Union-Find
├── 需要遍歷所有節點/找路徑 → Graph + BFS/DFS
│   ├── 無權重最短路徑 → BFS
│   ├── 有權重最短路徑（非負）→ Dijkstra
│   ├── 有權重最短路徑（可負）→ Bellman-Ford
│   └── 有依賴關係的順序 → 拓撲排序
├── 層級結構 + 唯一父節點 → Tree
└── 只需要記錄關係（無需遍歷）→ HashMap/Set
```

```plaintext
BFS vs DFS 選擇
├── 求「最短」（無權重）→ BFS ✓
├── 求「所有路徑」→ DFS + 回溯 ✓
├── 判斷「是否可達」→ 兩者皆可
├── 「層級遍歷」→ BFS ✓
├── 「拓撲排序」→ 兩者皆可（DFS 較常見）
└── 「檢測環」→ DFS + 狀態標記 ✓
```

---

## ⚠️ 注意事項

### 常見陷阱

| 陷阱                     | 錯誤寫法                   | 正確寫法                 | 為什麼                   |
| ------------------------ | -------------------------- | ------------------------ | ------------------------ |
| **忘記標記 visited**     | 直接遞迴所有鄰居           | 進入前先標記 visited     | 會無限循環（Graph 有環） |
| **visited 標記時機錯誤** | pop/shift 後才標記         | push/加入 queue 時就標記 | 同一節點會被加入多次     |
| **混淆有向/無向**        | 無向圖只加單向邊           | 無向圖要加雙向邊         | 會漏掉一半的連接         |
| **Grid 邊界檢查**        | 先存取再檢查               | 先檢查再存取             | Array out of bounds      |
| **修改原圖導致問題**     | 原地修改 Grid 作為 visited | 使用額外空間或復原       | 可能影響後續遍歷         |

```javascript
// ❌ 錯誤：pop 後才標記
while (queue.length) {
  const node = queue.shift();
  if (visited[node]) continue; // 太晚了！可能已經重複加入
  visited[node] = true;
  // ...
}

// ✅ 正確：加入時就標記
visited[start] = true;
queue.push(start);
while (queue.length) {
  const node = queue.shift();
  for (const neighbor of adj[node]) {
    if (!visited[neighbor]) {
      visited[neighbor] = true; // 加入前就標記
      queue.push(neighbor);
    }
  }
}
```

### 常見變體

| 變體           | 修改內容                                 | 適用場景                   |
| -------------- | ---------------------------------------- | -------------------------- |
| **加權圖**     | 邊儲存 (neighbor, weight) tuple          | 最短路徑問題               |
| **多源 BFS**   | 初始 queue 放入多個起點                  | 01-Matrix、Rotting Oranges |
| **雙向 BFS**   | 從起點和終點同時搜尋                     | 優化單一目標的最短路徑     |
| **DFS + 狀態** | visited 有三種狀態（未訪問/進行中/完成） | 環檢測、拓撲排序           |
| **隱式 Graph** | 不顯式建構，邊由規則產生                 | Grid、狀態轉移             |
