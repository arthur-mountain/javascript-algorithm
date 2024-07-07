/*
 * - [x] Done
 *    - In each round, we could exchange the maxExchange.
 *    - Update the numBottles = numBottles - maxExchange + 1.
 *    - Continue this process until numBottles is less than maxExchange.
 *    - Finally, add the remaining number of bottles to the total.
 * - [x] Refer to what others are doing
 *     - Same concept but use recursion
 *     - Using math formula
 */
/**
 * @param {number} numBottles
 * @param {number} numExchange
 * @return {number}
 */
let numWaterBottles = (numBottles, numExchange) => {
  if (numBottles < numExchange) return numBottles;

  let total = 0;

  // Drunk maxExchange bottles and add additional new one
  // total += maxExchange
  while (numBottles >= numExchange) {
    numBottles = numBottles - numExchange + 1;
    total += numExchange;
  }

  // Add the remaining bottles
  total += numBottles;

  return total;
};

numWaterBottles = (n, k) => {
  let total = 0;
  let round = 0;

  while (1) {
    if (n < k) {
      total += n;
      break;
    }
    round = Math.floor(n / k);
    total += k * round;
    n = n - k * round + round;
  }

  return total;
};

/* refer answer */
numWaterBottles = (n, k) => {
  if (n < k) return n;
  return k + numWaterBottles(n - k + 1, k);
};

/* refer answer */
numWaterBottles = (n, k) => {
  return n + Math.floor((n - 1) / (k - 1));
};

numWaterBottles(9, 3);

numWaterBottles(15, 4);
