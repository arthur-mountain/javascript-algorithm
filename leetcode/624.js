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
   * pick the smallest element from the first array and the largest element from the rest of the arrays
   *
   * compare the difference
   *
   * but the smallest element and the largest element may be in same array so this is not work
   * */
  let s = [-1, Infinity];
  for (let i = 0, len = arrays.length; i < len; i++) {
    if (arrays[i][0] >= s[1]) continue;
    s = [i, arrays[i][0]];
  }

  let max = 0;
  for (let i = 0, len = arrays.length; i < len; i++) {
    if (s[0] === i) continue;
    max = Math.max(max, arrays[i][arrays[i].length - 1]);
  }

  console.log(s, max, Math.abs(s[1] - max));
  return Math.max(Math.abs(s[1] - max), Math.abs(max - s[1]));
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
