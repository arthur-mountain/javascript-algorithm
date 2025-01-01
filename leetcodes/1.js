/**
 * Status:
 *  - [x] Done
 *  - [x] Follow-up solutions
 *
 * Title:
 *    1. Two Sum
 *
 * Topics:
 *    1. Array
 *    2. HashTable
 *
 * Statements:
 *    found the two indices such that they add up to a specific target.
 *
 *    You may assume that each input would have exactly one solution
 *
 * Constraints:
 *    1. 2 <= nums.length <= 10^4
 *    2. -10^9 <= nums[i] <= 10^9
 *    3. -10^9 <= target <= 10^9
 *    4. Only one valid answer exists.
 **/
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
let twoSum = function (nums, target) {
  // brute force
  // iterate all the elements with two loops

  const length = nums.length;
  for (let i = 0; i < length - 1; i++) {
    for (let j = i + 1; j < length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }

  // We may assume that each input would have exactly one solution, so do nothing with default return
};

twoSum = function (nums, target) {
  // optimize with hash table
  //
  // target = nums1 + nums2
  //
  // we can store the subtraction of target and each num in the hash table with the index of the num
  //
  // if we found the num in hash table,
  // we can return the index of the num and the index of the subtraction

  const length = nums.length;
  const map = new Map();
  for (let i = 0; i < length; i++) {
    if (map.has(nums[i])) {
      return [map.get(nums[i]), i];
    } else {
      map.set(target - nums[i], i);
    }
  }

  // We may assume that each input would have exactly one solution, so do nothing with default return
};
