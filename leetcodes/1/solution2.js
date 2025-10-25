/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const subtraction = target - nums[i];

    if (map.has(subtraction)) {
      return [map.get(subtraction), i];
    } else {
      map.set(nums[i], i);
    }
  }
};
