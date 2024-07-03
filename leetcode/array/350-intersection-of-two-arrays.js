/*
 * - [x] Done
 *   - using mapping for long array and loop through short array
 * - [x] Refer to what others are doing
 *   - sorting and two pointers
 */
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
let intersect = (nums1, nums2) => {
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

/* Refer answer */
intersect = (nums1, nums2) => {
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);

  let i = 0,
    j = 0,
    result = [];

  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] < nums2[j]) {
      i++;
    } else if (nums1[i] > nums2[j]) {
      j++;
    } else {
      result.push(nums1[i]);
      i++;
      j++;
    }
  }

  return result;
};

console.log(intersect([1, 2, 2, 1], [2, 2]));
