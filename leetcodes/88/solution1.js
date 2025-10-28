/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function (nums1, m, nums2, n) {
  const temp = new Array(m + n).fill(null);

  let l1 = 0;
  let l2 = 0;
  let index = 0;
  while (l1 < m && l2 < n) {
    temp[index++] = nums1[l1] > nums2[l2] ? nums2[l2++] : nums1[l1++];
  }

  while (l1 < m) temp[index++] = nums1[l1++];
  while (l2 < n) temp[index++] = nums2[l2++];

  for (let i = 0; i < temp.length; i++) {
    nums1[i] = temp[i];
  }
};
