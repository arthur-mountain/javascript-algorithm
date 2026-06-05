/**
 * Shell Sort - 帶間距的 Insertion Sort，逐步縮小間距
 *
 * @param {number[]} arr - 待排序陣列
 * @return {number[]} 排序後的陣列（in-place 修改）
 *
 * 適用場景：中等資料量、嵌入式環境、需要比 O(n²) 好但不需要 O(n log n) 保證
 * 觸發條件：資料量中等 + 記憶體有限 + 程式碼簡潔需求
 *
 * 時間複雜度：取決於 gap sequence
 *  - Shell (n/2, n/4, ..., 1): O(n²) worst
 *  - Knuth (1, 4, 13, 40, ...): O(n^(3/2)) worst
 *  - Sedgewick: O(n^(4/3)) worst
 * 空間複雜度：O(1)
 * 穩定性：不穩定（大間距交換破壞相等元素的相對順序）
 */
function shellSort(arr) {
  const n = arr.length;

  // 使用 Knuth gap sequence: 1, 4, 13, 40, 121, ...
  // 公式：gap = (3^k - 1) / 2，取不超過 n/3 的最大值
  // 為什麼 Knuth 比 Shell 序列好？→ Shell 序列的 gap 都是偶數的倍數，
  // 導致奇偶位置的元素直到 gap=1 才互動；Knuth 序列避免了此問題
  let gap = 1;
  while (gap < Math.floor(n / 3)) {
    gap = gap * 3 + 1;
  }

  while (gap >= 1) {
    // 對每個 gap 做 Insertion Sort
    // 與標準 Insertion Sort 的唯一差異：步長從 1 變為 gap
    for (let i = gap; i < n; i++) {
      const key = arr[i];
      let j = i - gap;

      while (j >= 0 && arr[j] > key) {
        arr[j + gap] = arr[j]; // 平移 gap 個位置
        j -= gap;
      }

      arr[j + gap] = key;
    }

    // 縮小間距：gap 序列的逆向遍歷
    gap = Math.floor(gap / 3);
  }

  return arr;
}

module.exports = { shellSort };
