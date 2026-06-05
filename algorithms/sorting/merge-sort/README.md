# Merge Sort（合併排序）

把陣列分成兩半，各自排好後再合併成一副有序的牌。分治法（Divide and Conquer）的代表。

本目錄含兩個變體：標準版 `mergeSort` 與 in-place 版 `mergeSortInPlace`。

## 觸發條件

需要穩定的 O(n log n) 排序、Linked List 排序、外部排序（穩定性是硬需求，或資料存取模式為順序存取）。

## 運作流程（執行期）

1. **Divide**：將陣列從中間一分為二。
2. **Conquer**：遞迴排序左右兩半。
3. **Merge**：雙指標逐一比較，合併兩個已排序的子陣列。

## 逐步範例

`input = [5, 2, 4, 1]`

**Divide（遞迴往下切）**：

```
        [5, 2, 4, 1]
        /          \
     [5, 2]       [4, 1]
     /   \        /   \
   [5]   [2]    [4]   [1]
```

**Conquer + Merge（回程逐層合併）**：

- merge `[5]`,`[2]` → 比 5 vs 2，取 2 再取 5 → `[2, 5]`
- merge `[4]`,`[1]` → 比 4 vs 1，取 1 再取 4 → `[1, 4]`
- merge `[2, 5]`,`[1, 4]`：

  | 比較   | 取出 | result       |
  | ------ | ---- | ------------ |
  | 2 vs 1 | 1    | [1]          |
  | 2 vs 4 | 2    | [1, 2]       |
  | 5 vs 4 | 4    | [1, 2, 4]    |
  | 左剩 5 | 5    | [1, 2, 4, 5] |

**穩定性示意**：若改成 merge `[2a]`,`[2b]`（值相等），用 `left[i] <= right[j]` 會先取左半的 `2a`，保留原始相對順序；若寫成 `<` 則先取 `2b` → 不穩定。

## 關鍵洞察

「重活」在 merge 步驟。每層遞迴的 merge 總共處理 n 個元素，遞迴深度為 log n 層，故 T(n) = O(n log n)。

**穩定性的關鍵**：merge 時相等元素取左半的（`left[i] <= right[j]`）。

```javascript
// <= 而非 < → 相等時優先取左邊 → 穩定
if (left[i] <= right[j]) result.push(left[i++]);
else result.push(right[j++]);
```

## 變體：In-place（減少記憶體分配）

標準版每層遞迴用 `slice` 產生新陣列（共 O(n log n) 額外分配）。`mergeSortInPlace` 改用索引範圍 + 單一共享 `temp` 陣列，額外空間固定為 O(n)；並加上「左半最大值 ≤ 右半最小值就跳過 merge」的優化，對幾乎有序的資料顯著減少 merge 操作。

## 複雜度

| 變體     | Best       | Average    | Worst      | 空間 | 穩定 | In-place |
| -------- | ---------- | ---------- | ---------- | ---- | ---- | -------- |
| 標準     | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅   | ❌       |
| In-place | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅   | ❌       |

唯一穩定的 O(n log n) comparison sort。In-place 版複雜度相同，但共用 temp 省去遞迴 slice 的額外分配。

## 常見陷阱

- merge 用 `left[i] < right[j]`（漏了等號）→ 相等元素從右半先進，破壞穩定性。

## 常見變體

- **Bottom-Up**：用迭代取代遞迴，從大小 1 開始逐步合併，避免遞迴堆疊溢位。
- **Timsort**：Merge Sort + Insertion Sort + 利用 natural runs（Python/Java 內建排序）。
