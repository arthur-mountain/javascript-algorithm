/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  const temp = new Array(nums.length).fill(null);

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      temp[i] = nums[i];
    }
  }

  let index = 0;
  for (let i = 0; i < nums.length; i++) {
    if (temp[i] !== null) {
      nums[index++] = temp[i];
    }
  }

  return index;
};
