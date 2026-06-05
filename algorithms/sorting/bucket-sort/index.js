// 桶內排序復用 Insertion Sort（Single Source of Truth：不重複實作一份）
const { insertionSort } = require("../insertion-sort");

/**
 * Bucket Sort - 分桶 + 桶內排序 + 串接
 *
 * @param {number[]} arr - 待排序陣列
 * @param {number} bucketCount - 桶的數量（預設為 arr.length）
 * @return {number[]} 排序後的新陣列
 *
 * 適用場景：資料均勻分佈、浮點數排序
 * 觸發條件：已知資料分佈大致均勻，且值域可預測
 *
 * 前提條件：資料分佈越均勻效果越好
 * 違反時（極度不均）：所有元素落入同一個桶 → 退化為桶內排序的複雜度 O(n²)
 *
 * 時間複雜度：O(n + k) average（均勻分佈），O(n²) worst
 * 空間複雜度：O(n + k)，k = 桶數
 * 穩定性：穩定（若桶內排序是穩定的，此處用 Insertion Sort）
 */
function bucketSort(arr, bucketCount = arr.length) {
  if (arr.length <= 1) return [...arr];

  const n = arr.length;
  const max = Math.max(...arr);
  const min = Math.min(...arr);

  // 所有元素相同 → 已排序
  if (max === min) return [...arr];

  // Step 1: 建立空桶
  const buckets = Array.from({ length: bucketCount }, () => []);

  // Step 2: 分配元素到對應的桶
  // 映射公式保證值域 [min, max] 均勻映射到 [0, bucketCount-1]
  // 易錯點：(max - min + 1) 而非 (max - min)，避免 val === max 時 bucketIdx 越界
  for (let i = 0; i < n; i++) {
    const bucketIdx = Math.floor(
      ((arr[i] - min) / (max - min + 1)) * bucketCount,
    );
    buckets[bucketIdx].push(arr[i]);
  }

  // Step 3: 桶內排序 + Step 4: 按桶順序串接
  // 桶內用 Insertion Sort：桶內元素少時 O(k²) ≈ O(1)，且穩定
  const result = [];
  for (const bucket of buckets) {
    insertionSort(bucket);
    for (const val of bucket) {
      result.push(val);
    }
  }

  return result;
}

module.exports = { bucketSort };
