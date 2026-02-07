# HashSet

## 🎯 設計理念

### 存在意義

**這個工具被發明出來，是為了解決什麼類型的問題？**

| 面向           | 說明                                                                                                                  |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| **痛點**       | 在它出現之前，判斷「某元素是否已存在」需要線性掃描 O(n)；維護「不重複集合」需要每次插入前都檢查，整體複雜度可達 O(n²) |
| **價值主張**   | 以 **O(1) 平均時間**完成「新增」、「刪除」、「存在性檢查」三大操作                                                    |
| **一句話本質** | 專門管理「誰已經出現過」的資料結構——只關心元素的**存在性**，不關心順序或數量                                          |

```plaintext
【HashSet vs Array 的本質差異】
Array：「我有這些東西，它們按這個順序排列」→ 關心位置
HashSet：「這些東西各出現過一次」→ 只關心存在與否
```

---

### 心智模型

**用生活化的類比建立直覺**

**類比：活動報到系統**

想像你在管理一場會議的報到：

| 操作        | 類比                     | 實際意義                             |
| ----------- | ------------------------ | ------------------------------------ |
| `add(x)`    | 某人報到，在名單上打勾   | 將元素加入集合（已存在則不重複加入） |
| `has(x)`    | 查詢某人是否已報到       | 檢查元素是否存在於集合中             |
| `delete(x)` | 某人取消報名，從名單刪除 | 將元素從集合移除                     |
| `size`      | 目前已報到人數           | 集合中的元素數量                     |

**為什麼報到系統是好類比？**

- 每個人只能報到一次（**唯一性約束**）
- 查詢「某人是否報到」是最頻繁的操作
- 不關心報到順序，只關心「有沒有」

**局限性**：

- 真實報到系統可能需要記錄報到時間（需要 HashMap）
- 真實報到系統可能需要按順序輸出（需要 LinkedHashSet）
- HashSet 不保證迭代順序

---

## 🏗️ 抽象結構

### 核心組件

| 組件                      | 功能                          | 為什麼需要                    |
| ------------------------- | ----------------------------- | ----------------------------- |
| **Bucket Array**          | 儲存元素的槽位陣列            | 提供 O(1) 直接定址能力        |
| **Hash Function**         | 將任意元素映射到整數索引      | 決定元素存放在哪個 bucket     |
| **Collision Handler**     | 處理多個元素映射到同一 bucket | 保證正確性，Hash 衝突不可避免 |
| **Load Factor Threshold** | 觸發擴容的填充率閾值          | 平衡空間效率與時間效率        |

### 狀態表示

```plaintext
HashSet 內部結構示意：

buckets: [  bucket0,  bucket1,  bucket2,  bucket3,  ...  ]
              ↓         ↓         ↓         ↓
            null      "cat"     null    ["dog", "fog"]
                                         (collision chain)

- 使用 Array 作為底層 bucket 陣列
- 每個 bucket 可能是：null（空）、單一元素、或串列（處理衝突）
- capacity：bucket 陣列的長度
- size：實際儲存的元素數量
- loadFactor = size / capacity（當 > threshold 時擴容）
```

**初始狀態**：

- `capacity = 16`（常見預設值）
- `size = 0`
- 所有 bucket 為 `null`
- `loadFactorThreshold = 0.75`（常見預設值）

**關鍵不變量**：

1. 任意元素最多出現一次（唯一性）
2. `hash(element) % capacity` 決定元素所在的 bucket
3. 擴容後所有元素需要 rehash

---

### 核心操作

#### 1. Hash Function（雜湊函數）

**目的**：將任意類型的元素轉換成整數索引

**輸入/輸出**：任意元素 → 非負整數（bucket index）

**不變量**：相同元素必須產生相同 hash 值

**基礎實作**（針對字串）：

```javascript
hash(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    // 31 是質數，減少衝突機率
    hash = (hash * 31 + key.charCodeAt(i)) % this.capacity;
  }
  return hash;
}
```

**為什麼選擇 31？**

- 質數能讓 hash 分布更均勻
- `31 = 32 - 1 = 2^5 - 1`，乘法可優化為位移：`hash * 31 = (hash << 5) - hash`
- 經驗值：在字串 hash 中表現良好（Java String.hashCode() 也用 31）

---

#### 2. Add（新增元素）

**目的**：將元素加入集合，若已存在則不重複加入

**輸入/輸出**：`element → boolean`（是否成功新增）

**不變量**：操作後集合仍滿足唯一性

**基礎實作**：

```javascript
add(element) {
  const index = this.hash(element);
  const bucket = this.buckets[index];

  // Case 1: bucket 為空，直接放入
  if (!bucket) {
    this.buckets[index] = [element];
    this.size++;
    return true;
  }

  // Case 2: bucket 非空，檢查是否已存在
  for (const item of bucket) {
    if (item === element) {
      return false;  // 已存在，不重複加入
    }
  }

  // Case 3: 不存在，加入 bucket
  bucket.push(element);
  this.size++;

  // 檢查是否需要擴容
  if (this.size / this.capacity > this.loadFactorThreshold) {
    this.resize();
  }

  return true;
}
```

**複雜度**：

- 平均：O(1)
- 最壞：O(n)（所有元素都在同一個 bucket，或觸發 resize）

---

#### 3. Has（存在性檢查）

**目的**：判斷元素是否存在於集合中

**輸入/輸出**：`element → boolean`

**不變量**：不修改集合狀態

```javascript
has(element) {
  const index = this.hash(element);
  const bucket = this.buckets[index];

  if (!bucket) return false;

  for (const item of bucket) {
    if (item === element) return true;
  }

  return false;
}
```

**複雜度**：

- 平均：O(1)
- 最壞：O(n)（所有元素都在同一個 bucket）

---

#### 4. Delete（刪除元素）

**目的**：從集合移除指定元素

**輸入/輸出**：`element → boolean`（是否成功刪除）

**不變量**：若元素不存在，集合不變

```javascript
delete(element) {
  const index = this.hash(element);
  const bucket = this.buckets[index];

  if (!bucket) return false;

  const itemIndex = bucket.indexOf(element);
  if (itemIndex === -1) return false;

  bucket.splice(itemIndex, 1);
  this.size--;

  // 可選：bucket 清空時設為 null
  if (bucket.length === 0) {
    this.buckets[index] = null;
  }

  return true;
}
```

---

#### 5. Resize（擴容與 Rehash）

**目的**：當 load factor 超過閾值時，擴大容量並重新分配所有元素

**觸發條件**：`size / capacity > loadFactorThreshold`

```javascript
resize() {
  const oldBuckets = this.buckets;
  this.capacity *= 2;  // 容量翻倍
  this.buckets = new Array(this.capacity).fill(null);
  this.size = 0;

  // Rehash 所有元素
  for (const bucket of oldBuckets) {
    if (bucket) {
      for (const element of bucket) {
        this.add(element);  // 重新計算 hash 並加入
      }
    }
  }
}
```

**為什麼需要 Rehash？**

- 新的 capacity 改變了 `hash(element) % capacity` 的結果
- 元素必須重新定位到正確的 bucket

---

### 核心操作複雜度總結

| 操作                   | 平均時間    | 最壞時間 | 空間複雜度  | 備註                         |
| ---------------------- | ----------- | -------- | ----------- | ---------------------------- |
| **基本操作**           |             |          |             |                              |
| add(element)           | **O(1)**    | O(n)     | O(1) 攤銷   | 最壞：衝突或觸發 resize      |
| has(element)           | **O(1)**    | O(n)     | O(1)        | 最壞：衝突導致線性搜尋       |
| delete(element)        | **O(1)**    | O(n)     | O(1)        | 同上                         |
| **集合操作**           |             |          |             |                              |
| union(otherSet)        | O(m)        | O(n×m)   | O(m)        | m = otherSet.size            |
| intersection(otherSet) | O(min(n,m)) | O(n×m)   | O(min(n,m)) | 遍歷較小集合                 |
| difference(otherSet)   | O(n)        | O(n×m)   | O(n)        | 遍歷 this                    |
| **內部操作**           |             |          |             |                              |
| resize()               | O(n)        | O(n)     | O(n)        | 需重新分配並 rehash 所有元素 |

**符號定義**：

- `n`：當前 HashSet 的元素數量
- `m`：另一個 HashSet 的元素數量
- **攤銷 (Amortized)**：考慮偶爾的 resize 後，平均每次操作的成本

**結構本身的空間複雜度**：O(capacity)，其中 capacity ≈ n / loadFactor

---

## ⭐ 抽象化翻譯器

### 識別核心抽象

> **HashSet 的核心對象是：「元素的存在性」**
>
> 它管理的是：**哪些元素「曾經出現過」的二元狀態（有/沒有）**

與其他資料結構的核心對象對比：

- Array：元素的**位置與順序**
- HashMap：鍵與值的**對應關係**
- HashSet：元素的**存在與否**

### 建立映射維度

| 維度                   | 要回答的問題                       | 這個答案決定了什麼                 |
| ---------------------- | ---------------------------------- | ---------------------------------- |
| **維度 1：元素定義**   | 問題中的「什麼」需要被追蹤存在性？ | HashSet 要存什麼類型的元素         |
| **維度 2：唯一性語義** | 「重複」在問題中代表什麼意思？     | 如何定義元素相等（影響 hash 設計） |
| **維度 3：核心查詢**   | 最頻繁的問題是「X 是否存在？」嗎？ | 確認 HashSet 是否為正確選擇        |
| **維度 4：結果需求**   | 需要的是「有哪些」還是「有幾個」？ | 決定是否需要額外的計數結構         |

### 實戰檢查表

```plaintext
題目：_______________

維度 1（元素定義）：需要追蹤什麼的存在性？_______________
維度 2（唯一性語義）：什麼情況算「重複」？_______________
維度 3（核心查詢）：主要操作是存在性檢查嗎？_______________
維度 4（結果需求）：需要去重後的集合 or 只需要判斷？_______________

✅ 若答案是：追蹤某類元素 + 值相等即重複 + 頻繁檢查存在性 + 需要去重結果
→ HashSet 是正確選擇
```

### 映射範例

**題目 A**：[217. Contains Duplicate](https://leetcode.com/problems/contains-duplicate/)

> 給定整數陣列，判斷是否有重複元素

| 維度   | 具體問題             | 抽象映射           |
| ------ | -------------------- | ------------------ |
| 維度 1 | 整數陣列中的數字     | HashSet 存整數     |
| 維度 2 | 數值相等即重複       | 直接用整數作為元素 |
| 維度 3 | 「是否已見過這個數」 | 典型存在性檢查     |
| 維度 4 | 只需判斷有/無重複    | 不需保留去重結果   |

**從映射到實作**：

```javascript
function containsDuplicate(nums) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return true; // 維度 3：存在性檢查
    seen.add(num); // 維度 1：追蹤整數
  }
  return false;
}
```

---

**題目 B**：[349. Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays/)

> 給定兩個陣列，返回它們的交集（結果不重複）

| 維度   | 具體問題                        | 抽象映射              |
| ------ | ------------------------------- | --------------------- |
| 維度 1 | 兩個陣列中的數字                | 兩個 HashSet          |
| 維度 2 | 數值相等即重複                  | 直接用整數            |
| 維度 3 | 「nums1 的元素是否在 nums2 中」 | 存在性檢查            |
| 維度 4 | 需要去重後的交集結果            | 結果也用 Set 保證唯一 |

**從映射到實作**：

```javascript
function intersection(nums1, nums2) {
  const set1 = new Set(nums1);
  const result = new Set();

  for (const num of nums2) {
    if (set1.has(num)) {
      // 維度 3：存在性檢查
      result.add(num); // 維度 4：去重結果
    }
  }

  return [...result];
}
```

---

**題目 C**：[3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

> 找出最長的不重複字元子字串

| 維度   | 具體問題                           | 抽象映射            |
| ------ | ---------------------------------- | ------------------- |
| 維度 1 | 當前滑動窗口內的字元               | HashSet 存字元      |
| 維度 2 | 字元相等即重複                     | 直接用字元          |
| 維度 3 | 「新字元是否在當前窗口中」         | 存在性檢查          |
| 維度 4 | 需要動態維護「當前窗口的字元集合」 | Set 支援 add/delete |

**關鍵洞察**：這題 HashSet 是**動態維護滑動窗口狀態**的工具

---

## 🔍 觸發器（模式識別）

### 正向觸發器

| 層級         | 特徵                                         | 為什麼這個特徵指向 HashSet    |
| ------------ | -------------------------------------------- | ----------------------------- |
| **關鍵字**   | "重複"、"出現過"、"唯一"、"去重"、"distinct" | 直接對應 HashSet 的唯一性約束 |
| **關鍵字**   | "是否存在"、"包含"、"見過"                   | 直接對應 `has()` 操作         |
| **結構**     | 需要快速判斷元素是否在某集合中               | HashSet 的 O(1) 查詢優勢      |
| **目標**     | 找出不重複的元素 / 統計唯一元素數量          | HashSet 自動去重              |
| **操作模式** | 遍歷過程中需要記錄「已處理」狀態             | 典型的 visited set 用法       |

**一句話觸發規則**：

> 當問題的核心是「判斷某元素是否曾經出現過」，且不關心出現次數或順序時，想到 HashSet

### 反向觸發器

| 陷阱情境                                  | 為什麼不適用           | 更好的選擇                   |
| ----------------------------------------- | ---------------------- | ---------------------------- |
| 需要記錄出現次數                          | HashSet 只記錄有/無    | **HashMap**（key→count）     |
| 需要保持插入順序                          | HashSet 不保證順序     | **LinkedHashSet** / Array    |
| 需要排序後的結果                          | HashSet 無序           | **TreeSet** / 排序後的 Array |
| 需要 key-value 對應                       | HashSet 只存 key       | **HashMap**                  |
| 元素不可 hash（如複雜物件）               | 需要自定義 hash/equals | 考慮轉換為可 hash 的表示     |
| 需要範圍查詢（如「找出 < x 的所有元素」） | HashSet 不支援順序操作 | **TreeSet** / 排序結構       |

### 與類似工具的決策點

```plaintext
「我需要追蹤某些元素」
├── 需要記錄額外資訊（如計數、對應值）？
│   ├── 是 → HashMap
│   └── 否 → 繼續判斷
│       ├── 需要保持順序？
│       │   ├── 插入順序 → LinkedHashSet / Array
│       │   └── 排序順序 → TreeSet / Sorted Array
│       └── 只需要存在性檢查？
│           └── 是 → HashSet ✓
│
├── 查詢模式是什麼？
│   ├── 「元素 X 是否存在？」→ HashSet ✓
│   ├── 「有多少個 X？」→ HashMap（計數）
│   ├── 「最小/最大的元素？」→ Heap / TreeSet
│   └── 「第 K 個元素？」→ Array / TreeSet
```

**HashSet vs HashMap 的關鍵區別**：

| 面向     | HashSet            | HashMap                |
| -------- | ------------------ | ---------------------- |
| 儲存     | 只有 key           | key-value pair         |
| 問題     | 「X 存在嗎？」     | 「X 對應的值是什麼？」 |
| 典型用法 | 去重、visited 標記 | 計數、對應關係         |

---

## ⚠️ 注意事項

### 常見陷阱

| 陷阱               | 錯誤寫法                                 | 正確寫法                         | 為什麼                        |
| ------------------ | ---------------------------------------- | -------------------------------- | ----------------------------- |
| **物件相等性**     | `set.add({a:1}); set.has({a:1})` → false | 使用 primitive 或 JSON.stringify | JS 物件比較的是引用，不是內容 |
| **忘記去重語義**   | 用 Array 累積，最後 `[...new Set(arr)]`  | 直接用 Set 累積                  | 過程中已達 O(n) 去重效果      |
| **迭代中修改**     | `for (x of set) { set.delete(x) }`       | 先收集再刪除，或使用 forEach     | 某些環境下迭代中修改會出問題  |
| **undefined/null** | 忘記 `undefined` 和 `null` 也是有效元素  | 有意識地處理這些特殊值           | Set 可以存這些值              |
| **NaN 的特殊性**   | `NaN === NaN` 是 false                   | Set 內部用 SameValueZero 比較    | Set 認為 NaN 等於 NaN         |

### JavaScript Set 的特殊行為

```javascript
// 1. NaN 相等性
const set = new Set();
set.add(NaN);
set.add(NaN);
console.log(set.size); // 1（NaN 被視為相等）

// 2. -0 和 +0 相等性
set.add(-0);
set.add(+0);
console.log(set.size); // 2（上面已有 NaN）
console.log(set.has(0)); // true（-0 和 +0 視為相等）

// 3. 物件引用
const obj = { a: 1 };
set.add(obj);
set.add({ a: 1 }); // 不同引用，視為不同元素
console.log(set.size); // 4
```

### 常見變體

| 變體              | 修改內容                              | 適用場景                     |
| ----------------- | ------------------------------------- | ---------------------------- |
| **LinkedHashSet** | 維護插入順序的雙向鏈表                | 需要按插入順序迭代           |
| **TreeSet**       | 底層用 BST（如紅黑樹）                | 需要排序順序或範圍查詢       |
| **Counting Set**  | 記錄每個元素的出現次數                | 需要計數但主要操作仍是存在性 |
| **Bloom Filter**  | 機率性資料結構，可能有 false positive | 超大規模、可容忍誤判         |
| **Frozen Set**    | 不可變的 Set                          | 需要作為 Map 的 key          |
