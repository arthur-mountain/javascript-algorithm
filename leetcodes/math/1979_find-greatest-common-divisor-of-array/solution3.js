/**
 * 遞迴版歐幾里得演算法
 */
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function findGCD(nums) {
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  return gcd(max, min);
}
