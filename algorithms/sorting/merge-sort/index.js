/**
 * Merge Sort - 分治法：分成兩半各自排序後合併
 *
 * @param {number[]} arr - 待排序陣列
 * @return {number[]} 排序後的新陣列（非 in-place，每次遞迴產生新陣列）
 *
 * 適用場景：需要穩定排序、Linked List 排序、外部排序
 * 觸發條件：穩定性是硬需求，或資料存取模式為順序存取（非隨機存取）
 *
 * 時間複雜度：O(n log n) 所有情況（best = worst = average）
 * 空間複雜度：O(n)（輔助陣列）
 * 穩定性：穩定（merge 時相等元素取左半的）
 */
function mergeSort(arr) {
  // Base case：長度 ≤ 1 已排序
  if (arr.length <= 1) return arr;

  // Step 1: Divide — 從中間切開
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  // Step 2: Merge — 合併兩個已排序陣列
  return merge(left, right);
}

/**
 * 合併兩個已排序陣列（雙指標法）
 *
 * @param {number[]} left - 已排序的左半陣列
 * @param {number[]} right - 已排序的右半陣列
 * @return {number[]} 合併後的已排序陣列
 *
 * 關鍵：相等時取左半的元素（left[i] <= right[j]），保證穩定性
 * 複雜度來源：每個元素恰好被比較和移動一次 → O(n)
 */
function merge(left, right) {
  const result = [];
  let i = 0,
    j = 0;

  while (i < left.length && j < right.length) {
    // <= 而非 < → 相等時優先取左邊 → 穩定
    // 與 Bubble Sort 穩定性的保證方式相同：相等不換位
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  // 收集剩餘元素（其中一邊已空，另一邊直接追加）
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}

/**
 * Merge Sort (In-place 版) - 使用索引範圍避免 slice 產生新陣列
 *
 * @param {number[]} arr - 待排序陣列
 * @param {number[]} temp - 輔助陣列（與 arr 等長，外部傳入避免重複建立）
 * @param {number} lo - 左邊界（包含）
 * @param {number} hi - 右邊界（包含）
 * @return {number[]} 排序後的陣列（in-place 修改原陣列）
 *
 * 與標準版的差異：避免 slice 在每層遞迴產生 O(n) 的新陣列（共 O(n log n) 額外分配）
 * 此版本只用一個共享的 temp 陣列，額外空間固定為 O(n)
 *
 * 時間複雜度：O(n log n)
 * 空間複雜度：O(n)（temp 陣列）
 */
function mergeSortInPlace(arr, temp = [...arr], lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;

  const mid = lo + Math.floor((hi - lo) / 2);
  mergeSortInPlace(arr, temp, lo, mid);
  mergeSortInPlace(arr, temp, mid + 1, hi);

  // 優化：若左半的最大值 ≤ 右半的最小值，已自然有序，跳過 merge
  // 此情境在「幾乎有序」的資料上可顯著減少 merge 操作
  if (arr[mid] <= arr[mid + 1]) return arr;

  mergeInPlace(arr, temp, lo, mid, hi);
  return arr;
}

/**
 * In-place merge：用 temp 暫存再寫回 arr
 */
function mergeInPlace(arr, temp, lo, mid, hi) {
  for (let k = lo; k <= hi; k++) temp[k] = arr[k];

  let i = lo,
    j = mid + 1;

  for (let k = lo; k <= hi; k++) {
    if (i > mid)
      arr[k] = temp[j++]; // 左半已用完
    else if (j > hi)
      arr[k] = temp[i++]; // 右半已用完
    else if (temp[i] <= temp[j])
      arr[k] = temp[i++]; // 穩定性：<=
    else arr[k] = temp[j++];
  }
}

module.exports = { mergeSort, merge, mergeSortInPlace, mergeInPlace };
