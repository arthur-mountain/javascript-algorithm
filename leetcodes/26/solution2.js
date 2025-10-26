/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  let l = 0;
  for (let r = 1; r < nums.length; r++) {
    if (nums[l] !== nums[r]) {
      nums[++l] = nums[r];
    }
  }
  return l + 1;
  // Time : O(n)
  // Space: O(1)
};
