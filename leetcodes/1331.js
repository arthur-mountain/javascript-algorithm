/*
 * - [x] Done
 * - [] Follow up solutions
 */
/**
 * @param {number[]} arr
 * @return {number[]}
 */
let arrayRankTransform = (arr) => {
  /**
   * Store each integer and its index in an array [[int, index], ...].
   * Sort the integers in ascending order.
   * Reassign the rank (index after sorting) to the original index in arr.
   * If the integer is the same as the previous one, keep the same rank.
   * Otherwise, assign the new rank to the index.
   **/

  // Space: O(n)
  let temp = [];

  // Time: O(n)
  for (let i = 0; i < arr.length; i++) {
    temp.push([arr[i], i]);
  }

  // Time: O(nlogn)
  temp.sort((a, b) => a[0] - b[0]);

  // Time: O(n)
  for (let i = 0; i < temp.length; i++) {
    arr[temp[i][1]] =
      temp[i]?.[0] === temp[i - 1]?.[0]
        ? arr[temp[i - 1][1]]
        : (arr[temp[i - 1]?.[1]] ?? i) + 1;
  }

  // Total Time  Complexity: O(n) + O(nlogn) + O(n) => O(nlogn)
  // Total Space Complexity: O(n)
  return arr;
};

/** follow up ideas:
 * 1. sort the array with radix sort to reduce time complexity to O(n)
 * */
arrayRankTransform = (arr) => {};
