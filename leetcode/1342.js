/**
 * Status:
 *  - [x] Done
 *  - [x] Follow-up solutions
 *
 * Title:
 *    1342. Number of Steps to Reduce a Number to Zero
 *
 * Topics:
 *    1. Math
 *
 *    2. Bit Manipulation
 *
 * Constraints:
 *    1. 0 <= num <= 10^6
 *
 * Statements:
 *    Given a non-negative integer num, return the number of steps to reduce it to zero.
 *
 *    If the current number is even, you have to divide it by 2, otherwise, you have to subtract 1 from it.
 **/
/**
 * @param {number} num
 * @return {number}
 */
let numberOfSteps = (num) => {
  /*
   * Thoughts:
   *    while is num is not 0,
   *    check if num is even or odd, and do the operation
   * */
  // Space: O(1)
  let steps = 0;

  // Time: O(log(n)), must be one step will divide by 2
  while (num > 0) {
    steps++;

    if (num % 2 === 0) {
      num /= 2;
    } else {
      num--;
    }
  }

  return steps;
};

// Follow up:
// num % 2 === 0 is the same as num & 1 === 0
// num /=2 is the same as num >>= 1
numberOfSteps = (num) => {
  // Space: O(1)
  let steps = 0;

  // Time: O(log(n))
  while (num > 0) {
    steps++;

    if ((num & 1) === 0) {
      num >>= 1;
    } else {
      num--;
    }
  }

  return steps;
};
