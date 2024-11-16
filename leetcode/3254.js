/**
 * Status:
 *  - [x] Done
 *  - [ ] Follow-up solutions
 *
 * Title:
 *  3254. Find the Power of K-Size Subarrays I
 *
 * Topics:
 *  1. array
 *  2. sliding window
 *
 * Constraints:
 *  1. 1 <= n == nums.length <= 500
 *  2. 1 <= nums[i] <= 105
 *  3. 1 <= k <= n
 *
 * Statements:
 *  the subarray:
 *    1. the size k of nums
 *    2. consecutive subarray
 *    3. sorted in ascending order
 *
 *  results of size n - k + 1
 *
 *  the results[i] is the power of nums[i..(i + k - 1)].
 **/
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
let resultsArray = (nums, k) => {
  const n = nums.length;
  // Space: O(n - k)
  let result = Array(n - k + 1).fill(-1);
  let max = -1;

  // Time: O(n * k)
  for (let i = 0; n - k >= i; i++) {
    for (let j = 0; k > j; j++) {
      if (j === 0) {
        max = nums[i + j];
      } else {
        // Check is consecutive and sorted in ascending order
        // if not break and max = -1
        if (nums[i + j - 1] + 1 !== nums[i + j]) {
          max = -1;
          break;
        }
        // otherwise update max
        max = Math.max(max, nums[i + j]);
      }
    }
    result[i] = max;
  }

  return result;
};
