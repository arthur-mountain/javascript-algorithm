/*
 * - [] Done
 * - [] Refer to what others are doing
 */
/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number[][]}
 */
var getAncestors = function (n, edges) {
  if (!edges.length) {
    return [];
  }

  // TODO: try to using dfs
  // const result = Array.from({ length: n }, () => null);
  //
  // (function dfs(start) {
  //   if (start > edgesLength) {
  //     return;
  //   }
  //
  //   result[start] = [];
  //
  //   for (let neighbor = 0; neighbor < edges[start].length; neighbor++) {
  //     if(edges[start][neighbor]){}
  //
  //   }
  //
  //   dfs(start++);
  // })(0);

  const result = Array.from({ length: n }, () => new Set());

  // each to vertex(index is 1) has from(index is 0) as ancestor
  // but the ancestors should be sorted
  for (let i = 0, length = edges.length; i < length; i++) {
    const [a, v] = edges[i];
    result[v].add(a);
  }

  console.log(result);

  let temp;
  for (let i = 0; i < n; i++) {
    const resultArray = [...result[i]];
    resultArray.forEach((ancestor) => {
      temp = [ancestor, ...result[ancestor]];
    });
    result.push([...new Set(temp)].sort());
    temp = [];
  }

  return result.splice(0, n);
};
try {
  getAncestors(8, [
    [0, 7],
    [7, 6],
    [0, 3],
    [6, 3],
    [5, 4],
    [1, 5],
    [2, 7],
    [3, 5],
    [3, 1],
    [0, 5],
    [7, 5],
    [2, 1],
    [1, 4],
    [6, 1],
  ]);
} catch (error) {
  console.error(error);
}
