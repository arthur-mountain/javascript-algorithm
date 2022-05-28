/**
 * 選擇排序：
 * 每輪比完才交換位置，【以預設最小值的方式】，把每輪比較出來的最小值往前放
 * 例如： [8, 9, 2, 5, 1]
 * 第一輪，拿 8 當作最小值，一路往後比較，最小值=1，因此把 1 跟 8 交換
 * 第二輪，拿 9 當作最小值，一路往後比較，最小值=2，因此把 2 跟 9 交換
 * 第三輪，拿 9 當作最小值，...以此類推(P.S. 這裡因為第二輪的 9 和 2 交換，因此9此時會在第三個元素，所以又拿它來當作最小值)
 */
function selectionSort(array) {
  const length = array.length;
  // 最小值的 index
  let minValueIndex;

  // 取一個元素(第一個 for)，跟每個元素(第二個 for)作比較
  for (let i = 0; i < length - 1; i++) {
    // 先預設最小值為取一個元素 index
    minValueIndex = i

    /**
     * let j = i ，
     * 每一輪 for 迴圈跑完，都排序好一個最小值的元素放到最前面，
     * 所以可以不用再比較排序好的那個元素
     */
    for (let j = i; j < length; j++) {
      /**
       * 若第一輪 for 迴圈的中 
       * minValueIndex的值比較大，就換成 minValueIndex = j 
       */
      if (array[minValueIndex] > array[j]) {
        minValueIndex = j
      }
    }

    // 比較完後交換
    [array[i], array[minValueIndex]] = [array[minValueIndex], array[i]];
  }

  return array;
}

console.log("selection-sort.js ~ line 30 ~ ", selectionSort([8, 9, 2, 5, 1]))