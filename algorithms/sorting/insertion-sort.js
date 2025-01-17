/**
 * 插入排序：
 * 拿當下的每個元素，跟【前面的元素比較】，插入到正確的位置
 * 例如: 8, 9, 2, 5, 1
 * 第一輪，拿 9 跟前面的比較，9 >8 所以不動
 * 第二輪，拿 2 跟前面的比較，
 *   首先，2 < 9 兩個交換(8, 2, 9, 5, 1)
 *   再來，2 < 8 兩個交換(2, 8, 9, 5, 1)
 * 第三輪，拿 5 跟前面的比較... 以此類推
 */

function insertionSort(array) {
  const length = array.length;

  for (let i = 0; i < length - 1; i++) {
    for (let j = i + 1; j > 0; j--) {
      if (array[j] < array[j - 1]) {
        [array[j - 1], array[j]] = [array[j], array[j - 1]];
      }
    }
  }

  return array;
}

console.log("🚀 ~ insertion-sort.js ~", insertionSort([8, 9, 2, 5, 1]));
