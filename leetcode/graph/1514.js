/*
 * - [] Done
 * - [] Follow up solutions
 */
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number[]} succProb
 * @param {number} start_node
 * @param {number} end_node
 * @return {number}
 */
const maxProbability = (n, edges, succProb, start_node, end_node) => {
  let max = 0;

  const adjecntGraph = graphFactory(n, edges, succProb);

  let stack = [start_node];

  while (stack.length) {
    const node = stack.pop();
    if (node === end_node) {
      break;
    }
  }

  console.log(adjecntGraph);

  return max;
};

const graphFactory = (n, edges, succProb) => {
  let adjecntGraph = {};
  for (let i = 0; i < n; i++) {
    const [s, n] = edges[i];
    (adjecntGraph[s] ||= []).push({ node: n, prob: succProb[i] });
    (adjecntGraph[n] ||= []).push({ node: s, prob: succProb[i] });
  }
  return adjecntGraph;
};

maxProbability(
  3,
  [
    [0, 1],
    [1, 2],
    [0, 2],
  ],
  [0.5, 0.5, 0.2],
  0,
  2,
);
