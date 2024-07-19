/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
let luckyNumbers = (matrix) => {
  /*
   * 1. Find the minimum value and its index in each row
   *
   * 2. Check the other same minValIndex value is less than minVal
   * */

  let matrixLen = matrix.length;
  let temp = [];

  for (let i = 0; i < matrixLen; i++) {
    let minMap = [0, matrix[i][0]];
    for (let j = 1, rowLen = matrix[i].length; j < rowLen; j++) {
      if (matrix[i][j] <= minMap[1]) {
        minMap = [j, matrix[i][j]];
      }
    }
    temp.push(minMap);
  }

  for (let i = 0, len = temp.length; i < len; i++) {
    let [minValIndex, minVal] = temp[i];

    let isLuckNum = true;
    for (let j = 0, len = matrix.length; j < len; j++) {
      if (i === j) continue;

      if (matrix[j][minValIndex] > minVal) {
        isLuckNum = false;
        break;
      }
    }

    if (isLuckNum) {
      return [minVal];
    }
  }

  return [];
};

luckyNumbers([
  [3, 7, 8],
  [9, 11, 13],
  [15, 16, 17],
]); // [15]
luckyNumbers([
  [1, 10, 4, 2],
  [9, 3, 8, 7],
  [15, 16, 17, 12],
]); // [12]
luckyNumbers([
  [7, 8],
  [1, 2],
]); // [7]

luckyNumbers([
  [3, 6],
  [7, 1],
  [5, 2],
  [4, 8],
]); // []

luckyNumbers([[56216], [63251], [75772], [1945], [27014]]); // [75772]
luckyNumbers([
  [57849, 12931, 54418, 4630, 371],
  [57486, 70179, 8512, 6629, 45828],
]); // [6629]
