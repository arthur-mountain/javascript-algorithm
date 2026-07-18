/**
 * 歐幾里得演算法（迭代版）
 */
function findGCD(nums) {
  const min = Math.min(...nums);
  const max = Math.max(...nums);

  // 輾轉相除法：gcd(a, b) = gcd(b, a % b)，直到 b === 0
  let a = max;
  let b = min;
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }

  return a; // 迴圈結束時 a 即為 GCD
}
