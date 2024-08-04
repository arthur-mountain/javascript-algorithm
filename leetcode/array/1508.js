/*
 * - [] Done
 * - [] Follow up solutions
 */
/**
 * @param {number[]} nums
 * @param {number} n
 * @param {number} left
 * @param {number} right
 * @return {number}
 */
let rangeSum = (nums, n, left, right) => {
  /*
   * 1. sum of subarrays.
   *    e.g. [1,2,3] => [[1],[1,2],[1,2,3],[2],[2,3],[3]] // increasing contiguous
   *    e.g. [3,2,1] => [[3],[3,2],[3,2,1],[2],[2,1],[1]] // decreasing contiguous
   *    e.g. [2,2,5] => [2,2,5] // equaling contiguous
   * 2. sorted them with ascending order
   * 3. slice the array with `n * (n + 1) / 2` numbers
   * 4. returns the sum of the sliced array start at left end at right, and mod 10^9 +7
   **/

  let subarrays = [null];

  for (let i = 0; i < n; i++) {
    let cur = nums[i];
    subarrays.push(cur);

    let j = i + 1;
    while (
      j <= n - 1 &&
      (nums[j] === nums[j - 1] ||
        nums[j] === nums[j - 1] + 1 ||
        nums[j] === nums[j - 1] - 1)
    ) {
      subarrays.push((cur += nums[j]));
      j++;
    }
  }

  subarrays.sort((a, b) => a - b);

  const max = (n * (n + 1)) / 2;
  const mod = 10 ** 9 + 7;
  let sum = 0;
  for (let i = left; i <= right && i <= max; i++) {
    // console.log(i, right, max, subarrays[i]);
    sum += subarrays[i] % mod;
  }

  console.log(subarrays, sum);

  return sum % (10 ** 9 + 7);
};

rangeSum([1, 2, 3, 4], 4, 1, 5);
rangeSum([1, 2, 3, 4], 4, 3, 4);
rangeSum([1, 2, 3, 4], 4, 1, 10);
rangeSum([9, 3, 2, 2, 6, 9, 6, 6], 8, 4, 8);
rangeSum([4, 6, 2, 4, 3, 8, 2, 9], 8, 8, 8);
