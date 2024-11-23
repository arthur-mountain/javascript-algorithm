/**
 * Status:
 *  - [x] Done
 *  - [ ] Follow-up solutions
 *
 * Title:
 *  1652. Defuse the Bomb
 *
 * Topics:
 *
 * Statements:
 *  given a number of k, decrypt the code by folloing rules,
 *  the code is circular, so the next of the last element is the first element,
 *  and the previous of the first element is the last element
 *  if (k > 0) code[i] = sum of next k elements
 *  if (k < 0) code[i] = sum of previous k elements
 *  if(k === 0) code[i] = 0
 *  return the decrypted code
 *
 * Constraints:
 *  1.  n == code.length
 *  2. 1 <= n <= 100
 *  3. 1 <= code[i] <= 100
 *  4. -(n - 1) <= k <= n - 1
 **/
/**
 * @param {number[]} code
 * @param {number} k
 * @return {number[]}
 */
let decrypt = (code, k) => {
  /*
   * Thoughts:
   *  brute force
   *  decrypt with nested loop
   * */

  // Time: O(n)
  // Space: O(n)
  const n = code.length;
  if (k === 0) {
    return Array.from({ length: n }).fill(0);
  }

  // Space: O(n)
  let decrypted_code = Array.from({ length: n });
  let cur_sum = 0;

  // Time: O(n * k)
  for (let i = 0; i < n; i++) {
    for (let j = 1; j <= Math.abs(k); j++) {
      cur_sum += code.at((k > 0 ? i + j : i - j) % n);
    }
    decrypted_code[i] = cur_sum;
    cur_sum = 0;
  }
  return decrypted_code;
};

decrypt = (code, k) => {
  /*
   * Thoughts:
   *  Sliding window
   * */

  // Time: O(n)
  // Space: O(1)
  let n = code.length;
  if (k === 0) {
    while (n > 0) {
      code[n - 1] = 0;
      n--;
    }
    return code;
  }

  // Space: O(n)
  let decrypted_code = Array.from({ length: n });
  let cur_sum = 0;

  // TODO: WIP

  return decrypted_code;
};
