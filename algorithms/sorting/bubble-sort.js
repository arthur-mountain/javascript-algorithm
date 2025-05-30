/**
 * # 氣泡排序
 * - 每一輪一路往後比較，如果【前一個元素比後一個元素大】就【直接兩兩交換】， 每輪排序完後，可以排序出後面較大的值
 *
 * # 範例: input -> [5, 3, 8, 2, 1, 4]，P.S.「」的值為交換的值
 * - 第一輪
 *  - 首先 5 > 3，兩兩交換(「3」,「5」, 8, 2, 1, 4)
 *  - 再來 5 < 8，不交換(3, 5, 8, 2, 1, 4)
 *  - 再來 8 > 2，兩兩交換(3, 5,「2」,「8」, 1, 4)
 *  - 再來 8 > 1，兩兩交換(3, 5, 2,「1」,「8」, 4)
 *  - 再來 8 > 4，兩兩交換(3, 5, 2, 1,「4」,「8」)，此時確定 8 為最大值
 * - 第二輪
 *  - 首先 3 < 5，不交換(3, 5, 2, 1, 4, 8)
 *  - 再來 5 > 2，兩兩交換(3,「2」,「5」, 1, 4, 8)
 *  - 再來 5 > 1，兩兩交換(3, 2,「1」,「5」, 4, 8)
 *  - 再來 5 > 4，兩兩交換(3, 2, 1,「4」,「5」, 8)，第一輪已經確定 8 為最大值，因此比到這裡 5 為倒數第二大的值
 * - 第三輪
 * - ...以此類推
 */

const bubbleSort = (input) => {
  const length = input.length - 1;

  for (let i = 0; i < length; i++) {
    // 每輪排序完都會確定「最後一個」元素(最大值)，因為不用再比較排序好的元素，所以 length - i
    for (let j = 0; j < length - i; j++) {
      // 如果前面的元素比後面的元素要大，則交換元素位置
      if (input[j] > input[j + 1]) {
        const temp = input[j];
        input[j] = input[j + 1];
        input[j + 1] = temp;
        // [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }

  return input;
};

// 同上，把原本上面的內層迴圈中的 length - i 的判斷，
// 改用 while，因此在 for loop 的 condition 可以直接寫 length
const bubbleSort2 = (arr) => {
  let length = arr.length;

  while (length > 1) {
    length--;

    for (let i = 0; i < length; i++) {
      // 如果前面的元素比後面的元素要大，則交換元素位置
      if (arr[i] > arr[i + 1]) {
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
      }
    }
  }

  return arr;
};

console.log(bubbleSort([1, 4, 7, 9, 213, 46, 234, 745])); // [ 1,   4,   7,   9, 46, 213, 234, 745 ]
console.log(bubbleSort2([1, 4, 7, 9, 213, 46, 234, 745])); // [ 1,   4,   7,   9, 46, 213, 234, 745 ]
