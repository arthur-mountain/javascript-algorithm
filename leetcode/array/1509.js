/*
 * - [] Done
 * - [] Refer to what others are doing
 */

/**
 * @param {number[]} nums
 * @return {number}
 */
let minDifference = (nums) => {
  if (nums.length <= 4) {
    return 0;
  }

  nums.sort((a, b) => b - a);
  console.log(nums);

  let i = nums.length,
    min;

  while (--i >= 0) {
    if (!min && nums[i] != 0) {
      min = nums[i];
      break;
    }
  }

  nums[0] = min;
  nums[1] = 0;
  nums[2] = 0;
  console.log(nums);

  return nums[0] - 0;
};

// console.log(minDifference([5, 3, 2, 4]));
// console.log(minDifference([1, 5, 0, 10, 14]));
// console.log(minDifference([3, 100, 20]));
console.log(minDifference([6, 6, 0, 1, 1, 4, 6]));
