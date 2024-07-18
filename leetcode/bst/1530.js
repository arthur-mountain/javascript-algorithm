/*
 * - [] Done
 * - [] Refer to what others are doing
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} distance
 * @return {number}
 */
let countPairs = (root, distance) => {
  /*
   * continue to find the leaf node, and
   *
   * check the distance from the same parent node between two difference leaf nodes
   *
   * plus two distance from the distance between each leaf node and the same parent
   *
   * if value less equals than the distance, then increase goodPairs
   * */
  let goodPairCount = 0;
  let maxDistanceMap = {};

  const bfs = (node, accDistance = 0) => {
    let queue = [node];
    let height = 0;

    while (1) {
      const current = queue.shift();

      if (!queue.length) {
        height++;
      }

      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  };

  bfs(root);

  return goodPairCount;
};
