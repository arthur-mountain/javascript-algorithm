/**
 * 二分搜尋： log n
 * 1. 在【已排序】的陣列中，選取 中間值
 * 2. 目標值 === 中間值，則回傳 中間值
 * 3. 目標值 < 中間值，則返回步驟一，在【左邊】小陣列中選取中間值並繼續尋找
 * 4. 目標值 > 中間值，則返回步驟一，在【右邊】小陣列中選取中間值並繼續尋找
 */

function binarySearch(arr, target) {
  // 以 index 為單位
  let l = 0;
  let r = arr.length - 1;

  while (l <= r) {
    //  從中間開始切
    const mid = Math.floor(l + (r - l) / 2);

    if (target < arr[mid]) {
      // 往左找
      r = mid - 1;
    } else if (target > arr[mid]) {
      // 往右找
      l = mid + 1;
    } else {
      return mid;
    }
  }

  // 如果上面都不符合代表找不到
  return -1;
}

console.log(
  "🚀 ~ binarySearch: ",
  binarySearch([1, 3, 5, 7, 9, 20, 40, 60, 79, 95, 100], 79),
);
