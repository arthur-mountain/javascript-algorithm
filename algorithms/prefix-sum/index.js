const createPrefixSum = (arr) => {
  // prefixSum[0] = 0 (方便計算)
  // prefixSum[i] = prefixSum[i-1] + nums[i-1]
  const prefixSum = Array(arr.length + 1).fill(0);

  for (let i = 1; i <= arr.length; i++) {
    prefixSum[i] = prefixSum[i - 1] + arr[i - 1];
  }

  return prefixSum;
};

export { createPrefixSum };
