/*
 * - [x] Done
 *   - sorting algorithms
 * - [x] Follow up solutions
 *   - sorting algorithms
 */
/**
 * @param {number[]} nums
 * @return {number[]}
 */
let sortArray = (nums) => {
  return mergeSort(nums, nums.length);
};







/* merge sort: O(nlogn) */
// divide the array into two halves
// recursively sort the left array until the array length is 1
// recursively sort the right array until the array length is 1
// merge the two arrays
function mergeSort(nums) {
  if (nums.length < 2) return nums;
  const mid = Math.floor(nums.length / 2);
  const subLeft = mergeSort(nums.slice(0, mid));
  const subRight = mergeSort(nums.slice(mid));
  return merge(subLeft, subRight);
}
function merge(a, b) {
  let result = [];
  while (a.length && b.length) result.push(a[0] < b[0] ? a.shift() : b.shift());
  return result.concat(a.length ? a : b);
}

/* built-in sort: O(nlogn) */
function builtInSort(nums) {
  return nums.sort();
}



sortArray([5, 2, 3, 1]);
sortArray([5, 1, 1, 2, 0, 0]);
