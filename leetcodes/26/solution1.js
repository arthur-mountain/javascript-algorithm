/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  const set = new Set();
  const filtered = Array(nums.length).fill(null);
  let filteredIndex = 0;

  for (let i = 0; i < nums.length; i++) {
    if (!set.has(nums[i])) {
      filtered[filteredIndex++] = nums[i];
      set.add(nums[i]);
    }
  }

  for (let i = 0; i < filteredIndex; i++) {
    nums[i] = filtered[i];
  }

  return filteredIndex;
  // Time : O(n)
  // Space: O(n)
};
