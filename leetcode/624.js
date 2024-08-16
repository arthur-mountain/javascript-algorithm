/*
 * - [] Done
 * - [] Follow up solutions
 */
/**
 * @param {number[][]} arrays
 * @return {number}
 */
let maxDistance = (arrays) => {
  /*
   * pick the largest element and the smallest element, and calculate the absolute difference
   *
   *
   * failed test case:
   *    [[1,5],[3,4]]
   *
   * in our implementation,
   * we pick 5 as the largest element and 3 as the smallest element, it's abs(5 - 3) = 2
   *
   * but the correct answer is abs(4 - 1) = 3
   * */

  let max = [-1, 0];
  let v;
  for (let i = 0, len = arrays.length; i < len; i++) {
    v = arrays[i][arrays[i].length - 1];
    if (v <= max[1]) continue;
    max = [i, v];
  }

  let s = Infinity;
  for (let i = 0, len = arrays.length; i < len; i++) {
    if (i === max[0]) continue;
    if (arrays[i][0] >= s) continue;
    s = arrays[i][0];
  }

  return Math.abs(max[1] - s);
};

// maxDistance([
//   [1, 2, 3],
//   [4, 5],
//   [1, 2, 3],
// ]);
//
// maxDistance([[1], [1]]);

maxDistance([
  [-1, 1],
  [-3, 1, 4],
  [-2, -1, 0, 2],
]);

maxDistance([
  [-1, 1],
  [-3, 1, 4],
  [-2, -1, 0, 2],
]);
