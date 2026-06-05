/**
 * Counting Sort - 用計數陣列統計頻率，再用前綴和定位
 *
 * @param {number[]} arr - 待排序陣列（整數，透過 min 偏移支援負數）
 * @return {number[]} 排序後的新陣列
 *
 * 適用場景：整數、值域不大（k ≈ O(n)）
 * 觸發條件：已知值域有限且較小，需要線性時間排序
 *
 * 前提條件：元素為整數（負數經 min 偏移到非負索引，已內建處理）
 * 違反時：值域 k >> n 時空間浪費嚴重，應改用 comparison-based 排序
 *
 * 時間複雜度：O(n + k)，k = max(arr) - min(arr) + 1
 * 空間複雜度：O(n + k)
 * 穩定性：穩定（反向遍歷 + 前綴和）
 */
function countingSort(arr) {
  if (arr.length <= 1) return [...arr];

  const n = arr.length;
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1; // 處理負數：偏移到 [0, range)

  // Step 1: 計數 — 統計每個值出現幾次
  const count = new Array(range).fill(0);
  for (let i = 0; i < n; i++) {
    count[arr[i] - min]++; // 偏移處理：arr[i] - min 保證索引 >= 0
  }

  // Step 2: 前綴和 — count[i] = 值 ≤ (i + min) 的元素總數
  // 前綴和的意義：告訴我們值為 (i + min) 的元素，其最終位置是 count[i] - 1
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }

  // Step 3: 反向遍歷原陣列，將每個元素放到正確位置
  // 為什麼反向？→ 保證穩定性
  // 若正向遍歷，同值的後出現元素會被放到更前面的位置，破壞原始順序
  const output = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    const idx = arr[i] - min;
    output[count[idx] - 1] = arr[i];
    count[idx]--; // 下一個相同值的元素放在前一個位置
  }

  return output;
}

module.exports = { countingSort };
