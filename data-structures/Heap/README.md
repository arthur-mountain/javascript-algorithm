# Heap 資料結構完整指南

> 一個高效率的優先佇列實現，支援 O(1) 取得極值、O(log n) 插入與刪除

## 📚 目錄

1. [核心概念](#核心概念)
2. [為什麼需要 Heap](#為什麼需要-heap)
3. [深層理解：六大核心要點](#深層理解六大核心要點)
4. [Heap vs 其他資料結構](#heap-vs-其他資料結構)
5. [實作細節](#實作細節)
6. [常見應用場景](#常見應用場景)
7. [時間複雜度總結](#時間複雜度總結)
8. [常見陷阱與誤解](#常見陷阱與誤解)
9. [進階主題](#進階主題)

## 核心概念

### 什麼是 Heap？

Heap 是一種**特殊的完全二元樹**，滿足以下性質：

- **Max Heap**：每個父節點的值 **≥** 其所有子節點的值 (根節點是最大值)
- **Min Heap**：每個父節點的值 **≤** 其所有子節點的值 (根節點是最小值)

### 視覺化理解

```
Max Heap 範例：              Min Heap 範例：
      50                         1
     /  \                       / \
   30    40                    3   2
   / \   / \                  / \ / \
  10 20 15 25                8  7 9  3
```

**關鍵洞察**：

- Heap **不是完全排序**的，只保證父子關係
- 左右子節點之間**沒有大小關係要求** (這與 BST 不同！)
- 這種「部分有序」的設計讓操作更高效

## 為什麼需要 Heap？

### 問題場景

當你需要：

1. **頻繁取得最大/最小值** (如優先佇列)
2. **動態維護前 K 大/小元素**
3. **實現高效的排序** (Heap Sort)

### Heap 的優勢

| 操作       | Heap     | 排序陣列 | 未排序陣列 |
| ---------- | -------- | -------- | ---------- |
| 取得極值   | O(1)     | O(1)     | O(n)       |
| 插入元素   | O(log n) | O(n)     | O(1)       |
| 刪除極值   | O(log n) | O(n)     | O(n)       |
| 空間複雜度 | O(1)     | O(1)     | O(1)       |

## 深層理解：六大核心要點

### 🔑 要點 1：陣列儲存結構的巧妙設計

**關鍵理解**：Heap 用陣列儲存，但邏輯上是樹

```
陣列: [50, 30, 40, 10, 20, 15, 25]
索引:   0   1   2   3   4   5   6

樹狀結構：
      50 (0)
     /  \
   30(1) 40(2)
   / \   / \
 10  20 15 25
 (3) (4)(5)(6)
```

**為什麼選擇陣列？**

- **空間效率高**：完全二元樹的陣列利用率 50%-100% (平均 75%)
- **快取友善**：連續記憶體存取，CPU 快取命中率高
- **無需指標**：節省每個節點 16 bytes (64位系統中兩個指標)

**四個必背公式** (基於索引 i)：

```javascript
父節點索引：Math.floor((i - 1) / 2)

左子節點索引：2 * i + 1

右子節點索引：2 * i + 2

最後一個父節點索引：Math.floor(n / 2) - 1
```

### 🔑 要點 2：子樹必須都是 Heap (Divide and Conquer)

**核心原則**：整棵樹是 Heap **且** 所有子樹也都是 Heap

這是 Divide and Conquer 思想的體現：

1. **Divide**：將樹分解為小子樹
2. **Conquer**：確保每個子樹都滿足 Heap 性質
3. **Combine**：當所有子樹都正確時，整體自然正確

**為什麼這很重要？**

- Heapify 的三方比較才有意義 (比較的是三個「區域最大值」)
- 確保 O(log n) 的時間複雜度
- 避免遺漏其他分支的更大值

**實際例子**：

```
正確的 Max Heap：        錯誤的結構：
     50                    50
    /  \                  /  \
   30  40                30  40
  / \  / \              / \  / \
 10 20 15 25          45 20 15 25  ← 45 > 30，違反性質！
```

### 🔑 要點 3：取值操作 (Extract) 的精妙設計

**操作流程** (以 Max Heap 為例)：

1. **取出根節點** (最大值)- O(1)
2. **用最後一個元素替換根節點** - O(1)
3. **Heapify Down** - O(log n)

**為什麼用最後一個元素？**

- 不破壞完全二元樹的形狀
- 不影響「所有子樹都是 Heap」的性質
- 陣列操作高效 (pop 最後一個元素是 O(1))

```javascript
extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const max = this.heap[0];              // 取出最大值
    this.heap[0] = this.heap.pop();        // 最後元素移到根部
    this.heapifyDown();                    // 向下調整
    return max;
}
```

### 🔑 要點 4：插入操作 (Insert) 的對稱設計

**操作流程**：

1. **在陣列末尾添加新元素** - O(1)
2. **Heapify Up (向上冒泡)** - O(log n)

**為什麼從末尾插入？**

- 保持完全二元樹的形狀 (從左到右填滿)
- 陣列操作高效 (push 是 O(1))
- 與 Extract 操作形成優雅對稱

```javascript
insert(value) {
    this.heap.push(value);      // 放在最後
    this.heapifyUp();           // 向上調整
}
```

**插入與取值的對稱性**：

- Insert：**先放置，後向上調整**
- Extract：**先移除，後向下調整**

### 🔑 要點 5：Heapify 的單路徑調整策略

**Heapify Down 的核心邏輯**：

```javascript
heapifyDown(index = 0) {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let largest = index;

    // 三方比較：當前節點 vs 左子 vs 右子
    if (leftChild < size && heap[leftChild] > heap[largest]) {
        largest = leftChild;
    }
    if (rightChild < size && heap[rightChild] > heap[largest]) {
        largest = rightChild;
    }

    // 如果需要調整，繼續向下
    if (largest !== index) {
        swap(index, largest);
        heapifyDown(largest);  // 遞歸處理
    }
}
```

**為什麼只調整一條路徑？**

- 基於前提：除了當前節點，其他子樹都已經正確 heap
- 只需修復當前節點造成的局部違規
- 時間複雜度：O(樹高) = O(log n)

**常見誤解**：

❌ 認為需要找到整個 Heap 的第二大值

✅ 實際只需找到當前子樹的局部最大值，因為處理步驟如下：

1. 三方比較（實際上是比較三個區域最大值）
2. 找出真正的最大值
3. 如果需要交換，只有被交換的路徑可能出現新違規
4. 遞歸處理該路徑
5. 其他路徑保持不變

### 🔑 要點 6：Heap Sort 的「從後往前」策略

**為什麼從後往前遍歷？**

Max Heap 提供的是最大值，我們要建立遞增序列：

- 第1次取出：全體最大值 → 放在索引 n-1 (最後)
- 第2次取出：次大值 → 放在索引 n-2
- 第k次取出：第k大 → 放在索引 n-k

**陣列的雙重身份**：

```
初始：[Heap 佔用整個陣列                    ]
第1步：[Heap 縮小        ][已排序: 1 個元素]
第2步：[Heap 更小    ][已排序: 2 個元素    ]
...
最終：[            已排序: 全部元素         ]
```

**完整實現**：

```javascript
function heapSort(arr) {
  // 階段1：Build Max Heap - O(n)
  buildMaxHeap(arr);

  // 階段2：逐一提取最大值 - O(n log n)
  for (let i = arr.length - 1; i > 0; i--) {
    swap(arr, 0, i); // 最大值移到位置 i
    heapify(arr, 0, i); // 重新調整 (範圍縮小為 i)
  }
}
```

**為什麼迴圈條件是 `i > 0`？**

- 當 i = 0 時，只剩一個元素，已在正確位置
- 避免不必要的操作

## Heap vs 其他資料結構

### Heap vs Binary Search Tree (BST)

| 特性           | Heap             | BST             |
| -------------- | ---------------- | --------------- |
| **主要用途**   | 找極值、優先佇列 | 搜尋、範圍查詢  |
| **排序性質**   | 部分有序 (垂直)  | 全域有序 (水平) |
| **左右子節點** | 無大小關係       | 左 < 根 < 右    |
| **取極值**     | O(1)             | O(log n)        |
| **插入**       | O(log n)         | O(log n)        |
| **搜尋任意值** | O(n)             | O(log n)        |
| **陣列實現**   | 完美適配         | 不適合          |

**何時選擇 Heap？**

- 只需要頻繁獲取最大/最小值
- 不需要搜尋任意元素
- 需要原地排序 (空間受限)

### Heap vs 排序陣列

**動態場景對比**：

```javascript
// 情境：維護前 K 大元素，持續有新數據進入

// 方法1：排序陣列 (低效)
function updateTopK_Sorted(arr, newElement) {
  arr.push(newElement);
  arr.sort(); // O(n log n) - 太慢！
  return arr.slice(-k);
}

// 方法2：Min Heap (高效)
function updateTopK_Heap(heap, newElement) {
  if (heap.size() < k) {
    heap.insert(newElement); // O(log k)
  } else if (newElement > heap.peek()) {
    heap.extractMin(); // O(log k)
    heap.insert(newElement); // O(log k)
  }
  return heap;
}
```

## 實作細節

### 建立 Heap 的兩種方式

#### 方法1：逐一插入 (O(n log n))

```javascript
function buildHeapByInsertion(arr) {
  const heap = new MaxHeap();
  for (let num of arr) {
    heap.insert(num); // 每次 O(log n)
  }
  return heap;
}
```

#### 方法2：Heapify (O(n) - 更優！)

```javascript
function buildMaxHeap(arr) {
  const n = arr.length;
  // 從最後一個父節點開始，向前調整
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapifyDown(arr, i, n);
  }
}
```

**為什麼方法2更快？**

- 底層節點多但調整距離短
- 頂層節點少但調整距離長
- 數學分析：總代價 = O(n)

**數學證明簡要**：

```
層數 | 節點數量 | 最大調整高度 | 代價
--|----------|--------------|------
h    | 1        | h            | h
h-1  | 2        | h-1          | 2(h-1)
h-2  | 4        | h-2          | 4(h-2)
...
總代價 = Σ(2^i * (h-i)) = O(n)
```

## 常見應用場景

### 1. 優先佇列 (Priority Queue)

```javascript
class PriorityQueue {
  constructor() {
    this.heap = new MaxHeap(); // 或 MinHeap
  }

  enqueue(item, priority) {
    this.heap.insert({ item, priority });
  }

  dequeue() {
    return this.heap.extractMax().item;
  }
}

// 應用：作業系統的程序調度
```

### 2. 找第 K 大元素

```javascript
function findKthLargest(nums, k) {
  const minHeap = new MinHeap();

  for (let num of nums) {
    minHeap.insert(num);
    if (minHeap.size() > k) {
      minHeap.extractMin(); // 保持 heap 大小為 k
    }
  }

  return minHeap.peek(); // Heap 頂部就是第 K 大
}

// 時間：O(n log k)，空間：O(k)
```

### 3. 合併 K 個排序陣列

```javascript
function mergeKSortedArrays(arrays) {
  const minHeap = new MinHeap();
  const result = [];

  // 初始化：每個陣列的第一個元素入 heap
  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i].length > 0) {
      minHeap.insert({
        value: arrays[i][0],
        arrayIndex: i,
        elementIndex: 0,
      });
    }
  }

  while (!minHeap.isEmpty()) {
    const { value, arrayIndex, elementIndex } = minHeap.extractMin();
    result.push(value);

    // 如果該陣列還有元素，放入下一個
    if (elementIndex + 1 < arrays[arrayIndex].length) {
      minHeap.insert({
        value: arrays[arrayIndex][elementIndex + 1],
        arrayIndex,
        elementIndex: elementIndex + 1,
      });
    }
  }

  return result;
}
```

### 4. 數據流中的中位數

```javascript
class MedianFinder {
  constructor() {
    this.maxHeap = new MaxHeap(); // 存較小的一半
    this.minHeap = new MinHeap(); // 存較大的一半
  }

  addNum(num) {
    // 策略：保持 maxHeap.size() >= minHeap.size()
    if (this.maxHeap.isEmpty() || num <= this.maxHeap.peek()) {
      this.maxHeap.insert(num);
    } else {
      this.minHeap.insert(num);
    }

    // 平衡兩個 heap
    if (this.maxHeap.size() > this.minHeap.size() + 1) {
      this.minHeap.insert(this.maxHeap.extractMax());
    } else if (this.minHeap.size() > this.maxHeap.size()) {
      this.maxHeap.insert(this.minHeap.extractMin());
    }
  }

  findMedian() {
    if (this.maxHeap.size() > this.minHeap.size()) {
      return this.maxHeap.peek();
    }
    return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
  }
}
```

## 時間複雜度總結

| 操作           | 時間複雜度 | 說明                   |
| -------------- | ---------- | ---------------------- |
| **peek()**     | O(1)       | 直接返回 heap[0]       |
| **insert()**   | O(log n)   | HeapifyUp 沿一條路徑   |
| **extract()**  | O(log n)   | HeapifyDown 沿一條路徑 |
| **build heap** | O(n)       | 由下而上調整           |
| **heap sort**  | O(n log n) | Build + n 次 Extract   |
| **search()**   | O(n)       | 無序，需遍歷           |

**空間複雜度**：O(1) (原地操作，不計遞歸棧)

## 常見陷阱與誤解

### ❌ 誤解1：Heap 是完全排序的

**錯誤想法**：

```
Max Heap: [50, 40, 30, 20, 10]  // 完全遞減
```

**實際情況**：

```
Max Heap: [50, 30, 40, 10, 20]  // 只保證父 > 子
```

### ❌ 誤解2：左子節點一定小於右子節點

**在 BST 中**：左 < 根 < 右  
**在 Heap 中**：左右子節點無大小關係

### ❌ 誤解3：Heapify 需要掃描整個 Heap

**錯誤想法**：找到真正的第二大值需要遍歷  
**實際做法**：只需要局部三方比較

### ❌ 誤解4：陣列表示只適用於 Heap

**其他應用**：

- 完全二元樹都可以用陣列
- 但稀疏樹會浪費空間

### ❌ 誤解5：Heap Sort 一定比 Quick Sort 慢

**實際情況**：

- Heap Sort：穩定 O(n log n)，原地排序
- Quick Sort：平均 O(n log n)，最壞 O(n²)

**選擇依據**：

- 需要穩定性能 → Heap Sort
- 平均性能最優 → Quick Sort
- 記憶體受限 → Heap Sort

## 進階主題

### 1. 為什麼 Build Heap 是 O(n)？

**直覺分析**：

- n 個元素，每個 heapify 最多 O(log n)
- 總代價應該是 O(n log n)？

**實際分析**：

- 大部分節點在底層，調整代價小
- 頂層節點少，即使調整代價大也影響有限

**嚴格證明**：

```
設樹高為 h
第 i 層有 2^i 個節點，向下調整最多 h-i 次

總代價 = Σ(i=0 to h) 2^i * (h-i)
       = 2^h * Σ(i=0 to h) (h-i) / 2^i
       ≤ 2^h * 2
       = O(n)
```

### 2. 變體 Heap

**d-ary Heap**：

- 每個節點有 d 個子節點
- 插入更快 (樹更矮)，刪除稍慢

**Fibonacci Heap**：

- 攤銷分析下插入 O(1)
- 用於 Dijkstra 等圖算法

**Binomial Heap**：

- 支援高效合併操作
- 用於可合併優先佇列

### 3. Heap 在演算法中的應用

**Dijkstra 最短路徑**：

```javascript
function dijkstra(graph, start) {
  const minHeap = new MinHeap();
  const distances = new Map();

  minHeap.insert({ node: start, distance: 0 });

  while (!minHeap.isEmpty()) {
    const { node, distance } = minHeap.extractMin();

    if (distances.has(node)) continue;
    distances.set(node, distance);

    for (let [neighbor, weight] of graph.get(node)) {
      if (!distances.has(neighbor)) {
        minHeap.insert({
          node: neighbor,
          distance: distance + weight,
        });
      }
    }
  }

  return distances;
}
```

**Huffman 編碼**： 使用 Min Heap 構建最優前綴編碼樹

## 總結

Heap 是一個設計精妙的資料結構，它完美地平衡了：

- **簡單性**：陣列實現，無需複雜指標
- **高效性**：O(log n) 插入刪除，O(1) 查詢極值
- **實用性**：廣泛應用於優先佇列、排序、圖算法

掌握 Heap 的關鍵在於理解：

1. **結構設計**：完全二元樹 + 陣列儲存
2. **性質維護**：所有子樹都是 Heap
3. **操作原理**：局部調整達成全域正確

記住：Heap 不追求完美排序，而是用最小代價維護「根節點是極值」這一個關鍵性質。這種「夠用就好」的設計哲學，正是算法設計的智慧所在。

**最後的提醒**：

- 實作時注意索引越界檢查
- 理解時關注 divide and conquer 思想
- 應用時考慮空間與時間的權衡
