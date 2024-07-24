/* - [x] Done
 *   - get mapping num to an array of digits of num, { [num]: [digit1, digit2, ...] }
 *   - replace each digit with the mapping number,
 *   - convert the digits in array to number, also removing the leading zeros, e.g., 0007 -> 7
 *   - sort the original array by our map
 */
/**
 * @param {number[]} mapping
 * @param {number[]} nums
 * @return {number[]}
 */
let sortJumbled = (mapping, nums) => {
  let map = {};

  for (let i = 0, len = nums.length; i < len; i++) {
    map[nums[i]] = nums[i].toString().split("");
    for (let j = 0, mapLen = map[nums[i]].length; j < mapLen; j++) {
      map[nums[i]][j] = mapping[map[nums[i]][j]];
    }
    map[nums[i]] = +map[nums[i]].join("");
  }

  return nums.sort((a, b) => map[a] - map[b]);
};


sortJumbled([8, 9, 4, 0, 2, 1, 3, 5, 7, 6], [991, 338, 38]);
sortJumbled([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [789, 456, 123]);
sortJumbled([9, 8, 7, 6, 5, 4, 3, 2, 1, 0], [9, 99, 999, 9999, 999999999]);
