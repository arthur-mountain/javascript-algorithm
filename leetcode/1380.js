/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
let luckyNumbers = (matrix) => {
  /*
   * */

  let matrixLen = matrix.length;
  let temp = [];

  for (let i = 0; i < matrixLen; i++) {
    let minMap = [Infinity, Infinity];
    for (let j = 0, colLen = matrix[i].length; j < colLen; j++) {
      if (matrix[i][j] <= matrix[i][minMap[0]]) {
        minMap = [i, j];
      }
    }
    temp.push(minMap);
  }

  console.log(temp);
  // console.log(matrix);

  // for (let i = 0; i < matrixLen; i++) {
  //   const [minVal, minValColIndex, minValIndex] = temp[i];
  //
  //   let isLucky = true;
  //   for (let j = 0, colLen = matrix[i].length; j < colLen; j++) {
  //     if (minValColIndex === j) continue;
  //
  //     if (minVal < matrix[j]?.[minValIndex]) {
  //       isLucky = false;
  //       break;
  //     }
  //   }
  //
  //   if (isLucky) {
  //     console.log([minVal]);
  //     return [minVal];
  //   }
  // }
  // console.log([]);

  return [];
};

// luckyNumbers([
//   [3, 7, 8],
//   [9, 11, 13],
//   [15, 16, 17],
// ]); // [15]
luckyNumbers([
  [1, 10, 4, 2],
  [9, 3, 8, 7],
  [15, 16, 17, 12],
]); // [12]
// luckyNumbers([
//   [7, 8],
//   [1, 2],
// ]); // [7]
//
// luckyNumbers([
//   [3, 6],
//   [7, 1],
//   [5, 2],
//   [4, 8],
// ]); // []
//
// luckyNumbers([[56216], [63251], [75772], [1945], [27014]]); // []
// luckyNumbers([
//   [57849, 12931, 54418, 4630, 371],
//   [57486, 70179, 8512, 6629, 45828],
// ]); // []
