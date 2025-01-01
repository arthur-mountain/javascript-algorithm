/*
 * - [] Done
 * - [] Follow up solutions
 */

/**
 * @param {number[][]} points
 * @return {number}
 */
let maxPoints = (points) => {
  /*
   * m = points.length
   * n = points[0].length cause it's m x n matrix
   *
   * 1. pick the optimal cells
   *  pick the max value and save it row/col index for subtract
   *
   *  in this implementation in the three test case will failed,
   *  if we pick max value but the col is too far that make sum is less than others,
   *  so we need to calc the max value by check sum of value with previous optimal and subtract the col index is grate than previous
   *
   * 2. calculate the optimal cells
   *   sum the max value as score but subtract value by row/col index
   **/

  let optimals = []; // e.g. [{value, row, col}]
  let score = 0;

  for (let i = 0, len = points.length; i < len; i++) {
    let optimal = { value: points[i][0], row: i, col: 0 };
    for (let j = 1, subLen = points[i].length; j < subLen; j++) {
      if (points[i][j] > optimal.value) {
        optimal.value = points[i][j];
        optimal.col = j;
      }
    }
    optimals.push(optimal);
  }

  for (let i = 0, len = optimals.length; i < len; i++) {
    score += optimals[i].value;
    if (i > 0) {
      score -= Math.abs(optimals[i].col - optimals[i - 1].col);
    }
  }

  // console.log(score);
  return score;
};

// maxPoints([
//   [1, 2, 3],
//   [1, 5, 1],
//   [3, 1, 1],
// ]);
//
// maxPoints([
//   [1, 5],
//   [2, 3],
//   [4, 2],
// ]);

maxPoints([
  [0, 3, 0, 4, 2],
  [5, 4, 2, 4, 1],
  [5, 0, 0, 5, 1],
  [2, 0, 1, 0, 3],
]);
