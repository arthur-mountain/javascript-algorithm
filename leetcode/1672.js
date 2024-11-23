/**
 * Status:
 *  - [x] Done
 *  - [ ] Follow-up solutions
 *
 * Title:
 *    1672. Richest Customer Wealth
 *
 * Topics:
 *    1. Array
 *
 *    2. Matrix
 *
 * Constraints:
 *    1. m == accounts.length
 *
 *    2. n == accounts[i].length
 *
 *    3. 1 <= m, n <= 50
 *
 *    4. 1 <= accounts[i][j] <= 100
 *
 * Statements:
 *    Given an m x n integer grid accounts where accounts[i][j] is the amount of money the i customer has in the j bank.
 *
 *    Example:
 *      Input: accounts = [[1,2,3],[3,2,1]]
 *
 *      Output: 6
 *        the 1 customer has wealth = 1 + 2 + 3 = 6;
 *        the 2 customer has wealth = 3 + 2 + 1 = 6;
 *        both of them are the richest customer with a wealth of 6.
 **/
/**
 * @param {number[][]} accounts
 * @return {number}
 */
let maximumWealth = (accounts) => {
  /*
   * Thoughts:
   *    create a maximum varaible to store the current maximum wealth
   *
   *    sum of current customer wealth
   *
   *    update the maximum money between the current maximum wealth variable and the current customer sum of wealth
   **/
  let max = 0;
  for (let i = 0, r = accounts.length; i < r; i++) {
    let cur_sum = 0;
    for (let j = 0, b = accounts[i].length; j < b; j++) {
      cur_sum += accounts[i][j];
    }
    max = Math.max(max, cur_sum);
  }
  return max;
};
