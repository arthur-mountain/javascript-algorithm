# Priority Queue

## 🎯 設計理念

### 存在意義

**這個工具被發明出來，是為了解決什麼類型的問題？**

**痛點**：在許多應用場景中，我們需要「總是處理最重要/最緊急的項目」，但傳統資料結構無法高效支援：

- **未排序 Array/List**：找最大/最小需要 O(n) 線性掃描
- **已排序 Array/List**：雖然取極值是 O(1)，但每次插入需要 O(n) 來維持排序
- **BST**：可以 O(log n) 插入和找極值，但實作複雜且需要平衡維護

**價值主張**：以 O(log n) 時間同時支援「插入任意元素」與「取出最高優先級元素」，且實作簡單、記憶體連續。

**一句話本質**：Priority Queue 是一個「永遠讓你以 O(log n) 時間拿到當前最重要項目」的抽象資料結構。

### 層次釐清：Priority Queue vs Heap

這是一個**關鍵概念區分**，面試時經常被問到：

| 概念               | 層次               | 定義                                                  | 類比                      |
| ------------------ | ------------------ | ----------------------------------------------------- | ------------------------- |
| **Priority Queue** | 抽象資料型別 (ADT) | 定義「行為」：insert、extractMax/Min、peek            | 介面 (Interface)          |
| **Heap**           | 具體資料結構       | 定義「實作」：用 Complete Binary Tree + Heap Property | 實作類別 (Implementation) |

```plaintext
Priority Queue (ADT)
        │
        │ 可用多種方式實作
        ▼
┌───────────────────────────────────────────┐
│  Binary Heap  │  Fibonacci Heap  │  BST  │  Sorted Array  │
│   (最常用)    │    (理論最優)    │       │    (簡單)      │
└───────────────────────────────────────────┘
```

**面試重點**：當面試官說「用 Priority Queue」，他期待你用 Heap 實作；當他問「Priority Queue 和 Heap 的差別」，你要能解釋 ADT vs 資料結構的關係。

### 心智模型

**類比：醫院急診室的候診系統**

想像你是急診室的分診護士：

- **enqueue(patient, severity)**：新病人到達，根據病情嚴重度安排優先級
- **peek()**：查看下一個應該看診的病人（最嚴重的）
- **dequeue()**：呼叫下一位病人進診間（移除最嚴重的）

關鍵特性：

1. **不是先來先服務**：心臟病發的人比感冒的人優先，即使感冒的人先到
2. **隨時可插入**：新病人隨時可能到達
3. **總是取最緊急**：每次呼叫病人，都是當前最緊急的那位

```plaintext
候診區狀態（用 Min Heap，數字越小越緊急）：

        [1] ← 心臟病（最緊急，一定在 root）
       /   \
     [3]   [2]
    /   \
  [5]   [4]

新病人骨折(2)到達 → enqueue(骨折, 2)
呼叫下一位 → dequeue() → 回傳心臟病患者
```

**類比的局限性**：

- 真實醫院可能會「更新」病人的優先級（病情惡化）→ 標準 Priority Queue 不直接支援 decrease-key
- 真實醫院同優先級會考慮等待時間 → 需要額外處理 tie-breaking

---

## 🏗️ 抽象結構

### 核心組件

| 組件                      | 功能                                    | 為什麼需要                         |
| ------------------------- | --------------------------------------- | ---------------------------------- |
| **底層 Heap**             | 儲存元素並維持優先級順序                | Heap Property 保證 root 永遠是極值 |
| **比較函數 (Comparator)** | 定義元素間的優先級關係                  | 允許自訂「什麼叫做更優先」         |
| **元素包裝 (可選)**       | 將 (value, priority) 包裝成可比較的單位 | 當元素本身不可直接比較時需要       |

### 狀態表示

**底層資料結構**：Binary Heap（用陣列實作的 Complete Binary Tree）

**初始狀態**：空陣列 `[]`，或從現有陣列 heapify 建構

**關鍵狀態的定義規則**：

- **Max Priority Queue**：使用 Max Heap，root 是最大值
- **Min Priority Queue**：使用 Min Heap，root 是最小值
- **自訂優先級**：透過 comparator 函數定義

### 核心操作

#### 1. **enqueue(element)** / **push(element)** / **insert(element)**

**目的**：將新元素加入佇列，並放置在正確的優先級位置
**輸入/輸出**：

- 輸入：要加入的元素（或 `{value, priority}` 物件）
- 輸出：無（或回傳新的 size）

**不變量**：操作後 Heap Property 仍然成立

**基礎實作**：

```javascript
enqueue(element) {
  // 直接委託給底層 Heap 的 insert 操作
  this.heap.insert(element);
}
```

**複雜度分析**：

- 時間：O(log n) — 元素加到末端後，bubble up 最多走 log n 層
- 空間：O(1) — 只需要一個位置存新元素

---

#### 2. **dequeue()** / **poll()** / **extractMax()** / **extractMin()**

**目的**：移除並回傳優先級最高的元素

**輸入/輸出**：

- 輸入：無
- 輸出：優先級最高的元素（若佇列為空則回傳 undefined 或拋出錯誤）

**不變量**：操作後 Heap Property 仍然成立

**基礎實作**：

```javascript
dequeue() {
  // 直接委託給底層 Heap 的 extract 操作
  return this.heap.extract();
}
```

**複雜度分析**：

- 時間：O(log n) — 取出 root 後，用最後元素填補，bubble down 最多走 log n 層
- 空間：O(1)

---

#### 3. **peek()** / **top()** / **front()**

**目的**：查看（但不移除）優先級最高的元素

**輸入/輸出**：

- 輸入：無
- 輸出：優先級最高的元素

**不變量**：Heap 狀態完全不變

**基礎實作**：

```javascript
peek() {
  return this.heap.peek();
}
```

**複雜度分析**：

- 時間：O(1) — 直接回傳 root
- 空間：O(1)

---

#### 4. **size()** / **isEmpty()**

**目的**：查詢佇列狀態

**基礎實作**：

```javascript
size() {
  return this.heap.size();
}

isEmpty() {
  return this.heap.size() === 0;
}
```

**複雜度**：O(1)

---

### 核心操作複雜度總結

| 操作             | 時間複雜度   | 空間複雜度 | 備註                        |
| ---------------- | ------------ | ---------- | --------------------------- |
| **插入**         |              |            |                             |
| enqueue(element) | **O(log n)** | O(1)       | bubble up 最多 log n 層     |
| **取出**         |              |            |                             |
| dequeue()        | **O(log n)** | O(1)       | bubble down 最多 log n 層   |
| **查看**         |              |            |                             |
| peek()           | **O(1)**     | O(1)       | 直接存取 root               |
| **狀態查詢**     |              |            |                             |
| size()           | O(1)         | O(1)       | 維護 size 變數              |
| isEmpty()        | O(1)         | O(1)       | 檢查 size === 0             |
| **批量建構**     |              |            |                             |
| heapify(array)   | **O(n)**     | O(1)       | Floyd 演算法，非 O(n log n) |

**符號定義**：

- `n`：Priority Queue 中的元素數量

**結構本身的空間複雜度**：O(n)

---

### 為什麼 heapify 是 O(n) 而非 O(n log n)？

這是一個**經典面試題**，很多人直覺認為「n 個元素各做 log n 的 bubble down = O(n log n)」，但這是錯的。

**直覺解釋**：

- 葉節點（約 n/2 個）：不需要 bubble down（沒有子節點）
- 倒數第二層（約 n/4 個）：最多 bubble down 1 層
- 倒數第三層（約 n/8 個）：最多 bubble down 2 層
- ...
- root（1 個）：最多 bubble down log n 層

**數學證明**：

```
總工作量 = Σ(每層節點數 × 該層最大下沉距離)
        = n/4 × 1 + n/8 × 2 + n/16 × 3 + ...
        = n × Σ(k/2^(k+1)) for k = 1 to log n
        = n × (收斂到常數 ≈ 2)
        = O(n)
```

**記憶口訣**：「大部分節點在底層，但底層幾乎不用動」

---

## ⭐ 抽象化翻譯器

### 識別核心抽象

> **這個工具的核心對象是**：帶有「優先級」屬性的元素
>
> **它管理的是這些對象之間的什麼關係**：優先級的相對順序，保證隨時能 O(log n) 取得當前最高/最低優先級的元素

### 建立映射維度

當你拿到一道新題目，需要回答以下四個問題來判斷是否適用 Priority Queue：

| 維度                 | 要回答的問題                               | 這個答案決定了什麼                     |
| -------------------- | ------------------------------------------ | -------------------------------------- |
| **維度 1：元素**     | 什麼東西需要被「排序處理」？               | Priority Queue 儲存的元素類型          |
| **維度 2：優先級**   | 「優先級」如何定義？數字大優先還是小優先？ | Max Heap vs Min Heap / Comparator 設計 |
| **維度 3：操作模式** | 何時插入？何時取出？取出後要做什麼？       | 主迴圈的結構                           |
| **維度 4：終止條件** | 什麼時候停止處理？                         | while 迴圈的條件                       |

### 實戰檢查表

```plaintext
題目：_______________

維度 1（元素）：什麼需要被排序處理？_______________
維度 2（優先級）：優先級如何定義？_______________
維度 3（操作模式）：插入/取出的時機？_______________
維度 4（終止條件）：何時停止？_______________

填完後，核心邏輯應該能直接寫出。
```

### 映射範例

#### 題目 A：Merge K Sorted Lists（LeetCode 23）

**題意**：給定 k 個已排序的 linked list，將它們合併成一個已排序的 linked list。

| 維度   | 具體問題                                                          | 抽象映射                                        |
| ------ | ----------------------------------------------------------------- | ----------------------------------------------- |
| 維度 1 | 每個 linked list 的當前節點                                       | 儲存 ListNode                                   |
| 維度 2 | 節點的值越小越優先                                                | Min Heap，comparator: `(a, b) => a.val - b.val` |
| 維度 3 | 初始放入 k 個 list 的 head；每次取出最小的，若有 next 則放入 next | 標準的 k-way merge 模式                         |
| 維度 4 | Priority Queue 為空時停止                                         | `while (!pq.isEmpty())`                         |

**從映射到實作的關鍵步驟**：

```javascript
function mergeKLists(lists) {
  const pq = new MinPriorityQueue((a, b) => a.val - b.val);

  // 初始化：每個 list 的 head 放入 PQ
  for (const head of lists) {
    if (head) pq.enqueue(head);
  }

  const dummy = new ListNode(0);
  let current = dummy;

  // 操作模式：取出最小，連接，若有 next 則放入
  while (!pq.isEmpty()) {
    const node = pq.dequeue();
    current.next = node;
    current = current.next;
    if (node.next) pq.enqueue(node.next);
  }

  return dummy.next;
}
```

---

#### 題目 B：Top K Frequent Elements（LeetCode 347）

**題意**：給定整數陣列，回傳出現頻率最高的 k 個元素。

| 維度   | 具體問題                                  | 抽象映射                                     |
| ------ | ----------------------------------------- | -------------------------------------------- |
| 維度 1 | (元素, 頻率) 對                           | 儲存 `{num, freq}` 或直接用 freq 作為 key    |
| 維度 2 | 頻率越高越優先？還是越低越優先？          | **陷阱！** 用 Min Heap 維護 k 個最大的更高效 |
| 維度 3 | 掃描頻率表，維護 size = k 的 heap         | 當 size > k 時，踢掉最小的                   |
| 維度 4 | 處理完所有 unique 元素後，heap 中即為答案 | `for (const [num, freq] of freqMap)`         |

**為什麼用 Min Heap 而非 Max Heap？**

```plaintext
目標：找 Top K 大

方法 A：Max Heap
- 全部放入 Max Heap：O(n log n)
- 取出 k 次：O(k log n)
- 總計：O(n log n)
- 空間：O(n)

方法 B：Min Heap（維護 k 個）
- 維護 size = k 的 Min Heap
- 每個元素：若 size < k，直接放入；否則與 min 比較
- 總計：O(n log k)
- 空間：O(k)

當 k << n 時，方法 B 顯著更優
```

**從映射到實作的關鍵步驟**：

```javascript
function topKFrequent(nums, k) {
  // 建立頻率表
  const freqMap = new Map();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // Min Heap 維護 k 個最大頻率的元素
  const pq = new MinPriorityQueue((a, b) => a.freq - b.freq);

  for (const [num, freq] of freqMap) {
    pq.enqueue({ num, freq });
    if (pq.size() > k) {
      pq.dequeue(); // 踢掉頻率最小的
    }
  }

  // heap 中剩下的就是 top k
  return [...pq].map((item) => item.num);
}
```

---

## 🔍 觸發器（模式識別）

### 正向觸發器

看到什麼特徵應該想到 Priority Queue？

| 層級         | 特徵                                          | 為什麼指向 Priority Queue  |
| ------------ | --------------------------------------------- | -------------------------- |
| **關鍵字**   | "k largest/smallest", "top k", "k-th element" | 需要維護動態的極值集合     |
| **關鍵字**   | "merge k sorted", "k-way merge"               | 需要重複從 k 個來源取最小  |
| **關鍵字**   | "schedule", "meeting rooms", "intervals"      | 需要追蹤「目前最早結束的」 |
| **結構**     | 多個已排序的資料來源需要合併                  | k-way merge 經典場景       |
| **結構**     | 需要頻繁取極值並動態新增元素                  | 這就是 PQ 的核心功能       |
| **目標**     | 「第 k 大/小」或「前 k 個」                   | 維護 size=k 的 heap        |
| **操作模式** | Dijkstra、Prim 等「每次處理最小成本」的貪心   | 這些演算法就是建立在 PQ 上 |

**一句話觸發規則**：

> 「需要重複取極值 + 動態增刪元素」→ 想到 Priority Queue

### 反向觸發器

什麼情況下「看起來適用但其實不是」？

| 陷阱情境                      | 為什麼不適用                        | 更好的選擇                               |
| ----------------------------- | ----------------------------------- | ---------------------------------------- |
| 只需要一次性找極值            | O(n) 線性掃描更簡單                 | 單次遍歷取 max/min                       |
| 資料完全靜態，多次查詢第 k 大 | 建 heap 後還是要 O(k log n) 取 k 次 | QuickSelect O(n) 或排序後直接索引        |
| 需要「任意位置刪除」          | 標準 heap 只能刪 root               | 用 Hash + Heap 或 TreeMap                |
| 需要「更新任意元素的優先級」  | 標準 heap 無法快速定位元素          | Indexed Priority Queue 或 Fibonacci Heap |
| 資料量很小（n < 100）         | heap 的常數因子反而較大             | 直接排序或線性掃描                       |

### 與類似工具的決策點

```plaintext
「找第 k 大/前 k 個」問題
├── 只需要一次性答案，資料靜態
│   └── QuickSelect O(n) 平均
├── 需要多次查詢，資料靜態
│   └── 先排序 O(n log n)，之後 O(1) 查詢
├── 資料動態變化（持續有新元素加入）
│   └── **Priority Queue O(log n) per operation**
└── 需要支援「刪除任意元素」
    └── TreeMap / Balanced BST
```

```plaintext
「合併多個已排序來源」問題
├── 只有 2 個來源
│   └── 雙指標 O(n + m)，不需要 heap
├── k 個來源，k 較小（k < 20）
│   └── **Priority Queue O(n log k)**
└── k 個來源，k 很大或等於 n
    └── 考慮分治合併或其他方法
```

```plaintext
「圖的最短路徑」問題
├── 無權圖
│   └── BFS with Queue
├── 正權圖
│   └── **Dijkstra with Priority Queue**
├── 有負權邊
│   └── Bellman-Ford（不用 PQ）
└── 所有點對最短路徑
    └── Floyd-Warshall
```

---

## ⚠️ 注意事項

### 常見陷阱

| 陷阱                | 錯誤寫法                   | 正確寫法                          | 為什麼                                      |
| ------------------- | -------------------------- | --------------------------------- | ------------------------------------------- |
| Max vs Min 搞混     | 要找 Top K 大，用 Max Heap | 用 **Min Heap** 維護 k 個         | Max Heap 需要 O(n) 空間，Min Heap 只需 O(k) |
| 忘記處理空 heap     | `pq.dequeue()` 直接呼叫    | `if (!pq.isEmpty()) pq.dequeue()` | 空 heap 取值會出錯                          |
| Comparator 方向錯誤 | `(a, b) => a - b` 想要 Max | `(a, b) => b - a` 才是 Max        | 正數表示 a 應該排在 b 後面                  |
| 放入 null/undefined | `pq.enqueue(node)` 不檢查  | `if (node) pq.enqueue(node)`      | 會破壞 heap 的比較邏輯                      |
| 誤以為可以索引存取  | `pq[k]` 想取第 k 大        | 必須 dequeue k 次                 | Heap 只保證 root 是極值，其他無序           |

### 常見變體

| 變體                       | 修改內容                                        | 適用場景                                 |
| -------------------------- | ----------------------------------------------- | ---------------------------------------- |
| **Indexed Priority Queue** | 維護 element → index 的映射，支援 decreaseKey   | Dijkstra 優化、動態優先級更新            |
| **Double-ended PQ**        | 同時支援取最大和最小                            | 需要兩端操作的場景                       |
| **Lazy Deletion PQ**       | 不真的刪除，標記為 deleted，取出時才檢查        | 當「刪除任意元素」但不需要 indexed PQ 時 |
| **Median Finder**          | 兩個 heap：Max Heap 存較小半，Min Heap 存較大半 | 動態維護中位數（LeetCode 295）           |

### Comparator 設計指南

```javascript
// Min Priority Queue（數字越小優先）
const minPQ = new PriorityQueue((a, b) => a - b);

// Max Priority Queue（數字越大優先）
const maxPQ = new PriorityQueue((a, b) => b - a);

// 物件比較：按 priority 欄位（Min）
const objMinPQ = new PriorityQueue((a, b) => a.priority - b.priority);

// 多重排序：先按 priority，同 priority 按 timestamp（Min）
const multiPQ = new PriorityQueue((a, b) => {
  if (a.priority !== b.priority) return a.priority - b.priority;
  return a.timestamp - b.timestamp;
});
```

---

## 📊 與其他資料結構的比較

| 操作           | Unsorted Array | Sorted Array | BST (平衡) | Binary Heap  |
| -------------- | -------------- | ------------ | ---------- | ------------ |
| insert         | O(1)           | O(n)         | O(log n)   | **O(log n)** |
| extractMax/Min | O(n)           | O(1)\*       | O(log n)   | **O(log n)** |
| peek           | O(n)           | O(1)         | O(log n)   | **O(1)**     |
| search         | O(n)           | O(log n)     | O(log n)   | O(n)         |
| 空間           | O(n)           | O(n)         | O(n)       | O(n)         |
| 實作複雜度     | 簡單           | 簡單         | 複雜       | **中等**     |
| 記憶體連續性   | 是             | 是           | 否         | **是**       |

\*Sorted Array 的 extractMax 是 O(1)，但 extractMin 需要移動所有元素是 O(n)，或反過來。

**結論**：當只需要「極值操作」而不需要「搜尋」或「有序遍歷」時，Binary Heap 實作的 Priority Queue 是最佳選擇。

---

## 🎯 經典面試題型

### 第一類：K 相關問題

| 題目                                 | 難度   | 關鍵技巧                         |
| ------------------------------------ | ------ | -------------------------------- |
| 215. Kth Largest Element             | Medium | Min Heap 維護 k 個 / QuickSelect |
| 347. Top K Frequent Elements         | Medium | 頻率表 + Min Heap                |
| 692. Top K Frequent Words            | Medium | 頻率表 + 自訂 comparator         |
| 373. Find K Pairs with Smallest Sums | Medium | 類似 merge k sorted              |
| 378. Kth Smallest in Sorted Matrix   | Medium | Min Heap / Binary Search         |

### 第二類：Merge 相關問題

| 題目                                 | 難度 | 關鍵技巧                |
| ------------------------------------ | ---- | ----------------------- |
| 23. Merge K Sorted Lists             | Hard | k-way merge 標準模板    |
| 632. Smallest Range Covering K Lists | Hard | 維護 k 個來源的當前位置 |

### 第三類：區間/排程問題

| 題目                           | 難度   | 關鍵技巧             |
| ------------------------------ | ------ | -------------------- |
| 253. Meeting Rooms II          | Medium | 追蹤「最早結束時間」 |
| 1353. Maximum Number of Events | Medium | 貪心 + Min Heap      |
| 621. Task Scheduler            | Medium | Max Heap + 冷卻追蹤  |

### 第四類：圖演算法應用

| 題目                                 | 難度   | 關鍵技巧             |
| ------------------------------------ | ------ | -------------------- |
| 743. Network Delay Time              | Medium | Dijkstra             |
| 787. Cheapest Flights Within K Stops | Medium | Dijkstra 變體        |
| 1514. Path with Maximum Probability  | Medium | Dijkstra（Max 版本） |

### 第五類：動態中位數/統計

| 題目                              | 難度 | 關鍵技巧                |
| --------------------------------- | ---- | ----------------------- |
| 295. Find Median from Data Stream | Hard | 雙 Heap：Max + Min      |
| 480. Sliding Window Median        | Hard | 雙 Heap + Lazy Deletion |
