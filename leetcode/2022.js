/**
 * - [x] Done
 * - [x] Follow up solutions
 *   - check the original array is valid with not equal to rol * col then return empty array
 *   - use built in function like slice or splice
 *   - splice is better space complexity because it's mutate the array
 */
/**
 * @param {number[]} original
 * @param {number} m
 * @param {number} n
 * @return {number[][]}
 */
let construct2DArray = (original, rol, col) => {
  if (original.length !== rol * col) return [];

  let result = [];

  /* slice */
  // let startIndex;
  // for (let i = 0; i < rol; i++) {
  //   startIndex = i * col;
  //   result.push(original.slice(startIndex, startIndex + col));
  // }

  /* splice */
  for (let i = 0; i < rol; i++) {
    result.push(original.splice(0, col));
  }

  return result;
};

console.log(construct2DArray([1, 2, 3, 4], 2, 2)); // [[1, 2], [3, 4]]
console.log(construct2DArray([1, 2, 3], 1, 3)); // [[1,2,3]]
console.log(construct2DArray([1, 2], 1, 1)); // []
console.log(construct2DArray([3], 1, 2)); // []
console.log(construct2DArray([5], 3, 1)); // []
