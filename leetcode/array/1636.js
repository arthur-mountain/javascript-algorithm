/*
 * - [x] Done
 *   - Get the frequency of each number, { [number]: frequency }
 *   - Combine numbers with the same frequency, { [frequency]: [numbers] }
 *   - First, sort the frequency keys
 *   - Second, sort the numbers within the same frequency
 *   - This is not the best solution.
 * - [x] Follow up solutions
 *   - Same concept, but the sort comparison function is cleaner
 */
/**
 * @param {number[]} nums
 * @return {number[]}
 */
let frequencySort = (nums) => {
  let map = {};

  for (const num of nums) {
    if (map[num]) map[num]++;
    else map[num] = 1;
  }

  let result = {};

  for (const [num, frequency] of Object.entries(map)) {
    result[frequency] ||= [];
    result[frequency].push(...Array.from({ length: frequency }, () => num));
  }

  return Object.entries(result)
    .sort((a, b) => a[0].length - b[0].length)
    .flatMap(([_, ns]) => ns.sort((a, b) => b - a));
};

frequencySort = (nums) => {
  let map = {};

  for (const num of nums) {
    map[num] ||= [];
    map[num].push(num);
  }

  let result = {};

  for (const values of Object.values(map)) {
    const len = values.length;
    result[len] ||= [];
    result[len].push(...values);
  }

  return Object.entries(result)
    .sort((a, b) => a[0].length - b[0].length)
    .flatMap(([_, ns]) => ns.sort((a, b) => b - a));
};

/* Follow up */
frequencySort = (nums) => {
  const freq = new Map();

  for (let i = 0; i < nums.length; i++) {
    if (freq.get(nums[i])) {
      freq.set(nums[i], freq.get(nums[i]) + 1);
    } else {
      freq.set(nums[i], 1);
    }
  }

  return nums.sort((a, b) => freq.get(a) - freq.get(b) || b - a);
};

console.log(frequencySort([1, 1, 2, 2, 2, 3]));
console.log(frequencySort([2, 3, 1, 3, 2]));
console.log(frequencySort([-1, 1, -6, 4, 5, -6, 1, 4, 1]));
