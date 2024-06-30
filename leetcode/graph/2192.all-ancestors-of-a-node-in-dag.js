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
  //   result[start] = [];
  //   const [a, v] = edges[start];
  //   result[start].push(a);
  //
  //   visited.get(v).set(a);
  //
  //   dfs(start++);
  // })(0);

  const result = Array.from({ length: n }, () => []);
  // each to vertex(index is 1) has from(index is 0) as ancestor
  // but the ancestors should be sorted
  for (let i = 0, length = edges.length; i < length; i++) {
    const [a, v] = edges[i];
    result[v].push(a);
  }

  // console.log("before: ", result);

  let temp = [];
  for (let i = 0, length = result.length; i < length; i++) {
    for (let j = 0, length = result[i].length; j < length; j++) {}
    result[i].forEach((ancestor) => {
      temp.push(ancestor);
      if (result[ancestor].length) {
        console.log({ ancestor, new: result[ancestor] });
        temp.push(...result[ancestor]);
      }
    });
    result[i] = [...new Set(temp)].sort();
    // console.log({ i, new: result[i] });
    temp = [];
  }

  // console.log("after: ", result);

  // return result;
};
try {
  console.log(
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
    ]),
  );
} catch (error) {
  console.error(error);
}
