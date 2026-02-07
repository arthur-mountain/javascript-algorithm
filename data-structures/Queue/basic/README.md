# Queue（佇列）

## 🎯 設計理念

### 存在意義

**這個工具被發明出來，是為了解決什麼類型的問題？**

**痛點**：在許多場景中，任務/資料的處理順序必須與到達順序一致。若使用普通陣列或堆疊，要麼無法保證順序（隨機存取），要麼順序相反（LIFO）。每次取出最早元素需要 O(n) 移動。

**價值主張**：以 O(1) 時間完成「加入隊尾」與「取出隊首」，同時嚴格保證先進先出（FIFO）的處理順序。

**一句話本質**：專門管理「按到達順序依序處理」的資料結構。

### 心智模型

**用生活化的類比建立直覺**

**類比：排隊買票**

| 操作       | 生活場景                                 | Queue 操作           |
| ---------- | ---------------------------------------- | -------------------- |
| Enqueue    | 新顧客走到隊伍最後面排隊                 | 將元素加入隊尾       |
| Dequeue    | 窗口叫號，最前面的顧客離開去辦事         | 移除並返回隊首元素   |
| Peek/Front | 看看現在排在最前面的是誰（但他還沒輪到） | 查看隊首元素但不移除 |
| isEmpty    | 確認隊伍是否還有人在排                   | 檢查佇列是否為空     |

**局限性**：

- 真實排隊可能有人「插隊」或「離開」，標準 Queue 不支援中間位置操作
- 真實排隊的位置是物理空間，Queue 的位置是邏輯概念
- 現實中可以看到整條隊伍，但標準 Queue 只暴露隊首和隊尾

---

## 🏗️ 抽象結構

### 核心組件

| 組件              | 功能                    | 為什麼需要                                 |
| ----------------- | ----------------------- | ------------------------------------------ |
| **Storage**       | 存放所有元素            | 佇列的本體，可用 Array 或 Linked List 實作 |
| **Front Pointer** | 指向隊首位置            | 快速定位下一個要取出的元素                 |
| **Rear Pointer**  | 指向隊尾位置            | 快速定位下一個要插入的位置                 |
| **Capacity**      | 最大容量（Array-based） | 固定容量時判斷是否已滿                     |

### 狀態表示

#### 底層結構選擇：Array vs Linked List

| 面向           | Array-based                          | Linked List-based                       |
| -------------- | ------------------------------------ | --------------------------------------- |
| **記憶體配置** | 連續區塊，固定或動態分配             | 分散節點，按需分配                      |
| **空間效率**   | 固定容量時可能有未使用空間           | 每個節點額外存指標（8 bytes on 64-bit） |
| **Cache 效能** | 優秀（連續記憶體，prefetch 友善）    | 較差（節點分散，cache miss 機率高）     |
| **實作複雜度** | 需處理 index wrap-around（Circular） | 直接操作指標，邏輯較直覺                |
| **容量限制**   | 固定容量需預先決定大小               | 理論上無限制（受限於記憶體）            |

#### Array-based Queue 的狀態（固定容量 Circular）

```plaintext
狀態設計：
- front = rear = -1 表示空佇列（哨兵值設計）
- front 指向第一個元素（dequeue 位置）
- rear 指向最後一個元素（最近 enqueue 的位置）

正常情況（rear >= front）：
       front              rear
         ↓                 ↓
    +----+----+----+----+----+----+
    |    | B  | C  | D  |    |    |
    +----+----+----+----+----+----+
index: 0    1    2    3    4    5

capacity = 6, front = 1, rear = 3
元素：B, C, D（共 3 個）

Wrap-around 情況（rear < front）：
       rear         front
         ↓            ↓
    +----+----+----+----+----+----+
    | F  | G  |    | D  | E  |    |
    +----+----+----+----+----+----+
index: 0    1    2    3    4    5

capacity = 6, front = 3, rear = 1
元素：D, E, F, G（共 4 個，從 front 往右繞回來）
```

**關鍵狀態定義**：

- **空佇列**：`front === -1`（哨兵值）
- **滿佇列**：`(rear + 1) % capacity === front`
- **元素數量**：`((rear - front + capacity) % capacity) + 1`（空時為 0）
- **Enqueue 位置**：空時設為 0，否則 `(rear + 1) % capacity`
- **Dequeue 後**：若 `front === rear` 則重置為 -1，否則 `front = (front + 1) % capacity`

#### Linked List-based Queue 的狀態

```plaintext
    head                          tail
      ↓                            ↓
    +---+    +---+    +---+    +---+
    | A | -> | B | -> | C | -> | D | -> null
    +---+    +---+    +---+    +---+

size = 4
head = Node(A)（dequeue 從這取）
tail = Node(D)（enqueue 接在這後面）
```

**關鍵狀態定義**：

- **空佇列**：`head === null`（同時 `tail === null`）
- **單元素**：`head === tail`（且不為 null）
- **Enqueue**：建新節點，`tail.next = newNode`，`tail = newNode`
- **Dequeue**：保存 `head.value`，`head = head.next`，若變 null 則 `tail = null`

---

### 核心操作

#### 1. **Enqueue（入隊）**

**目的**：將新元素加入佇列尾端

**輸入/輸出**：

- 輸入：要加入的元素值
- 輸出：是否成功（固定容量）或無（動態容量）

**不變量**：

- 新元素必須成為新的隊尾
- 既有元素的相對順序不變
- 元素數量增加 1（若未滿）

---

##### Array-based Enqueue（固定容量）

**基礎實作（Linear Array）**：

```javascript
// 最直覺的寫法：永遠往 array 尾端加
enqueue(value) {
  if (this.rear === this.capacity - 1) return false; // 滿了
  this.data[++this.rear] = value;
  if (this.front === -1) this.front = 0;
  return true;
}
```

**基礎版本的問題**：

這個版本的問題是 dequeue 後釋放的空間無法重複利用。即使前端有空位，rear 到達尾端就判定為滿。

```plaintext
初始：[A, B, C, _, _]  front=0, rear=2
dequeue 後：[_, B, C, _, _]  front=1, rear=2（index 0 浪費）
多次 dequeue 後：[_, _, C, _, _]  front=2, rear=2（前面全浪費）
enqueue D, E：[_, _, C, D, E]  front=2, rear=4
再 enqueue：rear=4 已到尾端，判定為滿！但前面明明有空位
```

**優化策略：Circular Array（環狀陣列）**

**核心思想**：用 modulo 運算讓 index「繞回」陣列開頭，重複利用已 dequeue 的空間。

**為什麼能解決問題**：

- front 和 rear 都可以獨立移動，不需要搬移元素
- dequeue 釋放的空間可被後續 enqueue 重複使用
- 空間利用率達到 100%（在容量範圍內）

```javascript
// Circular Array 版本
enqueue(item) {
  if (this.isFull()) return false;

  if (this.isEmpty()) {
    this.front = this.rear = 0;
  } else {
    this.rear = (this.rear + 1) % this.capacity; // 關鍵：wrap-around
  }

  this.data[this.rear] = item;
  return true;
}
```

**視覺化說明**：

```plaintext
Linear Array 的問題：
操作序列：enqueue A, B, C → dequeue → dequeue → enqueue D, E, F

Linear（浪費空間）：
[A, B, C, _, _] → [_, B, C, _, _] → [_, _, C, _, _] → [_, _, C, D, E] → 滿！F 無處放

Circular（空間回收）：
  f     r                    f  r                 f  r
[A, B, C, _, _] → [_, B, C, _, _] → [_, _, C, _, _]

     r     f           r        f
→ [_, _, C, D, E] → [F, _, C, D, E]  ← F 繞回 index 0
```

**優化後複雜度**：O(1)

---

##### Linked List-based Enqueue

**基礎實作**：

```javascript
enqueue(value) {
  const newNode = new ListNode(value);

  if (this.tail === null) {
    // 空佇列：head 和 tail 都指向新節點
    this.head = newNode;
    this.tail = newNode;
  } else {
    // 非空：接在 tail 後面，更新 tail
    this.tail.next = newNode;
    this.tail = newNode;
  }
  this.size++;
}
```

**這個版本沒有明顯問題**：

- 不需要搬移元素
- 不需要處理 wrap-around
- 空間按需分配，沒有浪費

**可能的優化：Dummy Head**

```javascript
// 使用 dummy head 簡化邊界條件
constructor() {
  this.dummy = new ListNode(null); // 永遠存在的假節點
  this.tail = this.dummy;
  this.size = 0;
}

enqueue(value) {
  const newNode = new ListNode(value);
  this.tail.next = newNode;
  this.tail = newNode;
  this.size++;
  // 不需要 if-else，邏輯統一
}
```

**複雜度**：O(1)

---

#### 2. **Dequeue（出隊）**

**目的**：移除並返回佇列前端的元素

**輸入/輸出**：

- 輸入：無
- 輸出：被移除的隊首元素（空時回傳 null 或拋出錯誤）

**不變量**：

- 必須移除最早加入的元素（FIFO）
- 剩餘元素的相對順序不變
- 元素數量減少 1

---

##### Array-based Dequeue（固定容量）

**基礎實作（Linear Array，元素搬移）**：

```javascript
dequeue() {
  if (this.front === -1) return null;

  const value = this.data[this.front];
  // 所有元素左移一格
  for (let i = this.front; i < this.rear; i++) {
    this.data[i] = this.data[i + 1];
  }
  this.rear--;
  if (this.rear < this.front) this.front = this.rear = -1;
  return value;
}
```

**基礎版本的問題**：

- 每次 dequeue 需要 O(n) 時間搬移元素
- 這是 Array 在頭部刪除的根本限制

**優化策略：Circular Array（移動指標而非元素）**

**核心思想**：不搬移元素，只移動 front 指標。特別注意「最後一個元素」的邊界條件。

```javascript
dequeue() {
  if (this.isEmpty()) return null;

  const item = this.data[this.front];

  if (this.front === this.rear) {
    // 關鍵：最後一個元素，重置為空狀態
    this.front = this.rear = -1;
  } else {
    // 環狀遞增 front
    this.front = (this.front + 1) % this.capacity;
  }

  return item;
}
```

**視覺化說明**：

```plaintext
Linear Dequeue（搬移元素）：
[A, B, C, D, _]  取出 A
[B, C, D, _, _]  ← B, C, D 都要左移，O(n)

Circular Dequeue（移動指標）：
  f        r
[A, B, C, D, _]  取出 A
     f     r
[_, B, C, D, _]  ← 只移動 front 指標，O(1)

處理最後一個元素：
     f=r
[_, _, C, _, _]  取出 C
[_, _, _, _, _]  front = rear = -1（重置為空狀態）
```

**優化後複雜度**：O(1)

---

##### Linked List-based Dequeue

**基礎實作**：

```javascript
dequeue() {
  if (this.head === null) return null;

  const value = this.head.value;
  this.head = this.head.next;

  // 關鍵：如果變空了，tail 也要更新
  if (this.head === null) {
    this.tail = null;
  }

  this.size--;
  return value;
}
```

**這個版本已經是最優**：

- 直接操作指標，O(1)
- 不需要搬移元素
- 被移除的節點會被 GC 回收

**複雜度**：O(1)

---

#### 3. **Peek / Front（查看隊首）**

**目的**：查看但不移除隊首元素

**輸入/輸出**：

- 輸入：無
- 輸出：隊首元素的值（空時回傳 null）

**不變量**：佇列狀態完全不變

##### Array-based Peek

```javascript
peek() {
  return this.isEmpty() ? null : this.data[this.front];
}
```

##### Linked List-based Peek

```javascript
peek() {
  return this.head === null ? null : this.head.value;
}
```

**複雜度**：O(1)（兩種實作皆是）

---

#### 4. **isEmpty / isFull / Size（狀態查詢）**

##### Array-based（固定容量）

```javascript
isEmpty() {
  return this.front === -1;
}

isFull() {
  return this.front === (this.rear + 1) % this.capacity;
}

size() {
  if (this.isEmpty()) return 0;
  return ((this.rear - this.front + this.capacity) % this.capacity) + 1;
}
```

##### Linked List-based

```javascript
isEmpty() {
  return this.head === null;
}

getSize() {
  return this.size;
}
// Linked List 沒有 isFull（除非人為限制）
```

**複雜度**：O(1)

---

### 核心操作複雜度總結

#### Array-based Queue (Fixed Capacity Circular)

| 操作         | 時間複雜度 | 空間複雜度 | 備註              |
| ------------ | ---------- | ---------- | ----------------- |
| **入隊**     |            |            |                   |
| enqueue(val) | **O(1)**   | O(1)       | 滿時回傳 false    |
| **出隊**     |            |            |                   |
| dequeue()    | **O(1)**   | O(1)       | 空時回傳 null     |
| **查詢**     |            |            |                   |
| peek()       | O(1)       | O(1)       | 直接索引存取      |
| isEmpty()    | O(1)       | O(1)       | 檢查 front === -1 |
| isFull()     | O(1)       | O(1)       | 檢查環狀滿條件    |
| size()       | O(1)       | O(1)       | 環狀公式計算      |

#### Linked List-based Queue

| 操作         | 時間複雜度 | 空間複雜度 | 備註                      |
| ------------ | ---------- | ---------- | ------------------------- |
| **入隊**     |            |            |                           |
| enqueue(val) | **O(1)**   | O(1)       | 新節點需額外 pointer 空間 |
| **出隊**     |            |            |                           |
| dequeue()    | **O(1)**   | O(1)       | GC 負責回收節點           |
| **查詢**     |            |            |                           |
| peek()       | O(1)       | O(1)       | 直接存取 head             |
| isEmpty()    | O(1)       | O(1)       | 檢查 head === null        |
| getSize()    | O(1)       | O(1)       | 維護 size 變數            |

**符號定義**：

- `n`：當前元素數量

**結構本身的空間複雜度**：

- **Array-based（固定容量）**：O(capacity)，容量在初始化時決定
- **Linked List-based**：O(n)，每個元素需額外 8 bytes（64-bit pointer）

---

## ⭐ 抽象化翻譯器

### 識別核心抽象

> **這個工具的核心對象是**：需要「按順序處理」的任務/元素序列
>
> **它管理的是這些對象之間的什麼關係**：到達順序（temporal ordering）— 先到的必須先被處理

Queue 的本質是**時序管理器**：它不關心元素的內容或優先級，只關心「誰先來」。

### 建立映射維度

| 維度                 | 要回答的問題                   | 這個答案決定了什麼   |
| -------------------- | ------------------------------ | -------------------- |
| **維度 1：處理單元** | 什麼東西需要「排隊等候處理」？ | Queue 存放的元素類型 |
| **維度 2：入隊時機** | 什麼事件會產生新的待處理項目？ | enqueue 的觸發條件   |
| **維度 3：出隊時機** | 什麼時候可以處理下一個項目？   | dequeue 的觸發條件   |
| **維度 4：處理邏輯** | 取出元素後要做什麼？           | dequeue 後的業務邏輯 |

### 實戰檢查表

```plaintext
題目：_______________

維度 1（處理單元）：什麼是「排隊的人」？ → _______________
維度 2（入隊時機）：什麼情況要「讓人排隊」？ → _______________
維度 3（出隊時機）：什麼情況要「叫下一位」？ → _______________
維度 4（處理邏輯）：「叫到號」的人要做什麼？ → _______________

填完後，Queue 的使用方式應該能直接寫出。
```

### 映射範例

**題目 A**：[LC 102] Binary Tree Level Order Traversal

| 維度   | 具體問題                   | 抽象映射                  |
| ------ | -------------------------- | ------------------------- |
| 維度 1 | 樹的節點                   | Queue 存放 TreeNode       |
| 維度 2 | 遇到非空節點的左右子節點   | 左子/右子非空時 enqueue   |
| 維度 3 | 要處理當前層的下一個節點   | 每次迭代開始時 dequeue    |
| 維度 4 | 記錄節點值，並探索其子節點 | 加入結果 + enqueue 子節點 |

**從映射到實作的關鍵步驟**：

1. 初始化：root 非空則入隊
2. 每層迴圈開始：記錄當前 queue size（這層有幾個節點）
3. 內層迴圈：dequeue 該數量的節點，處理每個節點時 enqueue 其子節點
4. 這樣自然形成「一層一層」的遍歷

**題目 B**：[LC 225] Implement Stack using Queues

| 維度   | 具體問題                    | 抽象映射                |
| ------ | --------------------------- | ----------------------- |
| 維度 1 | 要模擬的 stack 元素         | Queue 存放 stack 的元素 |
| 維度 2 | stack.push(x) 被呼叫        | enqueue(x)              |
| 維度 3 | stack.pop() 被呼叫          | 需要取出「最後進來的」  |
| 維度 4 | 把前 n-1 個元素重新排到後面 | dequeue + enqueue 循環  |

**從映射到實作的關鍵步驟**：

1. push：直接 enqueue，O(1)
2. pop：把前 n-1 個元素依序 dequeue 再 enqueue，最後一個 dequeue 就是答案
3. 這題展示了 Queue 的 FIFO 特性如何透過「繞一圈」模擬 LIFO

---

## 🔍 觸發器（模式識別）

### 正向觸發器

| 層級         | 特徵                                 | 為什麼這個特徵指向 Queue           |
| ------------ | ------------------------------------ | ---------------------------------- |
| **關鍵字**   | 「層級」「level」「BFS」「廣度」     | BFS 需要 FIFO 來確保層級順序       |
| **關鍵字**   | 「先進先出」「FIFO」「排隊」「等待」 | 直接對應 Queue 的語意              |
| **關鍵字**   | 「最近」「sliding window」（部分）   | 有時 deque 更合適，但 Queue 是基礎 |
| **結構**     | 樹/圖的「逐層」遍歷                  | 每層處理完才進下一層 = FIFO        |
| **結構**     | 需要「緩衝」兩個速度不同的處理流程   | Producer-Consumer 模式             |
| **目標**     | 找最短路徑（無權圖）                 | BFS 保證第一次到達就是最短         |
| **目標**     | 按時間順序處理事件/任務              | 時序 = FIFO                        |
| **操作模式** | 一端加入、另一端取出                 | Queue 的定義特徵                   |

**一句話觸發規則**：當問題需要「按照發現/到達的順序逐一處理」時，考慮 Queue。

### 反向觸發器

| 陷阱情境                         | 為什麼不適用              | 更好的選擇                |
| -------------------------------- | ------------------------- | ------------------------- |
| 需要「最後處理最先加入的」       | 這是 LIFO，不是 FIFO      | **Stack**                 |
| 需要兩端都能加入/取出            | 標準 Queue 只支援單向操作 | **Deque（雙端佇列）**     |
| 需要按「優先級」而非「順序」處理 | Queue 不考慮元素內容      | **Priority Queue / Heap** |
| 需要頻繁查詢「是否包含某元素」   | Queue 查詢是 O(n)         | **Set / Hash Table**      |
| 需要隨機存取中間元素             | Queue 只暴露兩端          | **Array / Deque**         |

### 與類似工具的決策點

```plaintext
「依序處理一組元素」
├── 後進先出（最新的先處理）→ Stack
├── 先進先出（最舊的先處理）→ Queue
├── 兩端都要操作 → Deque
├── 按優先級處理 → Priority Queue / Heap
└── 需要隨機存取 → Array

「找最短路徑」
├── 無權圖 → BFS + Queue（保證第一次到達最短）
├── 有權圖（非負權） → Dijkstra + Priority Queue
└── 有負權 → Bellman-Ford（不需特殊資料結構）

「層級遍歷」
├── 標準 BFS → Queue
├── 需要反向層級 → Queue + Stack（或事後 reverse）
└── 需要 zigzag → Queue + 方向標記
```

---

## ⚠️ 注意事項

### 常見陷阱

| 陷阱                          | 錯誤寫法                           | 正確寫法                                | 為什麼                       |
| ----------------------------- | ---------------------------------- | --------------------------------------- | ---------------------------- |
| **Linear Array dequeue**      | 每次 dequeue 搬移所有元素          | 使用 Circular Array 或 Linked List      | O(n) vs O(1) 差距巨大        |
| **忘記處理空佇列**            | `return this.data[this.front]`     | 先檢查 `if (isEmpty()) return null`     | 避免 undefined 或越界        |
| **Circular index 計算錯誤**   | `rear++`                           | `rear = (rear + 1) % capacity`          | 不 mod 會越界                |
| **忘記重置空狀態**            | dequeue 最後一個元素後只移動 front | `if (front === rear) front = rear = -1` | 否則 isEmpty/isFull 判斷錯誤 |
| **Linked List 忘記更新 tail** | dequeue 後只更新 head              | `if (head === null) tail = null`        | 否則 tail 指向已刪除節點     |
| **BFS 用 length 做迴圈**      | `while (queue.length)` 內不固定層  | 記錄層開始時的 `levelSize`              | 否則無法區分層級             |

### 常見變體

| 變體                  | 修改內容                                 | 適用場景                              |
| --------------------- | ---------------------------------------- | ------------------------------------- |
| **Circular Queue**    | 固定容量，用 mod 實現環狀                | 記憶體受限、嵌入式系統、LeetCode 622  |
| **Deque（雙端佇列）** | 兩端都能 push/pop                        | Sliding Window Maximum、某些 BFS 變體 |
| **Priority Queue**    | dequeue 取優先級最高而非最早             | Dijkstra、任務調度、事件驅動模擬      |
| **Blocking Queue**    | 空時 dequeue 會等待、滿時 enqueue 會等待 | 多執行緒 Producer-Consumer            |
| **Monotonic Queue**   | 維護單調性，淘汰「永遠不會被選」的元素   | Sliding Window 最值問題               |

---

## 實作選擇建議

| 場景                           | 推薦實作             | 原因                           |
| ------------------------------ | -------------------- | ------------------------------ |
| **記憶體受限、嵌入式系統**     | Fixed Circular Array | 不需動態分配，可預測記憶體用量 |
| **LeetCode 622**               | Fixed Circular Array | 題目要求固定容量               |
| **大小變化劇烈、無法預估容量** | Linked List-based    | 按需分配，無容量限制           |
| **需要 O(1) 最壞保證**         | Linked List-based    | 沒有擴容的攤銷開銷             |
| **Cache 效能敏感**             | Array-based          | 連續記憶體，prefetch 友善      |
| **一般 LeetCode / 面試**       | 語言內建（JS Array） | 面試重點是邏輯，不是重複造輪子 |
