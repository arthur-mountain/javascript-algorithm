/**
 * Status:
 *  - [x] Done
 *  - [ ] Follow-up solutions
 *
 * Title:
 *   Median of Two Sorted Arrays
 *
 * Topics:
 *   - array
 *   - binary search
 *   - divide and conquer
 *
 * Statements:
 *  Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.
 *
 *  The overall run time complexity should be O(log (m+n)).
 *
 * Constraints:
 *  - nums1.length == m
 *  - nums2.length == n
 *  - 0 <= m <= 1000
 *  - 0 <= n <= 1000
 *  - 1 <= m + n <= 2000
 *  - -106 <= nums1[i], nums2[i] <= 106
 **/
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
  // 暴力解:
  // - 先 merged two sorted array
  // - 在找中間值

  // 合併陣列
  const arr = [];
  let i = 0;
  let j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] > nums2[j]) {
      arr.push(nums2[j++]);
    } else {
      arr.push(nums1[i++]);
    }
  }
  while (i < nums1.length) {
    arr.push(nums1[i++]);
  }
  while (j < nums2.length) {
    arr.push(nums2[j++]);
  }
  // 找中間值
  const mid = Math.floor(arr.length / 2);
  if ((arr.length & 1) === 0) {
    return (arr[mid] + arr[mid - 1]) / 2;
  }
  return arr[mid];
};

// Time : O(m + n)
// Space: O(m + n)
