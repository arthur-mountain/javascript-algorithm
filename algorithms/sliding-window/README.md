# Sliding Window

## 🎯 設計理念

### 存在意義

**這個演算法策略被發明出來，是為了解決什麼類型的問題？**

- **暴力法**：列舉所有 O(n²) 個連續子序列（subarray / substring），每個子序列需 O(n) 處理 → 整體 O(n³) 或 O(n²)
- **可利用的結構特性**：相鄰窗口高度重疊——窗口從 `[i, j]` 移動到 `[i+1, j+1]` 時，中間的 `j - i - 1` 個元素完全相同，只差頭尾各一個元素
- **核心加速原理**：用增量更新（加入新元素、移除舊元素）取代整個子序列的重新計算，將 O(n²) 降至 O(n)

### 心智模型

**類比：火車窗戶看風景**

想像你坐在火車上，透過窗戶觀察外面的風景：

- 火車往前移動一格，窗口「右邊」出現一個新景色，「左邊」消失一個舊景色
- 你不需要每次都重新看整片風景，只需要「更新變化的部分」
- Fixed Window：窗戶大小固定（如恰好看到 k 棵樹）
- Variable Window：窗戶可以拉伸縮放（如想找到恰好包含 3 種不同顏色花朵的最短區間）

**局限**：

- 火車只能往前開（right 指標只能右移），某些需要回頭看的問題不適用
- 現實窗戶大小固定，但 Variable Sliding Window 的窗口大小會動態變化
- 類比暗示「窗口總是等速滑動」，但實際上 left 和 right 的移動速度不同步——right 每次迭代必定移動一步，left 可能移動零步或多步

---

## 🏗️ 運作機制

### 核心組件

| 組件           | 功能                                            | 為什麼需要                           |
| -------------- | ----------------------------------------------- | ------------------------------------ |
| 左指標 `left`  | 標記窗口左邊界                                  | 決定何時及如何收縮窗口               |
| 右指標 `right` | 標記窗口右邊界                                  | 逐步擴張窗口，驅動主迴圈             |
| 窗口狀態       | 記錄窗口內的聚合資訊（sum、freq map、count 等） | 實現 O(1) 增量更新，避免每次重新計算 |
| 答案變數       | 記錄至今最佳結果                                | 在窗口有效時更新全域最佳解           |

### 狀態表示

- **需要維護的變數**：`left`（左邊界索引）、`right`（右邊界索引）、窗口狀態（依題目需求而異：sum / HashMap / count）、答案變數（max / min / count）
- **初始狀態**：`left = 0`，`right = 0`（或 `right` 從 for 迴圈起始），窗口狀態為空（sum = 0 / map 為空），答案根據求最大或最小設為對應極值
- **不變量（Invariant）**：在每次迭代結束時，`[left, right]` 區間代表一個「有意義的窗口」——對求最長變體，窗口在收縮後滿足約束；對求最短變體，窗口在擴張後可能違反約束，收縮過程中持續更新答案
- **終止條件**：`right` 遍歷完整個序列（`right === n`）

### 適用前提條件

**使用這個策略之前，必須確認以下前提條件成立：**

| 前提條件                 | 為什麼需要                                                             | 違反時的後果                                   | 替代方案                    |
| ------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------- | --------------------------- |
| 操作對象是**連續子序列** | 窗口 `[left, right]` 只能表示連續區間                                  | 概念上就不適用——無法用兩個指標表示不連續的選取 | DP / Backtracking / Bitmask |
| 約束具有**單調性**       | 確保收縮方向明確：擴張窗口 → 更容易違反約束；收縮窗口 → 更容易滿足約束 | 無法判斷該收縮還是擴張，left 的移動方向不確定  | DP / Prefix Sum             |
| 窗口狀態可**增量維護**   | 加入/移除一個元素時需要 O(1) 更新窗口狀態                              | 每次移動邊界仍需 O(n) 重算 → 失去增量更新優勢  | Segment Tree / Sparse Table |

**單調性的精確定義**：

對於約束函式 `f(window)`：

- 如果 `window` 滿足約束，則任何**子窗口**也滿足（收縮安全）
- 如果 `window` 違反約束，則任何**超窗口**也違反（擴張只會更糟）

典型具有單調性的約束：「窗口內不同字元數 ≤ k」「窗口總和 ≤ target」「窗口內無重複元素」。

典型**不具有**單調性的約束：「窗口總和 = target」（增加元素可能從小於 target 變成大於 target 再變回等於 target，但可以透過「atMost 拆解」轉化）。

### 與資料結構的關聯

本演算法本身是一種策略（strategy），它的實作依賴底層資料結構來儲存資料與維護狀態：

| 資料結構                  | 角色     | 在本演算法中的用途                     | 典型題目/場景                                                            |
| ------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------ |
| Array / String            | 輸入載體 | 被操作的底層序列，窗口在其上滑動       | 所有 Sliding Window 問題                                                 |
| HashMap                   | 狀態維護 | 追蹤窗口內元素的頻率分布               | Minimum Window Substring、Longest Substring Without Repeating Characters |
| 計數變數（sum / count）   | 狀態維護 | 最輕量的狀態追蹤，維護窗口內的聚合值   | Maximum Sum Subarray of Size K、滿足條件的子陣列數量                     |
| HashSet                   | 狀態維護 | 追蹤窗口內元素的存在性（不需頻率）     | Longest Substring Without Repeating Characters（簡化版）                 |
| Monotonic Deque           | 效能加速 | 維護窗口內的單調性，實現 O(1) 取最值   | Sliding Window Maximum（LC 239）                                         |
| 固定長度陣列（`int[26]`） | 效能加速 | 字元集有限時取代 HashMap，降低常數因子 | 僅含小寫字母的子字串問題                                                 |

**關鍵洞察**：Sliding Window 定義「何時移動邊界」的邏輯，資料結構負責「高效地維護窗口狀態」。選擇哪種資料結構，取決於窗口需要追蹤什麼資訊——頻率用 HashMap、存在性用 HashSet、聚合值用計數變數、最值用 Monotonic Deque。

### 流程步驟

1. **Expand（擴張窗口）**

   **目的**：將 `right` 指標右移，將新元素納入窗口，更新窗口狀態。

   **關鍵決策點**：加入元素時如何更新窗口狀態？這取決於窗口需要追蹤的資訊類型。

   ```javascript
   // right 的推進由 for 迴圈驅動
   const element = arr[right];
   // 根據題目需求更新狀態：
   // sum += element（聚合值）
   // freq.set(element, (freq.get(element) || 0) + 1)（頻率）
   // windowSet.add(element)（存在性）
   ```

---

2. **Shrink（收縮窗口）**

   **目的**：將 `left` 指標右移，縮小窗口，直到窗口重新滿足約束（或達到固定大小）。

   **關鍵決策點**：收縮條件是什麼？用 `if`（Fixed Window）還是 `while`（Variable Window）？

   ```javascript
   // Fixed Window：窗口大小超過 k 時收縮一次
   if (right - left + 1 > k) { /* 移除 arr[left]，left++ */ }

   // Variable Window — 求最長：違反約束時持續收縮
   while (/* 窗口違反約束 */) { /* 移除 arr[left]，left++ */ }

   // Variable Window — 求最短：滿足約束時持續收縮（邊收縮邊更新答案）
   while (/* 窗口滿足約束 */) { /* 更新答案，移除 arr[left]，left++ */ }
   ```

---

3. **Update Answer（更新答案）**

   **目的**：在窗口處於有效狀態時，更新全域最佳解。

   **關鍵決策點**：何時更新？這取決於變體類型。

   ```javascript
   // 求最長/最大：收縮後窗口滿足約束時更新
   result = Math.max(result, right - left + 1);

   // 求最短/最小：收縮過程中窗口仍滿足約束時更新
   // （更新邏輯寫在 Shrink 的 while 迴圈內）
   result = Math.min(result, right - left + 1);

   // 計數型：使用 atMost 拆解，收縮後累加窗口大小
   count += right - left + 1;
   ```

---

### 模式分類

**變體總覽**：

```plaintext
Sliding Window
├── Fixed Size Window（窗口大小由題目指定為固定值 k）
├── Variable Size Window — 求最長/最大（窗口越大越好，收縮是被迫的）
├── Variable Size Window — 求最短/最小（窗口越小越好，收縮是主動的）
└── 計數型（求滿足條件的子陣列/子字串數量，用 atMost 拆解）
```

---

**變體 A：Fixed Size Window**

**觸發條件**：題目明確指定窗口大小為固定值 `k`，例如「大小為 k 的子陣列的最大總和」。

**與其他變體的差異**：

- 窗口大小固定，不需要 `while` 收縮——只在窗口超過 `k` 時用 `if` 移除最左元素
- 答案只在窗口恰好為 `k` 時才更新

```javascript
/**
 * Fixed Size Window 模板
 *
 * @param {any[]} arr - 輸入序列
 * @param {number} k - 固定窗口大小
 * @return {any} 全域最佳解
 *
 * 適用場景：窗口大小由題目固定（如「大小為 k 的子陣列的最大總和」）
 * 觸發條件：題目明確給定 k，且操作對象是連續子序列
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1) 或 O(k)，取決於窗口狀態用什麼資料結構
 */
function fixedWindow(arr, k) {
  let left = 0;
  let result = /* 初始值，依題目需求 */;
  let windowState = /* 初始狀態：0 / new Map() / ... */;

  for (let right = 0; right < arr.length; right++) {
    // Step 1: Expand — 加入 arr[right]
    // windowState += arr[right]; 或 freq.set(...)

    // Step 2: Shrink — 窗口超過 k 時移除最左元素
    // 用 if 而非 while，因為窗口每次最多超出 1
    if (right - left + 1 > k) {
      // windowState -= arr[left]; 或 freq 更新
      left++;
    }

    // Step 3: Update — 窗口恰好為 k 時更新答案
    if (right - left + 1 === k) {
      result = /* Math.max(result, windowState) 或其他更新邏輯 */;
    }
  }

  return result;
}
```

---

**變體 B：Variable Size Window — 求最長/最大**

**觸發條件**：題目要求找「滿足某約束的最長子陣列/子字串」，窗口越大越好，收縮是在違反約束時被迫進行的。

**與 Fixed Window 的差異**：

- 收縮用 `while` 而非 `if`，因為可能需要連續收縮多步才能恢復約束
- 答案在收縮**之後**更新（此時窗口必定滿足約束）

```javascript
/**
 * Variable Size Window — 求最長/最大 模板
 *
 * @param {any[]} arr - 輸入序列
 * @param {Function|any} constraint - 約束條件（具體形式依題目而異）
 * @return {number} 滿足約束的最長窗口大小
 *
 * 適用場景：找滿足條件的「最長」連續子序列
 * 觸發條件：題目要求最長/最大 + 約束具有單調性
 *
 * 時間複雜度：O(n) — left 和 right 各最多移動 n 次
 * 空間複雜度：取決於窗口狀態結構
 */
function variableWindowMax(arr, constraint) {
  let left = 0;
  let result = 0;
  let windowState = /* 初始狀態 */;

  for (let right = 0; right < arr.length; right++) {
    // Step 1: Expand — 加入 arr[right]，更新窗口狀態

    // Step 2: Shrink — 違反約束時持續收縮
    // 與 Fixed Window 的差異：用 while 而非 if
    while (/* 窗口違反約束 */) {
      // 移除 arr[left]，更新窗口狀態
      left++;
    }

    // Step 3: Update — 收縮後窗口必定合法，更新最大值
    result = Math.max(result, right - left + 1);
  }

  return result;
}
```

---

**變體 C：Variable Size Window — 求最短/最小**

**觸發條件**：題目要求找「滿足某約束的最短子陣列/子字串」，窗口越小越好，收縮是主動進行的。

**與求最長的關鍵差異**：

- 答案在收縮的 `while` 迴圈**內部**更新（每次收縮前窗口都滿足約束）
- 收縮條件是「**滿足**約束」而非「違反約束」——只要還滿足就繼續縮

```javascript
/**
 * Variable Size Window — 求最短/最小 模板
 *
 * @param {any[]} arr - 輸入序列
 * @param {Function|any} constraint - 約束條件
 * @return {number} 滿足約束的最短窗口大小
 *
 * 適用場景：找滿足條件的「最短」連續子序列
 * 觸發條件：題目要求最短/最小 + 約束具有單調性
 *
 * 時間複雜度：O(n)
 * 空間複雜度：取決於窗口狀態結構
 */
function variableWindowMin(arr, constraint) {
  let left = 0;
  let result = Infinity; // 求最小，初始為 Infinity
  let windowState = /* 初始狀態 */;

  for (let right = 0; right < arr.length; right++) {
    // Step 1: Expand — 加入 arr[right]

    // Step 2: Shrink + Step 3: Update（合併）
    // 與求最長的差異：收縮條件是「滿足約束」而非「違反約束」
    // 答案在 while 內更新，而非 while 之後
    while (/* 窗口滿足約束 */) {
      result = Math.min(result, right - left + 1);
      // 移除 arr[left]，更新窗口狀態
      left++;
    }
  }

  return result === Infinity ? 0 : result; // 無解時回傳 0 或 -1
}
```

---

**變體 D：計數型（atMost 拆解）**

**觸發條件**：題目要求「恰好/至多滿足某條件的子陣列數量」。因為直接找「剛好」太難了，所以繞個彎，利用 `exactly(k) = atMost(k) - atMost(k-1)` 的邏輯轉化（就像用「最高 80 分的人數」減去「最高 79 分的人數」，剩下的就是「剛好 80 分」的人數）。

**與其他變體的關鍵差異**：

- 不直接求最長或最短區間，而是求**數量總和**。
- **核心技巧（為什麼加 `right - left + 1`）**：只要當下的大窗口 `[left, right]` 合法，裡面所有**以 `right` 為結尾**的小子陣列就一定都合法。這些子陣列的數量，剛好就是當前窗口的長度 `right - left + 1`。
- **保證不重複**：因為迴圈是靠 `right` 一步步往前推進，每次算出來的子陣列「結尾」都不一樣，所以一路累加絕對不會算到重複的區間。
- 需要呼叫兩次 sliding window 函式，用數學等式組合結果。

```javascript
/**
 * 計數型 Sliding Window — atMost 拆解模板
 *
 * @param {any[]} arr - 輸入序列
 * @param {number} k - 約束參數
 * @return {number} 滿足條件的子陣列數量
 *
 * 適用場景：求「恰好 k 個/至多 k 個」滿足條件的子陣列數量
 * 觸發條件：直接計數 exactly(k) 困難，改用 atMost(k) - atMost(k-1) 拆解
 *
 * 時間複雜度：O(n) — 呼叫兩次 O(n) 的 atMost 函式
 * 空間複雜度：取決於窗口狀態結構
 */
function countExactly(arr, k) {
  return atMost(arr, k) - atMost(arr, k - 1);
}
function atMost(arr, k) {
  let left = 0;
  let count = 0;
  let windowState = /* 初始狀態 */;

  for (let right = 0; right < arr.length; right++) {
    // Step 1: Expand — 加入 arr[right]，更新狀態

    // Step 2: Shrink — 違反 atMost(k) 時收縮
    while (/* 窗口違反「至多 k」的約束 */) {
      // 移除 arr[left]，更新窗口狀態
      left++;
    }

    // Step 3: Update — 累加合法子陣列數量
    // 關鍵洞察：[left, right], [left+1, right], ..., [right, right] 都合法
    // 因為每次 right 都在前進，結尾不同，所以直接累加保證不重複
    count += right - left + 1;
  }

  return count;
}
```

---

### 複雜度總結

| 變體                  | 時間複雜度 | 空間複雜度     | 備註                                   |
| --------------------- | ---------- | -------------- | -------------------------------------- |
| Fixed Size Window     | O(n)       | O(1) 或 O(k)   | 取決於窗口狀態用什麼資料結構           |
| Variable — 求最長     | O(n)       | 取決於狀態結構 | left, right 各最多移動 n 次，攤銷 O(n) |
| Variable — 求最短     | O(n)       | 取決於狀態結構 | 同上                                   |
| 計數型（atMost 拆解） | O(n)       | 取決於狀態結構 | 呼叫兩次 O(n) 的函式，整體仍 O(n)      |

**符號定義**：

- `n`：輸入序列的長度
- `k`：固定窗口大小（Fixed）或約束參數（計數型）

**空間複雜度細項**：

- 純計數變數（sum / count）：O(1)
- HashMap 追蹤頻率：O(min(n, 字元集大小))
- 固定長度陣列（`int[26]`）：O(1)（常數大小）
- Monotonic Deque：O(k)

---

## ⭐ 抽象化翻譯器

**這是最關鍵的部分——建立「問題情境 → 抽象工具」的映射能力**

### 識別核心抽象

> 這個工具的核心對象是：**連續子序列**（subarray / substring）
>
> 它管理的是這些對象之間的什麼關係？**在約束條件下，找到最優（最長/最短/數量最多）的連續子序列**

### 建立映射維度

| 維度         | 要回答的問題                                 | 這個答案決定了什麼                                           |
| ------------ | -------------------------------------------- | ------------------------------------------------------------ |
| ① 序列與元素 | 窗口滑動的底層序列是什麼？元素是什麼？       | 輸入資料結構（Array / String）以及單一元素的處理方式         |
| ② 窗口約束   | 窗口需要滿足什麼條件？窗口大小固定還是可變？ | 選擇哪個變體（Fixed / Variable-Max / Variable-Min / 計數型） |
| ③ 窗口狀態   | 為了判斷約束是否滿足，需要追蹤什麼資訊？     | 搭配哪個資料結構（計數變數 / HashMap / Deque）               |
| ④ 答案提取   | 最終答案是什麼？何時更新？                   | Update Answer 步驟的邏輯（max / min / count += ）            |

### 實戰檢查表

```plaintext
題目：_______________

① 序列與元素：底層序列是 _______________，元素是 _______________
② 窗口約束：約束是 _______________
   → 固定大小 k？ / 可變大小求最長？ / 可變大小求最短？ / 計數型？
   → 約束是否具有單調性？（擴張 → 更容易違反？收縮 → 更容易滿足？）
③ 窗口狀態：為了判斷約束，需要追蹤 _______________
   → 用什麼資料結構維護？_______________
④ 答案提取：答案是 _______________，在 _______________ 時更新

填完後，選擇對應的變體模板，填入題目特定的值即可實作。
```

### 映射範例

**題目 A**：Minimum Window Substring（LC 76）

> 給定字串 `s` 和 `t`，找出 `s` 中包含 `t` 所有字元的最短子字串。

| 維度         | 具體問題                                    | 抽象映射                                          |
| ------------ | ------------------------------------------- | ------------------------------------------------- |
| ① 序列與元素 | 字串 `s`，元素是單一字元                    | String，逐字元處理                                |
| ② 窗口約束   | 窗口內必須包含 `t` 的所有字元（含頻率）     | Variable — 求最短（窗口越小越好，滿足時主動收縮） |
| ③ 窗口狀態   | 追蹤窗口內各字元頻率，與 `t` 的需求頻率比較 | HashMap（need）+ 計數器（formed / required）      |
| ④ 答案提取   | 最短子字串的長度和起始位置                  | 在 `while` 內更新 `minLen` 和 `minStart`          |

**從映射到實作的關鍵步驟**：

1. 建立 `need` map 記錄 `t` 的字元頻率，`required` = 不同字元數
2. Expand：`right` 移入字元，更新 `windowFreq`，若某字元頻率達標則 `formed++`
3. Shrink：`formed === required` 時持續收縮，每次收縮前更新答案
4. 收縮時更新 `windowFreq`，若某字元頻率不再達標則 `formed--`

---

**題目 B**：Subarrays with K Different Integers（LC 992）

> 給定正整數陣列 `nums` 和整數 `k`，回傳恰好含有 `k` 種不同整數的子陣列數量。

| 維度         | 具體問題                                                   | 抽象映射                                        |
| ------------ | ---------------------------------------------------------- | ----------------------------------------------- |
| ① 序列與元素 | 整數陣列 `nums`，元素是正整數                              | Array，逐元素處理                               |
| ② 窗口約束   | 恰好 k 種不同整數 → `exactly(k) = atMost(k) - atMost(k-1)` | 計數型（atMost 拆解）                           |
| ③ 窗口狀態   | 追蹤窗口內不同整數的數量                                   | HashMap（element → freq）+ distinct count       |
| ④ 答案提取   | 合法子陣列數量                                             | `count += right - left + 1`（在 atMost 函式內） |

**從映射到實作的關鍵步驟**：

1. 實作 `atMost(nums, k)` 函式：求「至多 k 種不同整數」的子陣列數量
2. 用 HashMap 追蹤頻率，`distinct` 計數不同元素數
3. `distinct > k` 時收縮，收縮時若某元素頻率歸零則 `distinct--`
4. 最終答案 = `atMost(nums, k) - atMost(nums, k - 1)`

---

## 🔍 觸發器（模式識別）

### 正向觸發器

| 層級     | 特徵                                                         | 為什麼這個特徵指向 Sliding Window              |
| -------- | ------------------------------------------------------------ | ---------------------------------------------- |
| 關鍵字   | 「連續子陣列」「子字串」「contiguous subarray」「substring」 | Sliding Window 專門處理連續區間上的問題        |
| 關鍵字   | 「最長」「最短」「maximum sum」「minimum length」            | 在連續區間上求極值是 Sliding Window 的典型目標 |
| 結構     | 輸入是一維序列（Array / String）                             | 窗口需要在一維序列上滑動                       |
| 目標     | 找滿足某約束的最優連續子序列                                 | 這是 Sliding Window 的核心用途                 |
| 操作模式 | 元素的加入/移除對窗口狀態的影響可以 O(1) 描述                | 增量更新是 Sliding Window 的核心加速原理       |
| 約束     | n ≤ 10⁵ 且暴力法 O(n²) 太慢 → 需要 O(n)                      | Sliding Window 將雙層迴圈降至單層              |

**一句話觸發規則**：看到「連續子序列 + 約束條件 + 求最優」，且約束具有單調性 → Sliding Window。

### 反向觸發器

| 陷阱情境                                            | 為什麼不適用                                 | 更好的選擇                                |
| --------------------------------------------------- | -------------------------------------------- | ----------------------------------------- |
| 子序列（subsequence）而非子陣列                     | 子序列不連續，窗口無法表示                   | DP / Two Pointers                         |
| 約束不具有單調性（如「和恰好等於 target」且有負數） | 有負數時，擴張可能增也可能減，收縮方向不確定 | Prefix Sum + HashMap                      |
| 需要全域資訊（如「所有元素中的第 k 大」）           | 窗口只能看到局部區間                         | Sorting / Quick Select / Heap             |
| 二維問題（如矩陣中的子矩陣）                        | 標準 Sliding Window 只處理一維               | 2D Prefix Sum / 壓縮行後再 Sliding Window |
| 窗口狀態不可 O(1) 增量維護（如「窗口內中位數」）    | 每次移動需要 O(log n) 重算                   | 兩個 Heap / SortedList + Sliding Window   |

### 與類似工具的決策點

```plaintext
「連續子序列問題」
├── 約束具有單調性 + 可增量維護
│   ├── 窗口大小固定 → Fixed Sliding Window
│   └── 窗口大小可變
│       ├── 求最長/最大 → Variable Sliding Window (Max)
│       ├── 求最短/最小 → Variable Sliding Window (Min)
│       └── 求數量 → 計數型 Sliding Window (atMost 拆解)
├── 需要區間和/區間查詢 → Prefix Sum
├── 約束不單調但可轉化（如「和為 target」全正數）→ Sliding Window（仍單調）
├── 約束不單調且有負數 → Prefix Sum + HashMap
└── 需要區間最值且不只是頭尾 → Monotonic Deque / Segment Tree

「Two Pointers vs Sliding Window」
├── 兩個指標從兩端向中間 → Two Pointers（對撞型）
├── 兩個指標同向移動（快慢型，如 linked list cycle） → Two Pointers（快慢型）
└── 兩個指標同向移動且維護連續區間狀態 → Sliding Window
    （Sliding Window 是 Two Pointers 的特化：增加了「窗口狀態」的增量維護）
```

---

## ⚠️ 注意事項

### 常見陷阱

| 陷阱                            | 錯誤寫法                                | 正確寫法                                 | 為什麼                                                                  |
| ------------------------------- | --------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------- |
| 求最短時答案更新位置錯誤        | 在 `while` 外更新 `result`              | 在 `while` **內**更新 `result`（收縮前） | 收縮後窗口可能不再滿足約束，錯過最短答案                                |
| 收縮條件搞反                    | 求最長時 `while (滿足約束)`             | 求最長時 `while (違反約束)`              | 求最長是「違反時被迫收縮」，求最短是「滿足時主動收縮」                  |
| HashMap 移除元素時忘記刪 key    | `freq.set(x, freq.get(x) - 1)` 後不處理 | 頻率為 0 時 `freq.delete(x)`             | 影響 `freq.size` 的正確性（用 size 判斷不同元素數時尤其致命）           |
| Fixed Window 用 `while` 收縮    | `while (right - left + 1 > k)`          | `if (right - left + 1 > k)`              | 固定窗口每次最多超出 1，用 `while` 雖不會錯但多餘，暴露對機制的理解不足 |
| 忘記處理無解情況                | 求最短時直接回傳 `result`               | `result === Infinity ? 0 : result`       | 若整個序列都不滿足約束，`result` 仍為初始值                             |
| 計數型忘記 `k < 0` 的 base case | `atMost(arr, -1)` 不處理                | 函式開頭加 `if (k < 0) return 0`         | `exactly(k) = atMost(k) - atMost(k-1)` 中 `k=0` 時會呼叫 `atMost(-1)`   |

### 常見變體

| 變體                      | 修改內容                                               | 適用場景                                 |
| ------------------------- | ------------------------------------------------------ | ---------------------------------------- |
| + HashMap（頻率追蹤）     | 窗口狀態改用 HashMap 記錄元素頻率                      | 涉及字元頻率、不同元素數的問題           |
| + Monotonic Deque         | 在標準模板上外掛 Monotonic Deque 維護窗口最值          | Sliding Window Maximum/Minimum           |
| + 雙 HashMap（need/have） | 維護「需求頻率」和「窗口頻率」兩個 map                 | Minimum Window Substring 類型            |
| + formed/required 計數    | 不逐字元比較頻率，而用計數器追蹤「已滿足的字元種類數」 | 優化 Minimum Window Substring 的判斷效率 |
| 多指標變體                | 使用 3+ 個指標維護不同條件的邊界                       | 複雜約束的組合問題（較罕見）             |
