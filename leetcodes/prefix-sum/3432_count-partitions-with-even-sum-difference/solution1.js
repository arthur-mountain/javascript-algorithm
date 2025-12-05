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
