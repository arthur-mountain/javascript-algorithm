/**
 * Quick Sort (Lomuto Partition) - 以 pivot 分割，遞迴排序兩半
 *
 * @param {number[]} arr - 待排序陣列
 * @param {number} lo - 左邊界（包含）
 * @param {number} hi - 右邊界（包含）
 * @return {number[]} 排序後的陣列（in-place 修改）
 *
 * 適用場景：通用排序、不需要穩定性
 * 觸發條件：通用排序首選（實務中常數因子最小），可接受不穩定
 *
 * 時間複雜度：O(n log n) average, O(n²) worst
 * 空間複雜度：O(log n) 遞迴堆疊（average），O(n) worst
 * 穩定性：不穩定
 */
function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;

  const pivotIdx = lomutoPartition(arr, lo, hi);

  // 與 Merge Sort 的差異：partition 後 pivot 已在最終位置
  // 因此遞迴不包含 pivotIdx 本身
  quickSort(arr, lo, pivotIdx - 1);
  quickSort(arr, pivotIdx + 1, hi);

  return arr;
}

/**
 * Lomuto Partition
 * 選擇 arr[hi] 為 pivot（隨機化後交換到末端）
 *
 * 不變量：arr[lo..i] < pivot, arr[i+1..j-1] >= pivot, arr[hi] = pivot
 *
 * @return {number} pivot 的最終索引
 */
function lomutoPartition(arr, lo, hi) {
  // 隨機化 pivot：避免已排序資料的最差情況 O(n²)
  // 易錯點：不隨機化時，已排序/逆序陣列每次選到最大/最小值 → 退化為 O(n²)
  const randomIdx = lo + Math.floor(Math.random() * (hi - lo + 1));
  [arr[randomIdx], arr[hi]] = [arr[hi], arr[randomIdx]];

  const pivot = arr[hi];
  let i = lo - 1; // i 是「< pivot 區域」的右邊界

  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // 把 pivot 放到分界點
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  return i + 1;
}

/**
 * Quick Sort (3-Way Partition) - 將陣列分為 < pivot, = pivot, > pivot 三區
 *
 * @param {number[]} arr - 待排序陣列
 * @param {number} lo - 左邊界
 * @param {number} hi - 右邊界
 * @return {number[]} 排序後的陣列（in-place 修改）
 *
 * 適用場景：大量重複元素
 * 觸發條件：元素重複率高，標準 Lomuto/Hoare partition 退化時
 *
 * 與 Lomuto 的差異：相等元素不再參與後續遞迴，重複多時從 O(n²) 優化到接近 O(n)
 *
 * 時間複雜度：O(n log n) average, O(n) 當所有元素相同, O(n²) worst（用 arr[lo] 為 pivot，已排序資料退化）
 * 空間複雜度：O(log n) average, O(n) worst（遞迴堆疊深度）
 * 穩定性：不穩定
 */
function quickSort3Way(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;

  // Dutch National Flag partition
  // 維護三個區域：[lo, lt) < pivot, [lt, gt] = pivot, (gt, hi] > pivot
  const pivot = arr[lo];
  let lt = lo,
    i = lo + 1,
    gt = hi;

  while (i <= gt) {
    if (arr[i] < pivot) {
      [arr[i], arr[lt]] = [arr[lt], arr[i]];
      lt++;
      i++;
    } else if (arr[i] > pivot) {
      [arr[i], arr[gt]] = [arr[gt], arr[i]];
      gt--;
      // 易錯點：i 不前進，因為從 gt 換過來的元素還沒檢查
    } else {
      i++; // arr[i] === pivot，留在中間區
    }
  }

  // 等於 pivot 的元素（arr[lt..gt]）已在最終位置
  // 只需遞迴處理嚴格小於和嚴格大於的部分
  quickSort3Way(arr, lo, lt - 1);
  quickSort3Way(arr, gt + 1, hi);

  return arr;
}

module.exports = { quickSort, lomutoPartition, quickSort3Way };
