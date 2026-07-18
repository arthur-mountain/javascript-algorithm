/**
 * @param {number[]} nums
 * @return {number}
 */
var findGCD = function (nums) {
  let min = nums[0];
  let max = nums[0];
  for (let i = 0; i < nums.length; i++) {
    if (min > nums[i]) min = nums[i];
    if (max < nums[i]) max = nums[i];
  }
  for (let i = max; i > 0; i--) {
    if (min % i === 0 && max % i === 0) return i;
  }
  return 1;
};
