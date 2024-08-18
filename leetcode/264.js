/*
 * - [] Done
 * - [] Follow up solutions
 */
/**
 * @param {number} n
 * @return {number}
 */
var nthUglyNumber = function (n) {
  let num = 0;
  let count = 0;

  while (true) {
    ++num;
    if (num === 1 || num % 2 === 0 || num % 3 === 0 || num % 5 === 0) {
      count++;
      if (count === n) break;
    }
  }

  return num;
};

console.log(nthUglyNumber(10)); // 12
console.log(nthUglyNumber(11)); // 15
console.log(nthUglyNumber(1)); // 1
