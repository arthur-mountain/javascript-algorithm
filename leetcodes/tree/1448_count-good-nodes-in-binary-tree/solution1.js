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
  let goodNodeCount = 0;
  const helper = (node, max) => {
    if (node == null) {
      return goodNodeCount;
    }

    if (node.val >= max) {
      goodNodeCount++;
    }

    max = Math.max(max, node.val);
    helper(node.left, max);
    helper(node.right, max);
  };

  helper(root, -Infinity);
  return goodNodeCount;
};

var goodNodesIteration = function (root) {
  const stack = root === null ? [] : [-Infinity, root];
  let goodNodeCount = 0;

  while (stack.length > 0) {
    const node = stack.pop();
    let max = stack.pop();

    if (node.val >= max) {
      goodNodeCount++;
    }

    max = Math.max(max, node.val);
    node.left && stack.push(max, node.left);
    node.right && stack.push(max, node.right);
  }

  return goodNodeCount;
};
