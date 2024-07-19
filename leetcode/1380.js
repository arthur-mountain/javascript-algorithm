/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
let luckyNumbers = (matrix) => {
  /*
   * 1. Find the pair of maximun and minimum number in each row
   *
   * 2. If the minimum number is greater than the previous maximum number, then it is the lucky number currently
   * */
  let luckyPairs = [];

  for (const row of matrix) {
    luckyPairs.push([Math.min(...row), Math.max(...row)]);
  }

  let luckyNumber = [];
  for (let i = 0; i < luckyPairs.length; i++) {
    for (let j = 1; j < luckyPairs.length; j++) {
      if (luckyPairs[i][0] >= luckyPairs[j][1]) {
        luckyNumber[0] = luckyPairs[i][0];
      }
    }
  }

  console.log(luckyNumber);

  return luckyNumber;
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

luckyNumbers([[56216], [63251], [75772], [1945], [27014]]); // []
