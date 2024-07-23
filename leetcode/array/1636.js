/*
 * - [x] Done
 *   - get the frequency of each number, {[number]: frequency}
 *   - combine numbers with the same frequency, {[frequency]: [numbers]}
 *   - first sort the frequency keys,
 *   - second sort the numbers in the same frequency
 *   - This not the best solution.
 * - [] Refer to what others are doing
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

console.log(frequencySort([1, 1, 2, 2, 2, 3]));
console.log(frequencySort([2, 3, 1, 3, 2]));
console.log(frequencySort([-1, 1, -6, 4, 5, -6, 1, 4, 1]));
