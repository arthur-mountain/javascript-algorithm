/**
 * Insertion Sort - 將每個元素插入已排序區的正確位置
 *
 * @param {number[]} arr - 待排序陣列
 * @param {number} lo - 排序範圍左邊界（包含），預設 0
 * @param {number} hi - 排序範圍右邊界（包含），預設 arr.length - 1
 * @return {number[]} 排序後的陣列（in-place 修改）
 *
 * 適用場景：幾乎已排序的資料、小資料量、作為其他排序的子程式
 * 觸發條件：資料量小（n ≤ 50）或逆序對數量少
 *
 * 時間複雜度：O(n²) average/worst, O(n) best（已排序）
 * 空間複雜度：O(1)
 * 穩定性：穩定（只在嚴格大於時平移）
 */
function insertionSort(arr, lo = 0, hi = arr.length - 1) {
  for (let i = lo + 1; i <= hi; i++) {
    // Step 1: 取出待插入的元素（像從牌堆抽一張牌）
    const key = arr[i];
    let j = i - 1;

    // Step 2: 在已排序區 [lo, i-1] 中從右到左找插入位置
    // 用 shift（平移）而非 swap → 賦值次數從 3n 降到 n+1
    // 嚴格大於才移動 → 相等元素保持原始順序 → 穩定
    while (j >= lo && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    // Step 3: 插入正確位置
    // 為什麼是 j+1？→ 迴圈結束時 arr[j] <= key 或 j < lo，插入點在 j 的右邊
    arr[j + 1] = key;
  }

  return arr;
}

module.exports = { insertionSort };
