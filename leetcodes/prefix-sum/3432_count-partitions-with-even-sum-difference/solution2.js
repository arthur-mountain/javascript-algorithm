/**
 * @param {number[]} nums
 * @return {number}
 */
var countPartitions = function (nums) {
  const total = nums.reduce((a, c) => a + c, 0);
  return (total & 1) === 0 ? nums.length - 1 : 0;
};
