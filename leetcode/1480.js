/**
 * Status:
 *  - [x] Done
 *  - [ ] Follow-up solutions
 *
 * Title:
 *    1480. Running Sum of 1d Array
 *
 * Topics:
 *
 *
 * Constraints:
 *    1. 1 <= nums.length <= 1000
 *
 *    2. -10^6 <= nums[i] <= 10^6
 *
 * Statements:
 *   Given an array nums. We define a running sum of an array as runningSum[i] = sum(nums[0]…nums[i]).
 *
 *   Example:
 *     Input: nums = [1,2,3,4]
 *     Output: [1, 1+2, 1+2+3, 1+2+3+4]
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
