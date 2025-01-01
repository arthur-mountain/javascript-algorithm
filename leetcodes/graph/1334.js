/*
 * - [] Done
 * - [] Follow up solutions
 */
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number} distanceThreshold
 * @return {number}
 */
let findTheCity = (n, edges, distanceThreshold) => {
  /*
   * sum of the each node and it's neighbors weight is equal to the distanceThreshold.
   *
   * 1. create a graph by edges.
   *    adjacency matrix
   *
   * 2. create a founded variable as tuple [node, sum],
   *  a. if the sum is equal the distanceThreshold,
   *       if not founded node then
   *         set the founded node to the current node.
   *        else if the sum is less than the founded sum,
   *          update the founded node to the current node and sum.
   *        else if the sum is equal the founded sum,
   *          compare the node with the founded node,
   *          the greater node is founded node and founded sum
   *
   * 3. traverse all nodes with dfs
   *
   * edge cases:
   *  1. if the sum greater than the distanceThreshold, then the node skip.
   */

  const graph = Array.from({ length: n }, () => []);

  for (const [s, n, w] of edges) {
    graph[s].push([n, w]);
    graph[n].push([s, w]);
  }

  let founded = [-1, -1];
  let sum = 0;
  // const dfs = (root) => {
  //
  // };
  //
  // dfs();

  console.log(graph);
};

findTheCity(
  4,
  [
    [0, 1, 3],
    [1, 2, 1],
    [1, 3, 4],
    [2, 3, 1],
  ],
  4,
);
// findTheCity(
//   5,
//   [
//     [0, 1, 2],
//     [0, 4, 8],
//     [1, 2, 3],
//     [1, 4, 2],
//     [2, 3, 1],
//     [3, 4, 1],
//   ],
//   2,
// );
