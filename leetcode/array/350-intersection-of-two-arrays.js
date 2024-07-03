/*
 * - [x] Done
 *   - using mapping for long array and loop through short array
 * - [] Refer to what others are doing
 */
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
const intersect = (nums1, nums2) => {
  const [long, short] =
    nums1.length > nums2.length ? [nums1, nums2] : [nums2, nums1];
  const longMap = new Map();

  for (const num of long) {
    longMap.set(num, (longMap.get(num) || 0) + 1);
  }

  let result = [];
  for (const num of short) {
    const mnum = longMap.get(num);
    if (mnum) {
      result.push(num);
      longMap.set(num, mnum - 1);
    }
  }

  return result;
};

console.log(intersect([1, 2, 2, 1], [2, 2]));
