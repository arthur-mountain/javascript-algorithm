/*
 * - [] Done
 * - [] Follow up solutions
 */
/**
 * @param {number} n
 * @param {number[][]} roads
 * @return {number}
 */
var maximumImportance = function (n, roads) {
  // the node that connected to the most other nodes should be n,
  // the second most connected node should be n-1, and so on
};

console.log(
  "first sum: ",
  maximumImportance([
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 2],
    [1, 3],
    [2, 4],
  ]),
);
console.log(
  "first sum: ",
  maximumImportance([
    [0, 3],
    [2, 4],
    [1, 3],
  ]),
);
