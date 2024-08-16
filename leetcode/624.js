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
   * brute force, pick the each array and compare with the rest of the arrays
   *
   * time limit exceeded
   * */

  let max = 0;
  for (let i = 0; i < arrays.length; i++) {
    for (let j = 0; j < arrays.length; j++) {
      if (i === j) continue;
      max = Math.max(
        max,
        Math.abs(
          arrays[i][arrays[i].length - 1] - arrays[j][0],
          arrays[i][0] - arrays[j][arrays[j].length - 1],
        ),
      );
    }
  }
  return max;
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

maxDistance([
  [1, 5],
  [3, 4],
]);
