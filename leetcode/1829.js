/**
 * Status:
 *  - [x] Done
 *  - [x] Follow-up solutions
 *
 * Title:
 *  1829. Maximum XOR for Each Query
 *
 * Topics:
 *
 * Constraints:
 *  1. nums.length == n
 *
 *  2. 1 <= n <= 105
 *
 *  3. 1 <= maximumBit <= 20
 *
 *  4. 0 <= nums[i] < 2 ^ maximumBit
 *
 *  5. `nums` is sorted in ascending order.
 *
 * Statements:
 *  the k that must be less than 2 ^ maximumBit, k < 2 ^ maximumBit,
 *
 *  so the maximumNumber is 2 ^ maximumBit - 1,
 *
 *  found the each answer in n times query, the query is
 *
 *  1. XOR all nums and XOR by k,
 *     found the largest numbers(2 ^ maximumBit - 1) after XOR by k,
 *     the k is answer push to the result
 *
 *  2. Remove last number from nums
 *
 * Exmaples:
 *  nums = [0, 1, 2, 3], maximumBit = 2
 *
 *  the largets number is 2 ^ 2 - 1 = 3
 *
 *  round one:
 *    0 ^ 1 ^ 2 ^ 3 ^ k, found 3 after XOR by k
 *
 *    00 ^ 10 ^ 11 ^ k need to equal to 3, k is 3
 *
 *    00
 *    01
 *    10
 *    11
 *
 *    00 ^ 11 = 11 = 3
 *    so k is 11 in binary means the number is 3
 *
 *    result.push(k)
 *    remove last number from nums is 3
 *
 *  round two:
 *    0 ^ 1 ^ 2 ^ k, found the largest numbers after XOR by k
 *
 *    00
 *    01
 *    10
 *
 *    00 ^ 11 = 11 = 3
 *    so k is 11 in binary means the number is 3
 *
 *    result.push(k)
 *    remove last number from nums is 2
 *
 *   and so on
 **/
/**
 * @param {number[]} nums
 * @param {number} maximumBit
 * @return {number[]}
 */
let getMaximumXor = (nums, maximumBit) => {};

/** follow up */
getMaximumXor = (nums, maximumBit) => {
  /*
   * Thoughts:
   *  The maximum number is 2 ^ maximumBit - 1,
   *  which we will use to ensure we get the maximum possible XOR result.
   *
   *  XOR all elements in nums -> xors.
   *
   *  answer[i] is xors ^ (2 ^ maximumBit - 1),
   *  which is guaranteed to maximize the XOR value at that point.
   *
   *  Remove the last number from nums, so we need to XOR the last number with xors to update it.
   *
   *  XOR the last element in nums with xors to effectively "remove" it from the XOR calculation.
   *  This allows us to dynamically update xors without recalculating the entire array XOR from scratch for each query.
   **/

  let xors = 0;
  for (const num of nums) {
    xors ^= num;
  }

  // maximumNum = 2 ** maximumBit - 1;
  maximumNum = (1 << maximumBit) - 1; // as same as 2 ** maximumBit - 1

  const answers = [];
  for (let i = nums.length - 1; i >= 0; i--) {
    answers.push(xors ^ maximumNum);
    xors ^= nums[i];
  }

  // as same as above, but using increment index,
  // and in the last shoud xor nums[len - i - 1] to remove the last number
  // for (let i = 0, len = nums.length; i < len; i++) {
  //   answers.push(xors ^ maximumNum);
  //   xors ^= nums[len - i - 1];
  // }

  return answers;
};

/* follow up */
getMaximumXor = (nums, maximumBit) => {
  /*
   * Thoughts:
   *  As in the previous approach, we XOR all elements in nums to obtain the cumulative XOR for each query.
   *
   *  Here, we optimize by directly XOR-ing each element nums[i] with the cumulative result up to that point,
   *  eliminating the need for extra space.
   *
   *  We use nums[i] to represent the result for answer[nums.length - i - 1], effectively building the answer
   *  array in reverse without additional space.
   *
   *  By reversing nums at the end, we get the final order of maximum XOR results for each query as required.
   */
  nums[0] = nums[0] ^ ((1 << maximumBit) - 1);
  for (let i = 1; i < nums.length; i++) {
    nums[i] = nums[i - 1] ^ nums[i];
  }
  return nums.reverse();
};
