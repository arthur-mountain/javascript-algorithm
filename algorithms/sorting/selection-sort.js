/**
 * # 選擇排序
 * - 每輪將最小值的元素往前放
 *
 * # 複雜度
 * - Time  : O(n^2)
 * - Space : O(1)
 * - 穩定性: 不穩定，因為會交換到前面去，可能改變相同數值的順序
 *
 * # 範例： input -> [8, 9, 2, 5, 1]
 * - 第一輪，拿 8 當作最小值，一路往後比較，最小值= 1，因此把 1 跟 8 交換
 * - 第二輪，拿 9 當作最小值，一路往後比較，最小值= 2，因此把 2 跟 9 交換
 * - 第三輪，拿 9 當作最小值，...以此類推(P.S. 這裡因為第二輪的 9 和 2 交換，因此9此時會在第三個元素，所以又拿它來當作最小值)
 */
function selectionSort(input) {
  const length = input.length;

  // 從 i === 0 開始，往後找到最小的元素後，放到第 i 個
  // 因為前面每次都會排好第 i 個最小值，因此到最後一個元素(length - 1) 時就不用再排序了，
  // 因為前面最小值已經排序好了，最後一個一定是最大值，所以範圍只取到 i < length - 1
  for (let i = 0; i < length - 1; i++) {
    let minValueIndex = i; // 初始化為，當前第 i 個元素是最小的，再往後找更小的
    for (let j = i + 1; j < length; j++) {
      if (input[minValueIndex] > input[j]) {
        minValueIndex = j;
      }
    }
    // 找到最小的元素後，跟當前 i 的位置進行交換，就會排好第 i 個最小值的元素
    [input[i], input[minValueIndex]] = [input[minValueIndex], input[i]];
  }

  return input;
}

console.log("selection-sort.js ~ line 30 ~ ", selectionSort([8, 9, 2, 5, 1]));
