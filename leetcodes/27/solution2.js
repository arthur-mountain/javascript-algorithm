/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  let l = 0;
  let r = nums.length - 1;

  while (l <= r) {
    if (nums[l] === val) {
      nums[l] = nums[r--];
    } else {
      l++;
    }
  }

  return r + 1;
};
