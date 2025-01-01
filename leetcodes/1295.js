/**
 * Status:
 *  - [x] Done
 *  - [x] Follow-up solutions
 *
 * Title:
 *   1295. Find Numbers with Even Number of Digits
 *
 * Topics:
 *    1. Array
 *    2. Math
 *
 * Statements:
 *    Given an array nums of integers,
 *    return how many of them contain an even number of digits.
 *
 * Constraints:
 *    1. 1 <= nums.length <= 500
 *    2. 1 <= nums[i] <= 105
 **/
let findNumbers = (nums) => {
  let count = 0;

  for (const num of nums) {
    if (`${num}`.length % 2 === 0) count++;
  }

  return count;
};

findNumbers = (nums) => {
  let count = 0;

  for (const num of nums) {
    if ((`${num}`.length & 1) === 0) count++;
  }

  return count;
};

// follow up: count the number of digits manually, without converting to string
findNumbers = (nums) => {
  let count = 0;

  for (let num of nums) {
    let digit_count = 0;
    while (num) {
      digit_count++;
      num = Math.floor(num / 10);
    }
    if ((digit_count & 1) == 0) count++;
  }

  return count;
};
