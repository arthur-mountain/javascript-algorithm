/**
 * Selection Sort - 每輪從未排序區選出最小值，放到已排序區末端
 *
 * @param {number[]} arr - 待排序陣列
 * @return {number[]} 排序後的陣列（in-place 修改）
 *
 * 適用場景：交換成本高（如大型物件）、小資料量
 * 觸發條件：需要最少交換次數（恰好 n-1 次）
 *
 * 時間複雜度：O(n²) 所有情況（best = worst = average）
 * 空間複雜度：O(1)
 * 穩定性：不穩定（交換可能跳過相等元素）
 */
function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    // Step 1: 假設未排序區第一個為最小值
    let minIdx = i;

    // Step 2: 在未排序區 [i+1, n-1] 中找真正的最小值索引
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    // Step 3: 將最小值交換到已排序區的末端
    // 與 Bubble Sort 的差異：每輪只做一次交換（O(n) swaps total）
    // 不穩定的原因：例如 [5a, 5b, 3]，第一輪 5a 與 3 交換變成 [3, 5b, 5a]，5a 和 5b 順序改變
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }

  return arr;
}

module.exports = { selectionSort };
