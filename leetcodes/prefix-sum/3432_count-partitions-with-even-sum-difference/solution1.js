/**
 * @param {number[]} nums
 * @return {number}
 */
var countPartitions = function (nums) {
  // array
  // partition,
  // splitting  subarrays,
  // left subarray -> [0, i]
  // right subarray -> [i + 1, n - 1]

  const total = nums.reduce((a, c) => (a += c), 0);
  let leftTotal = 0;
  let evenCount = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    const rightTotal = total - (leftTotal += nums[i]);
    const diff = leftTotal - rightTotal;
    if ((diff & 1) === 0) evenCount++;
  }
  return evenCount;
};

var countPartitions = function (nums) {
  // array
  // partition,
  // splitting  subarrays,
  // left subarray -> [0, i]
  // right subarray -> [i + 1, n - 1]

  let rightTotal = nums.reduce((a, c) => (a += c), 0);
  let leftTotal = 0;
  let evenCount = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    leftTotal += nums[i];
    rightTotal -= nums[i];
    const diff = leftTotal - rightTotal;
    if ((diff & 1) === 0) evenCount++;
  }
  return evenCount;
};

/**
 * 完整 Prefix Sum 陣列的版本解法
 * @param {number[]} nums
 * @return {number}
 */
var countPartitions = function (nums) {
  const n = nums.length;

  // Step 1: 建立 prefix sum 陣列
  // prefix[i] 表示 nums[0..i-1] 的總和
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  // Step 2: 枚舉每個分割點
  let count = 0;
  for (let i = 0; i < n - 1; i++) {
    // 左子陣列：nums[0..i]，和為 prefix[i+1]
    const leftSum = prefix[i + 1];
    // 右子陣列：nums[i+1..n-1]，和為 total - leftSum
    const rightSum = prefix[n] - leftSum;
    // 檢查差值是否為偶數
    const diff = leftSum - rightSum;
    if (diff % 2 === 0) {
      count++;
    }
  }

  return count;
};
