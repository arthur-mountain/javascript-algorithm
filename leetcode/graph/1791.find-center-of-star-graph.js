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
