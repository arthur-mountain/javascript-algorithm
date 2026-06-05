/**
 * Bubble Sort - 反覆比較相鄰元素，將最大值逐輪「冒泡」到末端
 *
 * @param {number[]} arr - 待排序陣列
 * @return {number[]} 排序後的陣列（in-place 修改）
 *
 * 適用場景：教學、資料幾乎已排序、小資料量
 * 觸發條件：需要最簡單的排序實作 + 可能提前終止
 *
 * 時間複雜度：O(n²) average/worst, O(n) best（已排序 + early termination）
 * 空間複雜度：O(1)
 * 穩定性：穩定（相等元素不交換）
 */
function bubbleSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    // Step 1: 設定交換偵測旗標
    let swapped = false;

    // Step 2: 相鄰比較 + 交換
    // 每輪結束後，arr[n-1-i] 已是正確位置的最大值
    // 因此內層只需比較到 n - 1 - i（已排序區不再參與）
    for (let j = 0; j < n - 1 - i; j++) {
      // 嚴格大於才交換 → 相等元素保持原始順序 → 穩定
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // Step 3: 若本輪沒有交換 → 已完全排序，提前終止
    // 這是 Bubble Sort 的唯一優勢：best case O(n)
    if (!swapped) break;
  }

  return arr;
}

module.exports = { bubbleSort };
