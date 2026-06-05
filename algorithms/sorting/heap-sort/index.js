/**
 * Heap Sort - 建立 Max-Heap 後，反覆取出最大值放到末端
 *
 * @param {number[]} arr - 待排序陣列
 * @return {number[]} 排序後的陣列（in-place 修改）
 *
 * 適用場景：需要 O(n log n) 最差情況保證 + in-place
 * 觸發條件：不能接受 Quick Sort 的 O(n²) 最差情況，且不需要穩定性
 *
 * 時間複雜度：O(n log n) 所有情況
 *  - Build heap: O(n)（非直覺的，因為大部分節點在底層，heapify 距離短）
 *  - n 次 extractMax: O(n log n)
 * 空間複雜度：O(1)（in-place，迭代版 heapify）
 * 穩定性：不穩定（堆頂與末端交換破壞相等元素順序）
 */
function heapSort(arr) {
  const n = arr.length;

  // Step 1: Build Max-Heap
  // 從最後一個非葉節點開始向上 heapify
  // 最後一個非葉節點 = floor(n/2) - 1
  // 為什麼從下往上？→ heapify 假設左右子樹已是 heap，由下往上才能保證此前提
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Step 2: 逐一取出最大值放到末端
  for (let i = n - 1; i > 0; i--) {
    // 堆頂（最大值）與當前末端交換
    [arr[0], arr[i]] = [arr[i], arr[0]];

    // 縮小 heap 範圍（排除已就位的最大值），重新維護 heap 性質
    // 易錯點：heapSize 必須是 i（而非 n），否則已排序的元素會被破壞
    heapify(arr, i, 0);
  }

  return arr;
}

/**
 * Max-Heapify（迭代版）：確保以 idx 為根的子樹滿足 Max-Heap 性質
 *
 * @param {number[]} arr - 陣列
 * @param {number} heapSize - 當前 heap 的有效範圍
 * @param {number} idx - 要下沉的節點索引
 *
 * 複雜度來源：最多下沉 O(log n) 層
 */
function heapify(arr, heapSize, idx) {
  // 使用迭代而非遞迴，避免遞迴堆疊開銷 → 空間 O(1)
  while (true) {
    let largest = idx;
    const left = 2 * idx + 1;
    const right = 2 * idx + 2;

    if (left < heapSize && arr[left] > arr[largest]) largest = left;
    if (right < heapSize && arr[right] > arr[largest]) largest = right;

    // 若最大值就是當前節點 → heap 性質已滿足，停止
    if (largest === idx) break;

    // 否則交換並繼續下沉
    [arr[idx], arr[largest]] = [arr[largest], arr[idx]];
    idx = largest;
  }
}

module.exports = { heapSort, heapify };
