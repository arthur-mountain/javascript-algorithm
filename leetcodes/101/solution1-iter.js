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
 * @return {boolean}
 */
var isSymmetric = function (root) {
  const stack = [root.right, root.left];

  while (stack.length > 0) {
    const left = stack.pop();
    const right = stack.pop();

    if (left == null && right == null) {
      continue;
    } else if (left == null || right == null || left.val !== right.val) {
      return false;
    }

    stack.push(right.right, left.left);
    stack.push(left.right, right.left);
  }

  return true;
};
