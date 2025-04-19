/**
 * # 合併排序
 * - 將大陣列使用二分法拆到都只剩一個元素，再逐一比較排序合併
 *
 * # 複雜度
 * - Time  : O(nlogn)
 * - Space : O(n)
 * - 穩定性: 穩定排序（相等元素不會換位置）
 *
 * # 範例: input -> [8, 9, 2, 5, 1]
 * 
 *  merge(mergeAndSlice([8,9,2]), mergeAndSlice([5,1]))
 * 
 *    【left recursion】:
 *      merge(mergeAndSlice([8]), mergeAndSlice([9,2])) // 左邊只剩一個元素則直接返回 [8]
 
 *        【right-recursion of left】:
 *          merge(mergeAndSlice([9]), mergeAndSlice([2])) // merge 回傳 [2, 9]
 * 
 *      merge([8], [9,2]) // 最後 left recursion， merge 回傳 [2, 8, 9]
 *   
 *    【right recursion】:
 *      merge(mergeAndSlice([5]), mergeAndSlice([1])) // 最後 right recursion， merge 回傳 [1, 5]
 *  
 *  merge([2, 8, 9], [1, 5]) // 兩邊小陣列皆已經排序好，最後合成一個大陣列 [1,2,5,8,9]
*/

// left 和 right 各自都是已經排序好的小陣列
function merge(left, right) {
  const result = [];
  let leftIdx = 0;
  let rightIdx = 0;

  // 兩邊陣列都有元素
  while (leftIdx < left.length && rightIdx < right.length) {
    if (left[leftIdx] < right[rightIdx]) {
      result.push(left[leftIdx++]);
    } else {
      result.push(right[rightIdx++]);
    }
  }

  // 只會有一個 while 迴圈會被執行，因為不是左邊仍有元素，不然就是右邊仍有元素
  while (leftIdx < left.length) {
    result.push(left[leftIdx++]);
  }

  while (rightIdx < right.length) {
    result.push(right[rightIdx++]);
  }

  return result;
}

function mergeAndSlice(array) {
  const length = array.length;

  if (length === 1) return array;

  const midIndex = Math.floor(length / 2);
  const leftAry = array.slice(0, midIndex);
  const rightAry = array.slice(midIndex);

  return merge(mergeAndSlice(leftAry), mergeAndSlice(rightAry));
}

console.log("🚀 ~ merge-sort.js ~", mergeAndSlice([8, 9, 2, 5, 1]));
