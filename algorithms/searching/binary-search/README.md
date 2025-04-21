# 二分搜尋區間變化的關鍵概念

1. **區間表示法**

   - **閉區間** `[left, right]`: 兩端點都包含。

   - **半開區間** `[left, right)`: 包含左端點，不包含右端點。

   - **影響**: 選擇哪種表示法會影響邊界更新方式。

2. **核心目標**

   - 每次比較後，刪去不可能包含答案的部分區間。

   - 確保剩下的區間在每次迭代後都縮小，直到最後只剩下一個位置(`left == right` 或 `left > right`)。

3. **邊界更新邏輯**

   - 當條件符合(如目標在右側)時，需要更新 `left` 或 `right`。

   - 更新邊界的核心在於「是否包含 `mid`」:

     - 如果答案可能包含 `mid`，就保留 `mid`。

     - 如果答案不包含 `mid`，就排除 `mid`。

---

## **標準二分搜尋 (精確匹配) 的區間變化**

### **區間: 閉區間 `[left, right]`**

**核心邏輯**:

1. 初始區間 `[0, nums.length - 1]`。

2. 計算中點 `mid = Math.floor((left + right) / 2)`。

   P.S. 當 left 和 right 的數值很大的時候。為了避免避免數字溢位，可以使用以下更安全的寫法:

   `mid = left + Math.floor((right - left) / 2);`

3. 比較 `nums[mid]` 和 `target`:

   - 如果 `nums[mid] == target`，返回 `mid`。

   - 如果 `nums[mid] < target`，目標在右側，移動左邊界 `left = mid + 1`。

   - 如果 `nums[mid] > target`，目標在左側，移動右邊界 `right = mid - 1`。

**區間變化圖**:

| Iteration | Initial `[left, right]` | `mid` | 比較 `nums[mid]` 和 `target` | 新的區間 `[left, right]` |
| --------- | ----------------------- | ----- | ---------------------------- | ------------------------ |
| 1         | [0, 6]                  | 3     | `nums[3] > target`           | [0, 2]                   |
| 2         | [0, 2]                  | 1     | `nums[1] < target`           | [2, 2]                   |
| 3         | [2, 2]                  | 2     | `nums[2] == target`          | 返回 2                   |

**程式碼**:

```javascript
function binarySearch(nums, target) {
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) {
      return mid; // 找到目標
    } else if (nums[mid] < target) {
      left = mid + 1; // 移動左邊界
    } else {
      right = mid - 1; // 移動右邊界
    }
  }

  return -1; // 未找到
}
```

---

## **查找左側界限 (Lower Bound) 的區間變化**

### **區間: 半開區間 `[left, right)`**

**核心邏輯**:

1. 初始區間 `[0, nums.length]`。

2. 每次比較後，嘗試找到「第一個大於等於 `target` 的索引」。

   - 如果 `nums[mid] >= target`，答案可能是 `mid`，移動右邊界 `right = mid`。

   - 如果 `nums[mid] < target`，答案一定在右側，移動左邊界 `left = mid + 1`。

3. 最後返回 `left`。

**區間變化圖**:

| Iteration | Initial `[left, right)` | `mid` | 比較 `nums[mid]` 和 `target` | 新的區間 `[left, right)` |
| --------- | ----------------------- | ----- | ---------------------------- | ------------------------ |
| 1         | [0, 6)                  | 3     | `nums[3] >= target`          | [0, 3)                   |
| 2         | [0, 3)                  | 1     | `nums[1] < target`           | [2, 3)                   |
| 3         | [2, 3)                  | 2     | `nums[2] >= target`          | [2, 2)                   |

**程式碼**:

```javascript
function lowerBound(nums, target) {
  let left = 0,
    right = nums.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] >= target) {
      right = mid; // 收縮右邊界
    } else {
      left = mid + 1; // 收縮左邊界
    }
  }

  return left; // 第一個滿足條件的位置
}
```

## **查找右側界限 (Upper Bound) 的區間變化**

### **區間: 半開區間 `[left, right)`**

**核心邏輯**:

1. 初始設定區間為 `[0, nums.length)`。

2. 每次比較 `nums[mid]` 與 `target`，目標是找出「**最後一個小於等於 `target` 的索引**」。

   - 如果 `nums[mid] <= target`，表示目前這個位置 `mid` 符合條件，**但還可能有更後面的符合項目**，因此將左邊界右移: `left = mid + 1`。

   - 如果 `nums[mid] > target`，表示 `mid` 已超出目標範圍，**答案一定在左側**，因此縮小右邊界: `right = mid`。

3. 迴圈結束後，`left` 會落在「第一個大於 `target` 的位置」，因此最終答案為 `left - 1`，即最後一個小於等於 `target` 的索引。

### 小提醒

- 如果真的是在找「upper bound 的位置」(也就是第一個 > target 的索引)，那回傳 `left` 即可，不需要減 1。

**區間變化圖**:

| Iteration | Initial `[left, right)` | `mid` | 比較 `nums[mid]` 和 `target` | 新的區間 `[left, right)` |
| --------- | ----------------------- | ----- | ---------------------------- | ------------------------ |
| 1         | [0, 6)                  | 3     | `nums[3] <= target`          | [4, 6)                   |
| 2         | [4, 6)                  | 5     | `nums[5] > target`           | [4, 5)                   |
| 3         | [4, 5)                  | 4     | `nums[4] <= target`          | [5, 5)                   |

**程式碼**:

```javascript
function upperBound(nums, target) {
  let left = 0,
    right = nums.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] <= target) {
      left = mid + 1; // 收縮左邊界
    } else {
      right = mid; // 收縮右邊界
    }
  }

  return left - 1; // 最後一個滿足條件的位置
}
```

## **小結與對比**

| **問題類型**           | **更新邊界**                          | **終止條件**    | **返回值**                         |
| ---------------------- | ------------------------------------- | --------------- | ---------------------------------- |
| 標準二分搜尋           | `left = mid + 1` 或 `right = mid - 1` | `left > right`  | 找到索引或 `-1`                    |
| 左側界限 (Lower Bound) | `right = mid` 或 `left = mid + 1`     | `left == right` | 第一個滿足條件的索引               |
| 右側界限 (Upper Bound) | `left = mid + 1` 或 `right = mid`     | `left == right` | 最後一個滿足條件的索引(`left - 1`) |

核心是「**如何處理 `mid`**」以及「**是否保留 `mid` 所屬的區間**」。

透過具體問題逐步模擬，就能清楚理解區間的變化。
