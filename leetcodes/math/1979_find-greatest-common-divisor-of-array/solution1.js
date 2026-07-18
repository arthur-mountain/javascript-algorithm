/**
 * @param {number[]} nums
 * @return {number}
 */
var findGCD = function (nums) {
  // 找出陣列中的最小值與最大值
  let min = nums[0];
  let max = nums[0];
  for (let i = 0; i < nums.length; i++) {
    if (min > nums[i]) min = nums[i];
    if (max < nums[i]) max = nums[i];
  }

  // 從 min 開始往下枚舉，第一個能同時整除 min 與 max 的數就是答案
  // 因為 GCD 不可能大於兩數中較小的那一個
  for (let i = min; i > 0; i--) {
    if (min % i === 0 && max % i === 0) return i;
  }

  // 理論上不會執行到這裡，因為 candidate = 1 一定整除任何整數
  return 1;
};
