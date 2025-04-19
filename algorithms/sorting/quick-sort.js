const input = [8, 9, 6, 3, 11, 25, 32, 2, 1];

/**
 * # 快速排序
 * 以【一個值為基準(pivot)】進行拆分，
 *【比 pivot 小就放到前面】(比基準值小的小陣列)，
 *【比 pivot 大就放到後面】(比基準值大的小陣列)，
 * 直到陣列中都只剩一個元素後即排序完畢。
 *
 * # 複雜度
 * - Time  : O(nlogn)
 * - Space : O(n)
 * - 穩定性: 穩定排序（相等元素不會換位置）
 * Functions       | 使用方式      | Partition 方式           | 空間複雜度 | 適合用途
 * quickSortSimple | 遞迴 + slice  | 無實際分割，只用左右陣列 | O(n)       | 教學、理解基本 quick sort
 * quickSortLomuto | in-place 遞迴 | Lomuto（首元素為 pivot） | O(1)       | LeetCode、簡潔好懂
 * quickSortHoare  | in-place 遞迴 | Hoare（中間為 pivot）    | O(1)       | 效能最佳、實務推薦
 *
 * # 範例: input -> [8, 9, 6, 3, 1]
 *
 * 1. quickSortSimple
 *    第一輪 quickSortSimple
 *     pivot = 8
 *     ary = [9, 6, 3, 1]
 *
 *     forEach 遍歷 ary:
 *       9 > 8 → 放進 right
 *       6 < 8 → 放進 left
 *       3 < 8 → 放進 left
 *       1 < 8 → 放進 left
 *
 *     left = [6, 3, 1]
 *     right = [9]
 *
 *    回傳值為：
 *     [...quickSortSimple([6, 3, 1]), 8, ...quickSortSimple([9])]
 *        ↓ 遞迴處理 left 和 right
 *
 *    最終結果： [1, 3, 6, 8, 9]
 *
 *  2. quickSortLomuto(以 array[start] 當 pivot)
 *     第一輪的 _quickSort
 *     partition 函式，start = 0, end = 4 ，pivot 為 array[start] = 8
 *       i = 1 , splitIdx = 1, 9 < 8 → false，不交換 → [8, 9, 6, 3, 1]
 *       i = 2 , splitIdx = 1, 6 < 8 → true，交換 [8,「6」,「9」, 3, 1], splitIdx++
 *       i = 3 , splitIdx = 2, 3 < 8 → true，交換 [8, 6,「3」,「9」, 1], splitIdx++
 *       i = 4 , splitIdx = 3, 1 < 8 → true，交換 [8, 6, 3,「1」,「9」], splitIdx++
 *
 *       結束迴圈後 splitIdx = 4，代表 index 0 ~ 3 都是比 pivot 小的值
 *       將 pivot 與 splitIdx - 1 交換： [「1」, 6, 3,「8」, 9]
 *       回傳 pivot index = 3（8 的位置）
 *
 *     接著進行：
 *      quickSortLomuto([1, 6, 3, 8, 9], 0, 2) → 左半部
 *      quickSortLomuto([1, 6, 3, 8, 9], 4, 4) → 右半部（已排序）
 *
 *  3. quickSortHoare(以中間 index 當 pivot)
 *      start = 0, end = 4 → pivotIdx = 2 → pivot = array[2] = 6
 *
 *      第一輪 partition
 *       while 迴圈開始：
 *
 *         start = 0, end = 4
 *         array[start] = 8 > 6 → true → 交換 pivot (index=2) 與 start (index=0)
 *           → [6, 9,「8」, 3, 1]，pivotIdx = 0，continue
 *
 *         start = 0, end = 4
 *         array[end] = 1 < 6 → true → 交換 pivot (index=0) 與 end (index=4)
 *           → [「1」, 9, 8, 3,「6」]，pivotIdx = 4，continue
 *
 *         start = 0, end = 4
 *         array[start] = 1 < pivot → start++ → start = 1
 *         array[start] = 9 > pivot → 交換 pivot (index=4) 與 start (index=1)
 *           → [1,「6」, 8, 3,「9」]，pivotIdx = 1，continue
 *
 *         array[end] = 9 > pivot → end--
 *         array[end] = 3 < pivot → 交換 pivot (index=1) 與 end (index=3)
 *           → [1, 3, 8,「6」, 9]，pivotIdx = 3，continue
 *
 *         ...
 *         最終 break 條件達成：start >= end
 *         回傳 pivotIdx = 3（位置不一定等於 pivot 值）
 *
 *      遞迴處理左：quickSortHoare(array, 0, 2)
 *      遞迴處理右：quickSortHoare(array, 4, 4)
 */

function quickSortSimple(array) {
  if (array.length < 2) return array;

  const [pivot, ...rest] = array;
  const left = [];
  const right = [];

  rest.forEach((value) => {
    if (value < pivot) left.push(value);
    else right.push(value);
  });

  return [...quickSortSimple(left), pivot, ...quickSortSimple(right)];
}

function quickSortHoare(array, start = 0, end = array.length - 1) {
  if (start >= end) return array;

  const partition = (array, start, end) => {
    let pivotIdx = Math.floor((start + end) / 2);

    while (true) {
      if (start >= end) break;

      const pivot = array[pivotIdx];

      if (start < pivotIdx) {
        if (array[start] > pivot) {
          [array[start], array[pivotIdx]] = [array[pivotIdx], array[start]];
          pivotIdx = start;
          continue;
        }
        start++;
      }

      if (end > pivotIdx) {
        if (array[end] < pivot) {
          [array[end], array[pivotIdx]] = [array[pivotIdx], array[end]];
          pivotIdx = end;
          continue;
        }
        end--;
      }
    }

    return pivotIdx;
  };

  // 在 partition 裡面調整陣列，回傳 pivot 的 index
  const pivotIdx = partition(array, start, end);
  quickSortHoare(array, start, pivotIdx - 1);
  quickSortHoare(array, pivotIdx + 1, end);

  return array;
}

function quickSortLomuto(array) {
  const partition = (array, start, end) => {
    let splitIndex = start + 1;

    // 基準值為 array[start]
    /**
     * 基準值往後的元素，若比 基準值 小的元素，
     * 往前放到 splitIndex 的位置後，splitIndex++
     *
     * P.S.
     *  因為小的值會往前放到 splitIndex 後, splitIndex 才 + 1，
     *  迴圈結束後，可以確定此時 splitIndex 以前的元素都比它小
     */
    for (let i = start + 1; i <= end; i++) {
      if (array[i] < array[start]) {
        [array[i], array[splitIndex]] = [array[splitIndex], array[i]];

        splitIndex++;
      }
    }

    /**
     * 把當下 splitIndex 的【前一個元素】跟【基準點互換】
     * (把 基準值 和 splitIndex - 1 互換)，
     * 則 基準點 就排序完畢，而基準點前方的元素都比它小，後方的元素都比它大
     */
    [array[start], array[splitIndex - 1]] = [
      array[splitIndex - 1],
      array[start],
    ];

    return splitIndex - 1;
  };

  const _quickSort = (array, start, end) => {
    if (start >= end) return array;

    // 在 partition 裡面調整數列，並且回傳 pivot 的 index
    const pivotIdx = partition(array, start, end);

    // pivot 左邊的小陣列(值都比 pivot 小)，依同樣方式進行排序
    _quickSort(array, start, pivotIdx - 1);
    // pivot 右邊的小陣列(值都比 pivot 大)，依同樣方式進行排序
    _quickSort(array, pivotIdx + 1, end);

    return array;
  };

  return _quickSort(array, 0, array.length - 1);
}

console.time("quickSortSimple");
console.log("quickSortSimple ~ ", quickSortSimple(input, 0, input.length - 1));
console.timeEnd("quickSortSimple");
console.log("====================================");

console.time("quickSortHoare");
console.log("quickSortHoare ~ ", quickSortHoare(input, 0, input.length - 1));
console.timeEnd("quickSortHoare");
console.log("====================================");

console.time("quickSortLomuto");
console.log("quickSortLomuto ~ ", quickSortLomuto(input, 0, input.length - 1));
console.timeEnd("quickSortLomuto");
console.log("====================================");

/**
 * For think, can be ignore
 *
 * [8, 9, 10, 3, 1]
 *
 *   [8, 9, 10, 3, 1], 9 < 8, false , pivotIdx=1
 *   [8, 9, 10, 3, 1], 10 < 8, false , pivotIdx=1
 *   [8,「3」, 10,「9」, 1], 3 < 8, true , pivotIdx=2
 *   [8, 3,「1」, 9,「10」], 1 < 8, true , pivotIdx=3
 *
 *   pivotIdx = 3 最後交換，[「1」, 3, 「8」, 9, 10]
 */
/**
 *  [8, 9, 10, 11, 1]
 */
