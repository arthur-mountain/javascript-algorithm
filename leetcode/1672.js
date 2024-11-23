/**
 * Status:
 *  - [x] Done
 *  - [x] Follow-up solutions
 *
 * Title:
 *    1672. Richest Customer Wealth
 *
 * Topics:
 *    1. Array
 *
 *    2. Matrix
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
 *
 * Constraints:
 *    1. m == accounts.length
 *
 *    2. n == accounts[i].length
 *
 *    3. 1 <= m, n <= 50
 *
 *    4. 1 <= accounts[i][j] <= 100
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
  // Space: O(1)
  let max = 0;
  // Time: O(m * n)
  for (let i = 0, m = accounts.length; i < m; i++) {
    let cur_sum = 0;
    for (let j = 0, n = accounts[i].length; j < n; j++) {
      cur_sum += accounts[i][j];
    }
    max = Math.max(max, cur_sum);
  }
  return max;
};

maximumWealth = (accounts) => {
  /*
   * Thoughts:
   *    as same as above implementation but
   *    we are using built-in reduce to sum the wealth of each customer in this approach
   **/
  // Space: O(1)
  let max = 0;
  // Time: O(m * n)
  for (let i = 0, m = accounts.length; i < m; i++) {
    max = Math.max(
      max,
      accounts[i].reduce((acc, cur) => acc + cur, 0),
    );
  }
  return max;
};

maximumWealth = (accounts) => {
  /*
   * Thoughts:
   *    do not create extra variable to store the current customer wealth,
   *    mutate previous element to max wealth,
   *    end of the loop return the last element, which is the maximum wealth
   **/
  // Time: O(m * n)
  for (let i = 0, m = accounts.length; i < m; i++) {
    accounts[i] = Math.max(
      i > 0 ? accounts[i - 1] : 0,
      accounts[i].reduce((acc, cur) => acc + cur, 0),
    );
  }
  return accounts[accounts.length - 1];
};
