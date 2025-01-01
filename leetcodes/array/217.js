/**
 * Status:
 *  - [x] Done
 *  - [x] Follow-up solutions
 *
 * Title:
 *    217. Contains Duplicate
 *
 * Topics:
 *    1. Array
 *    2. Hash Table
 *    3. Sorting
 *
 * Statements:
 *    if found the duplicate num, return true
 *    otherwise return false
 *
 * Constraints:
 *    1. 1 <= nums.length <= 10^5
 *    2. -10^9 <= nums[i] <= 10^9
 **/
/**
 * @param {number[]} nums
 * @return {boolean}
 */
let containsDuplicate = function (nums) {
  // brute force
  // check the length of nums is equal to the length of set
  // Time: O(1)
  // Space: O(n) -> create a new set
  return nums.length !== new Set(nums).size;
};

containsDuplicate = function (nums) {
  // 不用內建的函式處理
  // 用一個 hash table 來記錄目前遍歷到存在的數字
  // 如果發現當遍歷得的數字已經在 hashtable 則 return false
  // Time: O(n)
  // Space: O(n)

  const length = nums.length;
  const map = new Map(); // e.g. { number: any value(like 1)}，我們只需要 lookup key 而已
  for (let i = 0; i < length; i++) {
    if (map.has(nums[i])) {
      return true;
    }
    map.set(nums[i], 1);
  }
  return false;
};
