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

  const result = Array.from({ length: n - 1 }, () => []);
  console.log({ result });

  // each to vertex(index is 1) has from(index is 0) as ancestor
  // but the ancestors should be sorted
  for (let i = 0, lastIndex = edges.length; i < lastIndex; i++) {
    const [a, v] = edges[i];

    // failed in here, could not found result[v]
    result[v].push(a);

    if (result[a].length) {
      result[v].push(...result[a]);
    }
  }

  return result;
};
try {
  console.log(
    getAncestors(8, [
      [0, 3],
      [0, 4],
      [1, 3],
      [2, 4],
      [2, 7],
      [3, 5],
      [3, 6],
      [3, 7],
      [4, 6],
    ]),
  );
  //
  // console.log(
  // getAncestors(5, [[0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]),
  // );
} catch (error) {
  console.error(error);
}
