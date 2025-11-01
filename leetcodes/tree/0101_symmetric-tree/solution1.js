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
  const hasSamePath = (left, right) => {
    if (left == null && right == null) {
      return true;
    } else if (left == null || right == null) {
      return false;
    } else {
      return (
        left.val === right.val &&
        hasSamePath(left.left, right.right) &&
        hasSamePath(left.right, right.left)
      );
    }
  };
  return hasSamePath(root.left, root.right);
};
