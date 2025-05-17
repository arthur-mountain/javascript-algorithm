/**
 * Status:
 *  - [x] Done
 *  - [ ] Follow-up solutions
 *
 * Title:
 *  Find the Duplicate Number
 *
 * Topics:
 *  - two pointer
 *  - binary search
 *  - bit manipulation
 *
 * Statements:
 *  find the duplicate number in array that length with n + 1 and range in [1, n],
 *  so the duplicate number must in range [1, n], and the duplicate number must be the only one.
 *
 *  You must solve the problem without modifying the array nums and using only constant extra space.
 *
 * Constraints:
 *  - 1 <= n <= 105
 *  - nums.length == n + 1
 *  - 1 <= nums[i] <= n
 *  - All the integers in nums appear only once except for precisely one integer which appears two or more times.
 **/
/**
 * @param {number[]} nums
 * @return {number}
 */

var findDuplicate = function (nums) {
  // 最佳解: constants space，且不 modify original array
  // 參考其他人解： two pointer cycle detection
  // https://neetcode.io/problems/find-duplicate-integer
  let slow = 0;
  let fast = 0;
  while (true) {
    slow = nums[slow];
    fast = nums[nums[fast]];
    if (slow === fast) {
      break;
    }
  }

  fast = 0;
  while (true) {
    slow = nums[slow];
    fast = nums[fast];
    if (slow === fast) {
      return slow;
    }
  }
};

// Time : O(n)
// Space: O(1)
