/**
 * Status:
 *  - [x] Done
 *  - [x] Follow-up solutions
 *
 * Title:
 *    1480. Running Sum of 1d Array
 *
 * Topics:
 *    1. Array
 *
 *    2. Prefix Sum
 *
 * Statements:
 *   Given an array nums. We define a running sum of an array as runningSum[i] = sum(nums[0]…nums[i]).
 *
 *   Example:
 *     Input: nums = [1,2,3,4]
 *     Output: [1, 1+2, 1+2+3, 1+2+3+4]
 *
 * Constraints:
 *    1. 1 <= nums.length <= 1000
 *
 *    2. -10^6 <= nums[i] <= 10^6
 **/
/**
 * @param {number[]} nums
 * @return {number[]}
 */
let runningSum = (nums) => {
  /*
   *  Thoughts:
   *     define a variable to store the current sum,
   *     iterate the array and add the current sum to the current element,
   *     mutate the new sum into the current element, update the current sum
   *     return mutated nums.
   * */
  // Space complexity: O(1)
  let cur_sum = 0;

  // Time complexity: O(n)
  for (let i = 0, r = nums.length; i < r; i++) {
    nums[i] = cur_sum += nums[i];
  }
  return nums;
};

// Follow-up
runningSum = (nums) => {
  /*
   *  Thoughts:
   *    same implementation as above,
   *    we not need to store sum in cur_sum, cause we mutate the nums array directly,
   *    just added nums[i-1] + nums[i] to nums[i], the nums[i - 1] as same as the store variable before we are created.
   *
   *    remember, i start with 1, because we need to add the previous element to the current element.
   *    and the first element is itself, so we don't need to add it.
   * */
  // Time complexity: O(n)
  for (let i = 1, r = nums.length; i < r; i++) {
    nums[i] = nums[i - 1] + nums[i];
    // or
    // nums[i] += nums[i - 1];
  }
  return nums;
};
