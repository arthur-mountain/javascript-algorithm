# Static Array

## 🎯 設計理念

核心原則是「先抽象、後具體」：在做任何題目之前，先理解工具的本質，建立從「問題特徵」到「工具選擇」的映射能力。

### 存在意義

**這個工具被發明出來，是為了解決什麼類型的問題？**

**痛點**：在沒有 array 之前，如果要存儲多個同類型的資料，需要為每個資料創建獨立變數（如 `item1`, `item2`, `item3`...），這導致無法以程式化方式批量處理資料，且變數數量在編譯時就必須確定。

**價值主張**：提供 **O(1) 隨機存取**——只要知道 index，就能直接計算出記憶體位置，立即讀寫資料。

**一句話本質**：一塊連續的、固定大小的記憶體區塊，透過數學運算（`base_address + index × element_size`）實現常數時間的隨機存取。

### 心智模型

**類比：停車場的固定車位**

想像一個有 10 個車位的停車場：

- **建立陣列** = 規劃停車場：一次性劃出 10 個連續車位，每個車位大小相同
- **隨機存取** = 找車位：「我要去第 5 號車位」→ 直接走過去，不需要從 1 號開始數
- **為什麼 O(1)**：因為車位是連續且等寬的，知道起點和編號就能算出確切位置
- **固定容量** = 停車場蓋好後車位數量不變：想增加車位？得另找地方蓋新的，然後把車都搬過去

**局限**：

- 真實停車場可以「擠一擠」多停一輛，但 Static Array 的容量在分配時就固定了
- 真實停車場的車位可以大小不一，但 Static Array 的每個 slot 大小必須相同（在 typed array 的情境下）

---

## 🏗️ 抽象結構

### 核心組件

| 組件              | 功能                   | 為什麼需要                   |
| ----------------- | ---------------------- | ---------------------------- |
| **data**          | 底層連續記憶體區塊     | 實際儲存元素的地方           |
| **capacity**      | 最大可容納元素數量     | 定義記憶體邊界，防止越界存取 |
| **length (size)** | 目前實際儲存的元素數量 | 區分「有效資料」與「空槽位」 |

### 狀態表示

**底層資料結構**：連續的記憶體區塊（在 JS 中用 `new Array(capacity)` 模擬）

**初始狀態**：

- `capacity` = 使用者指定的容量
- `length` = 0（沒有任何有效元素）
- `data` = 所有槽位為 `undefined`（或語言預設的零值）

**關鍵不變量（Invariants）**：

1. **`0 ≤ length ≤ capacity`**：永遠成立
2. **`data[0..length-1]`**：為有效資料區域
3. **`data[length..capacity-1]`**：為未使用區域

### 核心操作

#### 1. **Get（隨機存取讀取）**

**目的**：根據 index 取得對應位置的元素

**輸入/輸出**：`index: number → element: T | undefined`

**不變量**：不修改任何狀態，純讀取操作

**實作**：

```javascript
get(index) {
  // 邊界檢查：index 必須在有效範圍內
  if (index < 0 || index >= this.length) {
    throw new RangeError(`Index ${index} out of bounds [0, ${this.length})`);
  }
  return this.data[index];
}
```

**時間複雜度**：O(1)——這就是 array 存在的核心價值

---

#### 2. **Set（隨機存取寫入）**

**目的**：將指定 index 的元素替換為新值

**輸入/輸出**：`(index: number, element: T) → void`

**不變量**：`length` 不變（只是覆蓋現有位置）

**實作**：

```javascript
set(index, element) {
  // 邊界檢查：只能覆蓋已存在的有效元素
  if (index < 0 || index >= this.length) {
    throw new RangeError(`Index ${index} out of bounds [0, ${this.length})`);
  }
  this.data[index] = element;
}
```

**時間複雜度**：O(1)

---

#### 3. **Insert（插入）**

**目的**：在指定位置插入新元素，後續元素全部後移

**輸入/輸出**：`(index: number, element: T) → void`

**不變量**：

- 執行後 `length` 增加 1
- 原本在 `index` 及之後的元素全部後移一位

**基礎實作**：

```javascript
insert(index, element) {
  // 前置條件檢查
  if (this.length >= this.capacity) {
    throw new Error("Array is full");
  }
  if (index < 0 || index > this.length) {  // 注意：允許 index === length（等同 append）
    throw new RangeError(`Index ${index} out of bounds [0, ${this.length}]`);
  }

  // 從後往前移動元素（避免覆蓋）
  for (let i = this.length; i > index; i--) {
    this.data[i] = this.data[i - 1];
  }

  // 插入新元素
  this.data[index] = element;
  this.length++;
}
```

**為什麼要「從後往前」移動？**

如果從前往後移動：

```plaintext
[A, B, C, _, _]  想在 index=1 插入 X
↓ 先移動 data[1] → data[2]
[A, B, B, _, _]  ← C 被覆蓋了！
```

從後往前移動：

```plaintext
[A, B, C, _, _]  想在 index=1 插入 X
↓ 先移動 data[2] → data[3]
[A, B, C, C, _]
↓ 再移動 data[1] → data[2]
[A, B, B, C, _]
↓ 最後 data[1] = X
[A, X, B, C, _]  ✓ 正確！
```

**時間複雜度**：O(n)——最壞情況是插入在 index=0，需要移動所有元素

---

#### 4. **Delete（刪除）**

**目的**：移除指定位置的元素，後續元素全部前移

**輸入/輸出**：`(index: number) → T`（回傳被刪除的元素）

**不變量**：

- 執行後 `length` 減少 1
- 原本在 `index` 之後的元素全部前移一位

**基礎實作**：

```javascript
delete(index) {
  // 邊界檢查
  if (index < 0 || index >= this.length) {
    throw new RangeError(`Index ${index} out of bounds [0, ${this.length})`);
  }

  const deleted = this.data[index];

  // 從前往後移動元素
  for (let i = index; i < this.length - 1; i++) {
    this.data[i] = this.data[i + 1];
  }

  // 清理最後一個位置（可選，但建議做以避免 memory leak）
  this.data[this.length - 1] = undefined;
  this.length--;

  return deleted;
}
```

**時間複雜度**：O(n)——最壞情況是刪除 index=0

---

#### 5. **Search（線性搜尋）**

**目的**：找出某元素的 index

**輸入/輸出**：`element: T → index: number`（找不到回傳 -1）

**實作**：

```javascript
findIndex(element) {
  // 只搜尋有效資料區域
  for (let i = 0; i < this.length; i++) {
    if (this.data[i] === element) {
      return i;
    }
  }
  return -1;
}
```

**時間複雜度**：O(n)——必須逐一檢查

**優化可能**：如果資料是排序的，可以用 Binary Search 達到 O(log n)

---

#### 6. **Push（尾端新增）**

**目的**：在陣列尾端新增元素（Insert 的特化版本，相當於帶入 index = length）

**輸入/輸出**：`element: T → void`

**不變量**：

- 執行後 `length` 增加 1
- 原有元素位置不變

**實作**：

```javascript
push(element) {
  // 前置條件檢查
  if (this.length >= this.capacity) {
    throw new Error("Array is full");
  }

  // 直接寫入尾端，不需要移動任何元素
  this.data[this.length] = element;
  this.length++;
}
```

**時間複雜度**：O(1)——無論陣列多大，操作步驟固定

**為什麼是 O(1)？**

與 `insert` 不同，`push` 永遠在 `length` 位置寫入，不需要移動任何現有元素：

```plaintext
[A, B, C, _, _]  length=3, 執行 push(D)
         ↑
         直接寫入 data[3]
[A, B, C, D, _]  length=4 ✓
```

---

#### 7. **Pop（尾端移除）**

**目的**：移除並回傳陣列尾端的元素（Delete 的特化版本，相當於帶入 index = length - 1）

**輸入/輸出**：`void → T`（回傳被移除的元素）

**不變量**：

- 執行後 `length` 減少 1
- 原有元素位置不變

**實作**：

```javascript
pop() {
  // 前置條件檢查
  if (this.length === 0) {
    throw new Error("Array is empty");
  }

  // 取得尾端元素
  const element = this.data[this.length - 1];

  // 清理該位置（避免 memory leak）
  this.data[this.length - 1] = undefined;
  this.length--;

  return element;
}
```

**時間複雜度**：O(1)——無論陣列多大，操作步驟固定

**為什麼是 O(1)？**

與 `delete` 不同，`pop` 永遠移除最後一個元素，不需要移動任何其他元素：

```plaintext
[A, B, C, D, _]  length=4, 執行 pop()
            ↑
            取出 data[3]，清理該位置
[A, B, C, _, _]  length=3，回傳 D ✓
```

---

### 核心操作複雜度總結

| 操作             | 時間複雜度 | 空間複雜度 | 移動元素數量 | 備註                     |
| ---------------- | ---------- | ---------- | ------------ | ------------------------ |
| **隨機存取**     |            |            |              |                          |
| get(i) / set(i)  | O(1)       | O(1)       | 0            | 直接索引，核心優勢       |
| **搜尋**         |            |            |              |                          |
| findIndex(val)   | O(n)       | O(1)       | 0            | 線性掃描，未排序無法優化 |
| **插入**         |            |            |              |                          |
| insert(0, val)   | O(n)       | O(1)       | n            | 所有元素右移             |
| insert(mid, val) | O(n)       | O(1)       | n/2 (avg)    | 後半部元素右移           |
| push(val)        | O(1)       | O(1)       | 0            | 等同 insert(length, val) |
| **刪除**         |            |            |              |                          |
| delete(0)        | O(n)       | O(1)       | n-1          | 所有元素左移             |
| delete(mid)      | O(n)       | O(1)       | n/2 (avg)    | 後半部元素左移           |
| pop()            | O(1)       | O(1)       | 0            | 等同 delete(length-1)    |

**符號定義**：

- `n`：當前元素數量（length）

**結構本身的空間複雜度**：O(capacity)

---

## ⭐ 抽象化翻譯器

### 識別核心抽象

> **這個工具的核心對象是**：一組有序的、可透過整數索引存取的同質元素
>
> **它管理的是這些對象之間的什麼關係？**：位置關係（順序性）與直接存取映射

### 建立映射維度

| 維度               | 要回答的問題                 | 這個答案決定了什麼           |
| ------------------ | ---------------------------- | ---------------------------- |
| 維度 1：資料特性   | 元素數量是否已知且固定？     | 選擇 Static vs Dynamic Array |
| 維度 2：存取模式   | 主要是隨機存取還是順序存取？ | 確認 Array 是否為最佳選擇    |
| 維度 3：操作頻率   | 讀多寫少 vs 寫多讀少？       | 決定是否需要其他資料結構輔助 |
| 維度 4：記憶體約束 | 能否容忍額外空間？           | 決定是否使用 in-place 演算法 |

### 實戰檢查表

```plaintext
題目：_______________

維度 1（資料特性）：元素數量是否固定？_______________
維度 2（存取模式）：需要 O(1) 隨機存取嗎？_______________
維度 3（操作頻率）：主要操作是什麼？（讀/寫/插入/刪除）_______________
維度 4（記憶體約束）：空間複雜度要求？_______________

如果需要 O(1) 存取 + 很少插入刪除 → Static Array 適用
如果頻繁插入刪除中間元素 → 考慮 Linked List
如果需要動態擴容 → 考慮 Dynamic Array
```

---

## 🔍 觸發器（模式識別）

### 正向觸發器

| 層級     | 特徵                         | 為什麼這個特徵指向 Static Array |
| -------- | ---------------------------- | ------------------------------- |
| 關鍵字   | "給定一個陣列"、"in-place"   | 題目直接使用 array 作為輸入     |
| 結構     | 需要根據 index 快速存取      | Array 的核心優勢                |
| 目標     | 需要維護順序、支援 O(1) 讀取 | Array 的不變量                  |
| 操作模式 | 讀多寫少、不需頻繁插入刪除   | 避開 Array 的弱點               |

**一句話觸發規則**：當需要 O(1) 隨機存取且元素數量相對固定時，選擇 Array

### 反向觸發器

| 陷阱情境                 | 為什麼不適用   | 更好的選擇    |
| ------------------------ | -------------- | ------------- |
| 頻繁在中間插入/刪除      | 每次操作 O(n)  | Linked List   |
| 需要頻繁查詢元素是否存在 | 線性搜尋 O(n)  | HashSet       |
| 需要維護排序且頻繁插入   | 插入後需要移動 | BST / Heap    |
| 不知道最終大小且空間敏感 | 可能浪費或不夠 | Dynamic Array |

### 與類似工具的決策點

```plaintext
需要存儲一組資料
├── 需要 O(1) 隨機存取
│   ├── 大小已知且固定 → Static Array
│   └── 大小會變化 → Dynamic Array
├── 主要操作是插入/刪除
│   ├── 在頭尾操作 → Deque
│   └── 在中間操作 → Linked List
└── 需要快速查找元素
    ├── 不需要順序 → HashSet
    └── 需要排序順序 → BST / Sorted Array + Binary Search
```

---

## ⚠️ 注意事項

### 常見陷阱

| 陷阱                | 錯誤寫法              | 正確寫法                          | 為什麼                                 |
| ------------------- | --------------------- | --------------------------------- | -------------------------------------- |
| 邊界檢查用 capacity | `index >= capacity`   | `index >= length`                 | capacity 是總容量，length 是有效資料量 |
| 遍歷用 capacity     | `for (i < capacity)`  | `for (i < length)`                | 只應遍歷有效資料                       |
| Insert 從前往後移   | `data[i+1] = data[i]` | `data[i] = data[i-1]`（從後往前） | 避免覆蓋尚未移動的資料                 |
| Delete 忘記清理     | 不處理空出的位置      | `data[length-1] = undefined`      | 避免 memory leak（持有無用引用）       |

### 常見變體

| 變體           | 修改內容                                  | 適用場景             |
| -------------- | ----------------------------------------- | -------------------- |
| Circular Array | 用 `(head + i) % capacity` 計算真實 index | 實現 Queue/Deque     |
| Sorted Array   | 維護排序不變量，支援 Binary Search        | 需要 O(log n) 搜尋   |
| Sparse Array   | 只儲存非零元素的 (index, value) pairs     | 大多數元素為零的情況 |
