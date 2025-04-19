/**
 * # 插入排序
 * - 拿當下的每個元素，跟【前面的元素比較】，插入到正確的位置(將較小的元素往前放置到正確的位置)
 *  
 * # 複雜度
 * - Time  : O(n^2)
 * - Space : O(1)
 * - 穩定性: 是(不會打亂相同元素的順序)

 * # 範例: input -> [8, 9, 2, 5, 1]
 * - 第一輪，拿 9 跟前面的比較，9 > 8 所以不動
 * - 第二輪，拿 2 跟前面的比較，
 *   - 首先，2 < 9 兩個交換(8, 2, 9, 5, 1)
 *   - 再來，2 < 8 兩個交換(2, 8, 9, 5, 1)
 * - 第三輪，拿 5 跟前面的比較... 以此類推
 */

function insertionSort(array) {
  const length = array.length;

  // 從第一個元素開始 ~ 到倒數第二個元素(即 i < length - 1)，
  // 如果用常見的 i < length，當在 i === length - 1(last index) 時，j + 1 會 out of bound
  for (let i = 0; i < length - 1; i++) {
    // 從第 i + 1 個開始往前比較，將較小的元素往前放到正確的位置
    // 因為要拿 j 跟 j - 1 兩個元素進行比較，只能取到 j > 0 而非 j >= 0，因為 j === 0 時，j - 1 會 out of bound
    for (let j = i + 1; j > 0; j--) {
      if (array[j] < array[j - 1]) {
        [array[j - 1], array[j]] = [array[j], array[j - 1]];
      }
    }
  }

  return array;
}

console.log("🚀 ~ insertion-sort.js ~", insertionSort([8, 9, 2, 5, 1]));
