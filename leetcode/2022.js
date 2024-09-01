/**
 * - [x] Done
 * - [] Follow up solutions
 */
/**
 * @param {number[]} original
 * @param {number} m
 * @param {number} n
 * @return {number[][]}
 */
let construct2DArray = (original, rol, col) => {
  const num = rol * col;
  const len = original.length;

  if (num > len || num < len) return [];

  let result = [];

  for (let r = 0; r < rol; r++) {
    let subArr = [];
    for (let c = 0; c < col; c++) {
      subArr.push(original[r * col + c]);
    }
    result.push(subArr);
  }

  return result;
};

console.log(construct2DArray([1, 2, 3, 4], 2, 2)); // [[1, 2], [3, 4]]
console.log(construct2DArray([1, 2, 3], 1, 3)); // [[1,2,3]]
console.log(construct2DArray([1, 2], 1, 1)); // []
console.log(construct2DArray([3], 1, 2)); // []
console.log(construct2DArray([5], 3, 1)); // []
