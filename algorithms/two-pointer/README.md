# Two Pointers

## 🎯 設計理念

### 存在意義

**這個演算法策略被發明出來，是為了解決什麼類型的問題？**

- **暴力法**：對序列中的每一對元素 `(i, j)` 進行檢查 → O(n²)。瓶頸在於盲目列舉所有配對，大量比較是冗餘的。
- **可利用的結構特性**：當序列已排序（或問題具有某種單調關係）時，一次比較的結果能夠**指引搜尋方向**——確定性地排除不可能的配對，而非逐一嘗試。
- **核心加速原理**：利用排序帶來的單調性，讓兩個指標根據比較結果**有方向性地移動**，每步至少排除一個候選元素，將 O(n²) 降至 O(n)。

### 心智模型

**類比：兩人從走廊兩端走向彼此**

想像一條長走廊，地板上從左到右刻著遞增的數字。兩個人分別站在走廊的最左端和最右端，他們要找到「腳下兩個數字的和等於目標值」的位置：

- 如果當前兩人腳下的數字之和**太大**→ 右邊的人往左走一步（減小總和）
- 如果當前兩人腳下的數字之和**太小**→ 左邊的人往右走一步（增大總和）
- 每步都有明確方向，不需要回頭

**局限**：這個類比最適用於「對撞指標」變體。快慢指標更像是「兩人同方向走，一人走得快一人走得慢」，行為模式不同。此外，類比假設了嚴格的線性結構；實際問題中指標可能操作在 Linked List 等非隨機存取的結構上。

---

## 🏗️ 運作機制

### 核心組件

| 組件                   | 功能                               | 為什麼需要                           |
| ---------------------- | ---------------------------------- | ------------------------------------ |
| 指標 A（left / slow）  | 標記搜尋範圍的一端或慢速掃描位置   | 定義當前考慮的「起點」或「寫入位置」 |
| 指標 B（right / fast） | 標記搜尋範圍的另一端或快速掃描位置 | 定義當前考慮的「終點」或「讀取位置」 |
| 移動條件               | 根據比較結果決定移動哪個指標       | 保證每步排除至少一個候選，確保收斂   |
| 答案變數               | 記錄至今最佳結果或收集結果         | 在指標相遇前持續更新最佳解           |

### 狀態表示

- **需要維護的變數/狀態**：兩個索引（或指標引用），以及根據題目需求的輔助狀態（如當前和、當前區間長度等）
- **初始狀態**：
  - 對撞指標：`left = 0, right = n - 1`（序列兩端）
  - 快慢指標：`slow = 0, fast = 0`（同一起點）
  - 分區指標：`writeIdx = 0, readIdx = 0`
- **不變量（Invariant）**：
  - 對撞指標：答案若存在，必定在 `[left, right]` 範圍內；`left ≤ right` 始終成立
  - 快慢指標：`slow ≤ fast` 始終成立；`[0, slow)` 區間保持已處理的有效狀態
- **終止條件**：
  - 對撞指標：`left >= right`（搜尋空間為空）
  - 快慢指標：`fast` 到達序列尾端
  - 環偵測：快慢指標相遇

### 適用前提條件

**使用這個策略之前，必須確認以下前提條件成立：**

| 前提條件                                 | 為什麼需要                                     | 違反時的後果                     | 替代方案                                          |
| ---------------------------------------- | ---------------------------------------------- | -------------------------------- | ------------------------------------------------- |
| 序列已排序或具有可利用的單調性（對撞型） | 排序保證移動指標時能確定性地增大或減小目標函數 | 移動方向不確定，可能遺漏正確答案 | HashMap（O(n) 查找配對）、排序後再用 Two Pointers |
| 問題可歸約為「兩個位置之間的關係」       | Two Pointers 本質是管理「兩個位置」的策略      | 概念上不適用                     | Sliding Window（連續子序列）、DP（多階段決策）    |
| 指標移動方向明確且不可逆                 | 保證每步排除候選，確保 O(n) 收斂               | 需要回溯 → 退化為 O(n²)          | Backtracking、Binary Search                       |

### 與資料結構的關聯

本演算法本身是一種策略（strategy），它的實作依賴底層資料結構來儲存資料與維護狀態：

| 資料結構        | 角色     | 在本演算法中的用途                            | 典型題目/場景                               |
| --------------- | -------- | --------------------------------------------- | ------------------------------------------- |
| Array（已排序） | 輸入載體 | 提供隨機存取 + 排序保證單調性                 | Two Sum II, 3Sum, Container With Most Water |
| Linked List     | 輸入載體 | 快慢指標在鏈結結構上操作                      | Linked List Cycle, Middle of Linked List    |
| HashMap         | 效能加速 | 在未排序情況下替代排序步驟，O(1) 查找互補元素 | Two Sum（原版，不需要排序）                 |
| HashSet         | 效能加速 | 去重或標記已訪問                              | 3Sum 去重輔助                               |

**關鍵洞察**：Two Pointers 定義「兩個位置如何根據比較結果移動」的邏輯，底層資料結構負責「高效地存取指標指向的元素」。在 Array 上是 O(1) 隨機存取；在 Linked List 上是 O(1) 的 next/prev 跟隨。

### 流程步驟

**本演算法的流程類型**：執行期流程

---

1. **Initialize（初始化指標）**

**目的**：將兩個指標放到正確的起始位置。

**關鍵決策點**：根據變體選擇起始位置——對撞型放兩端，快慢型放同一端。

```javascript
// 對撞型
let left = 0,
  right = nums.length - 1;

// 快慢型
let slow = 0,
  fast = 0;
```

---

2. **Evaluate（評估當前狀態）**

**目的**：根據兩指標指向的元素，計算當前狀態並與目標比較。

**關鍵決策點**：比較的邏輯是什麼？（求和 vs target？面積計算？元素相等判斷？）

```javascript
// 對撞型範例：求和比較
const sum = nums[left] + nums[right];
// 快慢型範例：條件判斷
const shouldKeep = /* 題目特定的判斷邏輯 */;
```

---

3. **Move（移動指標）**

**目的**：根據評估結果，移動正確的指標以縮小搜尋空間。

**關鍵決策點**：移動哪個指標？移動幾步？是否需要跳過重複元素？

```javascript
// 對撞型：根據大小關係決定方向
if (sum < target)
  left++; // 需要更大的值
else if (sum > target)
  right--; // 需要更小的值
else {
  /* found */
}

// 快慢型：fast 永遠前進，slow 有條件前進
fast++;
if (shouldKeep) slow++;
```

---

4. **Update Answer（更新答案）**

**目的**：在滿足條件時記錄或更新最佳結果。

**關鍵決策點**：何時更新？是找到即返回，還是持續追蹤最佳解？

```javascript
// 精確匹配型：找到即返回
if (sum === target) return [left, right];

// 最優化型：持續追蹤
result = Math.max(result /* 當前計算值 */);
```

---

### 模式分類

**變體總覽**：

```plaintext
Two Pointers
├── 對撞指標 Opposite Direction（輸入已排序，兩端向中間收縮）
├── 快慢指標 Fast-Slow（同向移動，速度不同，用於環偵測或找中點）
├── 分區指標 Partition / Remove（同向移動，原地覆寫，用於移除/分區）
└── 合併指標 Merge（兩個已排序序列，各一個指標，歸併推進）
```

---

**變體 A：對撞指標（Opposite Direction）**

**觸發條件**：輸入已排序（或可以排序），需要找滿足某種「兩端關係」的配對（如兩數之和、面積最大化、回文判斷）。

**與基礎版本的差異**：這是 Two Pointers 最經典的形式——兩指標從兩端出發，根據比較結果決定收縮哪一端。

```javascript
/**
 * 對撞指標模板 - 在已排序序列上找滿足條件的配對
 *
 * @param {number[]} nums - 已排序的數字陣列
 * @param {number} target - 目標值
 * @return {number[]} 滿足條件的索引對，或 [-1, -1] 表示未找到
 *
 * 適用場景：Two Sum II, 3Sum（外層迴圈 + 內層對撞）, Container With Most Water
 * 觸發條件：已排序 + 找配對/極值 + 兩端關係
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1)
 */
function oppositeDirection(nums, target) {
  // Step 1: Initialize — 兩指標放在序列兩端
  let left = 0;
  let right = nums.length - 1;

  // 終止條件：搜尋空間為空
  while (left < right) {
    // Step 2: Evaluate — 計算當前配對的值
    const sum = nums[left] + nums[right];

    // Step 3: Move — 根據比較結果移動指標
    if (sum === target) {
      // Step 4: Update Answer — 找到目標
      return [left, right];
    } else if (sum < target) {
      // 總和太小 → 需要更大的左端值 → left 右移
      left++;
    } else {
      // 總和太大 → 需要更小的右端值 → right 左移
      right--;
    }
  }

  return [-1, -1]; // 未找到
}
```

---

**變體 B：快慢指標（Fast-Slow）**

**觸發條件**：需要在 Linked List 上偵測環、找中點，或在序列上偵測循環模式。

**與對撞指標的差異**：兩指標從同一端出發、同方向移動，但速度不同（fast 每次走 2 步，slow 每次走 1 步）。不需要排序前提，利用的是「速度差」而非「大小單調性」。

```javascript
/**
 * 快慢指標模板 - Linked List 環偵測（Floyd's Cycle Detection）
 *
 * @param {ListNode} head - 鏈結串列的頭節點
 * @return {boolean} 是否存在環
 *
 * 適用場景：Linked List Cycle, Find the Duplicate Number, Happy Number
 * 觸發條件：偵測循環 / 找中點 / 需要 O(1) 空間的鏈結串列操作
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1)
 */
function fastSlow(head) {
  // Step 1: Initialize — 快慢指標從同一起點出發
  let slow = head;
  let fast = head;

  // 終止條件：fast 到達尾端（無環）或快慢相遇（有環）
  // 檢查 fast && fast.next 確保 fast 可以安全走兩步
  while (fast !== null && fast.next !== null) {
    // Step 3: Move — slow 走一步，fast 走兩步
    slow = slow.next;
    fast = fast.next.next;

    // Step 2 + 4: Evaluate + Update — 若相遇則存在環
    if (slow === fast) return true;
  }

  return false; // fast 到達尾端，無環
}

/**
 * 快慢指標模板 - 找 Linked List 中點
 *
 * @param {ListNode} head - 鏈結串列的頭節點
 * @return {ListNode} 中間節點（偶數長度時返回前一個中點）
 *
 * 適用場景：Sort List（Merge Sort 需要切半）, Palindrome Linked List
 * 觸發條件：需要 O(1) 空間找鏈結串列中點
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1)
 */
function findMiddle(head) {
  let slow = head;
  let fast = head;

  // fast.next && fast.next.next：當 fast 到達倒數第二或最後節點時停止
  // 此時 slow 剛好在中點（偶數時偏左）
  // 與環偵測的差異：終止條件更嚴格，因為目的不同
  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}
```

---

**變體 C：分區指標（Partition / In-place Remove）**

**觸發條件**：需要「原地」（in-place, O(1) 額外空間）從序列中移除元素或重新分區，且不要求保持相對順序或要求保持。

**與對撞指標的差異**：兩指標同向移動。`readIdx`（fast）負責逐一掃描所有元素，`writeIdx`（slow）負責標記「下一個有效元素應寫入的位置」。不需要排序前提。

```javascript
/**
 * 分區指標模板 - 原地移除指定元素
 *
 * @param {number[]} nums - 數字陣列
 * @param {number} val - 要移除的值
 * @return {number} 移除後的有效長度
 *
 * 適用場景：Remove Element, Remove Duplicates from Sorted Array, Move Zeroes
 * 觸發條件：原地操作 + 移除/分區 + O(1) 空間
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1)
 */
function partition(nums, val) {
  // Step 1: Initialize — writeIdx 標記下一個有效寫入位置
  let writeIdx = 0;

  // readIdx（即 i）逐一掃描每個元素
  for (let readIdx = 0; readIdx < nums.length; readIdx++) {
    // Step 2: Evaluate — 判斷當前元素是否應保留
    if (nums[readIdx] !== val) {
      // Step 3 + 4: Move + Update — 保留元素，寫入 writeIdx 位置
      nums[writeIdx] = nums[readIdx];
      writeIdx++;
    }
    // 不保留的元素：readIdx 前進但 writeIdx 不動，等於跳過
  }

  // writeIdx 即為有效長度
  return writeIdx;
}

/**
 * 分區指標模板 - 已排序陣列去重
 *
 * @param {number[]} nums - 已排序的數字陣列
 * @return {number} 去重後的有效長度
 *
 * 適用場景：Remove Duplicates from Sorted Array
 * 觸發條件：已排序 + 原地去重
 * 與 Remove Element 的差異：判斷條件從「不等於目標值」變為「不等於前一個已寫入元素」
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1)
 */
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  // writeIdx 從 1 開始，因為第一個元素必定保留
  let writeIdx = 1;

  for (let readIdx = 1; readIdx < nums.length; readIdx++) {
    // 與前一個「已確認保留」的元素比較（而非與 readIdx-1 比較）
    // 因為已排序，只需比較相鄰即可判斷重複
    if (nums[readIdx] !== nums[writeIdx - 1]) {
      nums[writeIdx] = nums[readIdx];
      writeIdx++;
    }
  }

  return writeIdx;
}
```

---

**變體 D：合併指標（Merge）**

**觸發條件**：有兩個已排序的序列，需要合併成一個排序結果，或比較兩序列的元素。

**與對撞指標的差異**：兩個指標分別屬於不同的序列（而非同一序列的兩端），各自獨立推進。

```javascript
/**
 * 合併指標模板 - 合併兩個已排序陣列
 *
 * @param {number[]} nums1 - 已排序陣列 1
 * @param {number[]} nums2 - 已排序陣列 2
 * @return {number[]} 合併後的排序結果
 *
 * 適用場景：Merge Sorted Array, Merge Two Sorted Lists, Intersection of Two Arrays II
 * 觸發條件：兩個已排序來源 + 歸併操作
 *
 * 時間複雜度：O(n + m)
 * 空間複雜度：O(n + m) — 需要輸出陣列
 */
function merge(nums1, nums2) {
  const result = [];
  // Step 1: Initialize — 各序列一個指標
  let i = 0;
  let j = 0;

  // 終止條件：任一序列耗盡
  while (i < nums1.length && j < nums2.length) {
    // Step 2: Evaluate — 比較兩指標指向的元素
    if (nums1[i] <= nums2[j]) {
      // Step 3 + 4: Move + Update — 較小的元素加入結果，該指標前進
      result.push(nums1[i]);
      i++;
    } else {
      result.push(nums2[j]);
      j++;
    }
  }

  // 處理剩餘：將未耗盡的序列全部加入
  while (i < nums1.length) {
    result.push(nums1[i]);
    i++;
  }
  while (j < nums2.length) {
    result.push(nums2[j]);
    j++;
  }

  return result;
}
```

---

### 複雜度總結

| 變體                           | 時間複雜度 | 空間複雜度 | 備註                                   |
| ------------------------------ | ---------- | ---------- | -------------------------------------- |
| 對撞指標（Opposite Direction） | O(n)       | O(1)       | 若輸入未排序，需額外 O(n log n) 排序   |
| 快慢指標（Fast-Slow）          | O(n)       | O(1)       | 環偵測最多繞環一圈；找中點走半程       |
| 分區指標（Partition）          | O(n)       | O(1)       | 原地操作，每元素最多被寫入一次         |
| 合併指標（Merge）              | O(n + m)   | O(n + m)   | 需要輸出空間；原地合併可 O(1) 但更複雜 |

**符號定義**：

- `n`：主序列長度（或 Linked List 節點數）
- `m`：第二序列長度（合併變體）

---

## ⭐ 抽象化翻譯器

**這是最關鍵的部分——建立「問題情境 → 抽象工具」的映射能力**

### 識別核心抽象

> 這個工具的核心對象是：**序列中的兩個位置（索引或指標引用）**
>
> 它管理的是這些對象之間的什麼關係？**兩個位置的相對移動邏輯——根據當前狀態決定「移動哪個、往哪移」，以系統性地縮小搜尋空間或完成序列重組**

### 建立映射維度

| 維度     | 要回答的問題                           | 這個答案決定了什麼                                |
| -------- | -------------------------------------- | ------------------------------------------------- |
| 指標方向 | 兩個指標是相向移動還是同向移動？       | 選擇對撞 vs 快慢/分區變體                         |
| 排序前提 | 輸入是否已排序？是否可以排序？         | 排序 → 對撞/合併；未排序 → 分區/快慢/改用 HashMap |
| 操作意圖 | 找配對？偵測結構特性？原地修改？合併？ | 直接對應四個變體                                  |
| 移動條件 | 什麼比較結果觸發指標移動？             | 決定 Evaluate 步驟的邏輯                          |
| 答案形式 | 找精確匹配？最佳化？計數？             | 決定 Update Answer 的時機與方式                   |

### 實戰檢查表

```plaintext
題目:_______________

1. 指標方向：□ 相向（對撞） □ 同向（快慢/分區） □ 各自序列（合併）
2. 排序前提：□ 已排序 □ 可排序 □ 不需要排序
3. 操作意圖：□ 找配對 □ 偵測環/中點 □ 原地移除/分區 □ 合併兩序列
4. 移動條件：當 _____ 時移動 left/slow，當 _____ 時移動 right/fast
5. 答案形式：□ 精確匹配返回 □ 持續追蹤最佳 □ 計數 □ 修改後的長度

→ 選擇變體：_______________
→ 填入模板的題目特定值：Evaluate 邏輯 = _____, Move 條件 = _____
```

### 映射範例

**題目 A**：[167. Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)

| 維度     | 具體問題                                              | 抽象映射         |
| -------- | ----------------------------------------------------- | ---------------- |
| 指標方向 | 已排序陣列找兩數之和 → 可從兩端收縮                   | **對撞指標**     |
| 排序前提 | 題目保證已排序                                        | ✅ 直接適用      |
| 操作意圖 | 找 `nums[l] + nums[r] === target`                     | **找配對**       |
| 移動條件 | `sum < target` → `left++`；`sum > target` → `right--` | 單調性驅動       |
| 答案形式 | 找到即返回索引對                                      | **精確匹配返回** |

**從映射到實作的關鍵步驟**：直接套用對撞指標模板，Evaluate = `nums[left] + nums[right]`，與 `target` 比較決定移動方向。注意題目索引從 1 開始。

---

**題目 B**：[283. Move Zeroes](https://leetcode.com/problems/move-zeroes/)

| 維度     | 具體問題                                    | 抽象映射             |
| -------- | ------------------------------------------- | -------------------- |
| 指標方向 | 把 0 移到後面、非 0 保持相對順序            | **同向（分區指標）** |
| 排序前提 | 不需要排序                                  | N/A                  |
| 操作意圖 | 原地將非 0 元素覆寫到前方                   | **原地分區**         |
| 移動條件 | `nums[readIdx] !== 0` 時寫入並推進 writeIdx | 條件篩選             |
| 答案形式 | 覆寫後將剩餘位置填 0                        | **原地修改**         |

**從映射到實作的關鍵步驟**：套用分區指標模板，`val = 0`。額外步驟：覆寫完成後，`writeIdx` 到 `n-1` 的位置全部填 0。

---

## 🔍 觸發器(模式識別)

### 正向觸發器

| 層級     | 特徵                                    | 為什麼這個特徵指向這個演算法             |
| -------- | --------------------------------------- | ---------------------------------------- |
| 關鍵字   | "sorted array" + "find pair/triplet"    | 排序 + 配對 = 對撞指標經典場景           |
| 關鍵字   | "in-place"、"O(1) extra space"          | 原地操作暗示用指標覆寫而非額外空間       |
| 關鍵字   | "cycle detection"、"linked list middle" | 快慢指標的專屬領域                       |
| 結構     | 輸入是已排序的陣列或 Linked List        | 排序提供單調性，Linked List 提供指標結構 |
| 目標     | 找兩元素滿足某關係（和、差、乘積）      | 兩個位置 + 關係 → 兩個指標               |
| 操作模式 | 從兩端向中間收縮搜尋範圍                | 對撞指標的定義行為                       |
| 操作模式 | 原地移除/移動/去重                      | 分區指標的定義行為                       |
| 約束     | n ≤ 10⁵ 且需要 O(n) 或 O(n log n)       | 暴力 O(n²) 超時，Two Pointers 提供 O(n)  |
| 約束     | 空間限制 O(1)                           | 排除 HashMap/額外陣列等方案              |

**一句話觸發規則**：當問題涉及**已排序序列上的配對搜尋**、**鏈結結構的速度差探測**、或**原地序列重組**時，優先考慮 Two Pointers。

### 反向觸發器

| 陷阱情境                      | 為什麼不適用                                        | 更好的選擇                                  |
| ----------------------------- | --------------------------------------------------- | ------------------------------------------- |
| 未排序陣列找兩數之和          | 沒有單調性，無法判斷移動方向                        | HashMap O(n) 查找（如 LeetCode 1. Two Sum） |
| 需要找「連續子序列」滿足條件  | Two Pointers 管理的是「兩個獨立位置」，不是「區間」 | Sliding Window（專門管理連續區間）          |
| 需要考慮所有子集/排列         | 搜尋空間是指數級的，線性掃描不夠                    | Backtracking / DP                           |
| 序列中有負數且求 subarray sum | 加入負數破壞了「移動 right 使 sum 增大」的單調性    | Prefix Sum + HashMap                        |
| 需要找第 k 大/小的配對        | 不能簡單地從兩端收縮                                | Binary Search on answer / Heap              |

### 與類似工具的決策點

```plaintext
線性序列上找滿足條件的元素組合
├── 找「連續子序列」→ Sliding Window（管理連續區間）
├── 找「任意兩元素配對」
│   ├── 已排序 → Two Pointers — 對撞型（O(n), O(1) space）
│   └── 未排序
│       ├── 可以排序且不影響答案 → 排序 + Two Pointers（O(n log n)）
│       └── 需要原始索引 → HashMap（O(n), O(n) space）
├── 找「三元素/多元素」
│   └── 排序 + 外層迴圈 + 內層 Two Pointers（O(n²)）
├── 原地移除/重組
│   └── Two Pointers — 分區型（O(n), O(1) space）
├── 鏈結結構的環/中點
│   └── Two Pointers — 快慢型（O(n), O(1) space）
└── 合併兩個已排序序列
    └── Two Pointers — 合併型（O(n + m)）
```

---

## ⚠️ 注意事項

### 常見陷阱

| 陷阱                 | 錯誤寫法                             | 正確寫法                                                                                | 為什麼                                            |
| -------------------- | ------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 忘記排序前提         | 對未排序陣列直接用對撞指標           | 先確認已排序，或先排序                                                                  | 未排序時移動方向不確定，會遺漏答案                |
| 3Sum 重複答案        | 找到答案後直接 `left++; right--`     | 找到後用 while 跳過重複值：`while (left < right && nums[left] === nums[left-1]) left++` | 相同值會產出重複三元組                            |
| 快慢指標終止條件寫錯 | `while (fast.next !== null)`         | `while (fast !== null && fast.next !== null)`                                           | 若 fast 本身為 null，存取 fast.next 會報錯        |
| 分區覆寫遺漏         | 移除元素後忘記填充剩餘位置           | Move Zeroes 需要在 writeIdx 之後填 0                                                    | 否則尾部殘留舊值                                  |
| 對撞指標邊界         | `while (left <= right)` 用於配對搜尋 | `while (left < right)`                                                                  | 配對需要兩個不同元素，`left === right` 時只剩一個 |
| 合併指標忘記處理剩餘 | 只寫 `while (i < n && j < m)`        | 結束後還要處理未耗盡的序列                                                              | 否則丟失元素                                      |

### 常見變體

| 變體                          | 修改內容                                                      | 適用場景                                        |
| ----------------------------- | ------------------------------------------------------------- | ----------------------------------------------- |
| 對撞 + 去重                   | 在移動指標時用 while 跳過重複值                               | 3Sum、4Sum 等需要去重的配對搜尋                 |
| 對撞 + 面積/距離              | Evaluate 邏輯改為面積或距離計算                               | Container With Most Water、Trapping Rain Water  |
| 快慢 + 找環入口               | 相遇後重置 slow 到 head，兩者同速前進至再次相遇               | Linked List Cycle II、Find the Duplicate Number |
| 分區 + 保持順序               | writeIdx 從 1 開始，比較 `nums[readIdx] !== nums[writeIdx-1]` | Remove Duplicates from Sorted Array             |
| 分區 + swap                   | 不覆寫而是交換 `nums[writeIdx]` 與 `nums[readIdx]`            | Move Zeroes（保留 0 在後方）                    |
| 三指標（Dutch National Flag） | 用 low, mid, high 三個指標分三區                              | Sort Colors（0/1/2 三值分區）                   |
