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
 * @return {number}
 */
var goodNodes = function (root) {
  const queue = root === null ? [] : [root, -Infinity];
  let goodNodeCount = 0;

  while (queue.length > 0) {
    const node = queue.shift();
    let max = queue.shift();

    if (node.val >= max) {
      goodNodeCount++;
    }

    max = Math.max(max, node.val);
    node.left && queue.push(node.left, max);
    node.right && queue.push(node.right, max);
  }

  return goodNodeCount;
};
