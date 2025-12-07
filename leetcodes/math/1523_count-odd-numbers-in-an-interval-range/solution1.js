/**
 * @param {number} low
 * @param {number} high
 * @return {number}
 */
var countOdds = function (low, high) {
  let count = 0;
  for (let i = low; i <= high; i++) {
    // 如果是偶數 -> count += 0
    // 如果是奇數 -> count += 1
    count += i & 1;
  }
  return count;
};
