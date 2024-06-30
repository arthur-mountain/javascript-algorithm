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

  const result = Array.from({ length: n }, () => []);
  console.log(result);

  // TODO try to using dfs
  // each to vertex(index is 1) has from(index is 0) as ancestor
  // but the ancestors should be sorted
  for (let i = 0, length = edges.length; i < length; i++) {
    const [a, v] = edges[i];

    result[v].push(a);

    if (result[a].length) {
      result[v].push(...result[a]);
    }
  }

  for (let i = 0, length = result.length; i < length; i++) {
    result[i] = [...new Set(result[i])].sort();
  }

  return result;
};
try {
  console.log(
    getAncestors(6, [
      [0, 3],
      [5, 0],
      [2, 3],
      [4, 3],
      [5, 3],
      [1, 3],
      // TODO: add 2 as ancestor of 5 after [5,0] so the 0 index will less 2
      [2, 5],
      [0, 1],
      [4, 5],
      [4, 2],
      [4, 0],
      [2, 1],
      [5, 1],
    ]),
  );
} catch (error) {
  console.error(error);
}
