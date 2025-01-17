const data = [8, 9, 6, 3, 11, 25, 32, 2, 1];

/**
 * 快速排序：
 * 以【一個值為基準(pivot)】進行拆分，
 *【比 pivot 小就放到前面】(比基準值小的小陣列)，
 *【比 pivot 大就放到後面】(比基準值大的小陣列)，
 * 直到陣列中都只剩一個元素後即排序完畢。
 *
 * 例如：[8, 9, 6, 3, 1]
 *
 * 第一輪的_quickSort
 *  partition 函式，start = 0, end = 4 ，基準值為 array[start] = 8;
 *    i = 1 , pivotIdx = 1, 9 < 8 ，false，不交換([8, 9, 6, 3, 1])
 *    i = 2 , pivotIdx = 1, 6 < 8 ，true，交換([8,「6」,「9」, 3, 1]), pivotIdx++
 *    i = 3 , pivotIdx = 2, 3 < 8 ，true，交換([8, 6,「3」,「9」, 1]), pivotIdx++
 *    i = 4 , pivotIdx = 3, 1 < 8 ，true，交換([8, 6, 3,「1」,「9」]), pivotIdx++
 *
 *    此時 pivotIdx = 4 , [8, 6, 3, 1, 9]，最後要把最後一個比基準值小的值交換
 *
 *    start 和 pivotIdx - 1 交換，即 8 和 1 互換， [「1」, 6, 3,「8」, 9]
 *
 *    此時以 8 為基準，右邊的值都比它大，左邊的值都比它小
 *
 *    return 3; (pivotIdx - 1)，回傳以 8 為基準的 index, 8 這個元素已經排序完畢
 *
 * 左邊的_quickSort，以此類推...
 * 右邊的_quickSort，以此類推...
 */

// 簡單版很容易懂
function quickSort2(array) {
  if (array.length < 2) return array;
  const [pivot, ...ary] = array;
  const left = [],
    right = [];

  ary.forEach((value) => {
    if (value < pivot) left.push(value);
    else right.push(value);
  });

  return [...quickSort(left), pivot, ...quickSort(right)];
}

function quickSort(array) {
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

function quickSortSplitAtMiddle(array, start, end) {
  if (start >= end) return;

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

  // 在 partition 裡面調整數列，並且回傳 pivot 的 index
  const pivotIdx = partition(array, start, end);

  quickSortSplitAtMiddle(array, start, pivotIdx - 1);
  quickSortSplitAtMiddle(array, pivotIdx + 1, end);

  return array;
}
console.time();
console.log("quickSort2 ~ ", quickSort2(data, 0, data.length - 1));
console.timeEnd();

console.time();
console.log("quickSort ~ ", quickSort(data, 0, data.length - 1));
console.timeEnd();

console.time();
console.log(
  "quickSortSplitAtMiddle ~ ",
  quickSortSplitAtMiddle(data, 0, data.length - 1),
);
console.timeEnd();

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

