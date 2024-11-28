/**
 * Status:
 *  - [x] Done
 *  - [ ] Follow-up solutions
 *
 * Title:
 *    485. Max Consecutive Ones
 *
 * Topics:
 *    1. Array
 *
 * Statements:
 *    Found the maximum number of consecutive 1s in this array.
 *
 * Constraints:
 *    1 <= nums.length <= 105
 *    2. nums[i] is either 0 or 1.
 **/

/**
 * @param {number[]} nums
 * @return {number}
 */
let findMaxConsecutiveOnes = (nums) => {
  /**
   * Thoughts:
   *   store the max count and current count
   *
   *   if current num is 1, increment current count
   *   if current num is 0, update max count and reset current count
   *
   *   return max count
   **/

  let max = 0,
    current_count = 0;

  // 因為我們是在 else 的時候才取 Math.max，
  // 這邊要用 i <= len，是因為我們要在要再進到迴圈取一次 Math.max(也就是進到 esle 裡面，因為 i = len 的時候一定會進到 else)
  //
  // 如果是用 i < len 的話，for loop 走到最後一個數字是 1 的話，current_count 就不會被取到 max，因為
  // i = last index 就是最後一輪迴圈了，不會進到 else 所以不會被取 Math.max
  for (let i = 0, len = nums.length; i <= len; i++) {
    if (nums[i]) {
      current_count++;
    } else {
      max = Math.max(max, current_count);
      current_count = 0;
    }
  }
  return max;
};

// 如上述，如果要用 i < len 的話，回傳得時候，因為 current_count 是沒被計算到 Math.max 的
// 所以回傳也要 Math.max(max, current_count)
findMaxConsecutiveOnes = (nums) => {
  let max = 0,
    current_count = 0;

  for (let i = 0, len = nums.length; i < len; i++) {
    if (nums[i]) {
      current_count++;
    } else {
      max = Math.max(max, current_count);
      current_count = 0;
    }
  }
  return Math.max(max, current_count);
};

// 最簡單得做法是，直接把 Math.max 在每次 for loop 裡面都取
// 這樣就不用在意 for loop 走完之後，最後一個 current_count 是不是被取到 max
findMaxConsecutiveOnes = (nums) => {
  let max = 0,
    current_count = 0;

  for (let i = 0, len = nums.length; i < len; i++) {
    if (nums[i]) {
      current_count++;
    } else {
      current_count = 0;
    }
    max = Math.max(max, current_count);
  }
  return max;
};
