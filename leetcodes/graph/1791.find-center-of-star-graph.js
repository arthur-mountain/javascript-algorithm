/*
 * - [X] Done
 *   - iterate all edges until the vertex count equals to the length of edges
 * - [X] Follow up solutions
 *   - there must have a center vertex in star graph,
 *   - so we only need to check the first and second edge
 */
/**
 * @param {number[][]} edges
 * @return {number}
 */
var findCenter = function (edges) {
  const length = edges.length;
  const map = {};

  for (const [u, v] of edges) {
    map[u] = (map[u] || 0) + 1;
    if (map[u] === length) return u;
    map[v] = (map[v] || 0) + 1;
    if (map[v] === length) return v;
  }
};

var findCenterReferredSolution = function (edges) {
  // this star graph have to a center vertex,
  // each edge must be connected to center vertex, so
  // we only check the first and second edge.

  // check the first vertex in first edge is as same as second edge first or second vertex
  if (edges[0][0] === edges[1][0] || edges[0][0] === edges[1][1]) {
    return edges[0][0];
  } else {
    return edges[0][1];
  }
};
