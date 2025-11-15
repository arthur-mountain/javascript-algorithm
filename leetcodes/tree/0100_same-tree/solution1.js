/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
var isSameTree = function (p, q) {
  if (q == null && p == null) {
    return true;
  }

  if (q == null || p == null || q.val !== p.val) {
    return false;
  }

  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
};

var isSameTreeIteration = function (p, q) {
  const stack = p == null && q == null ? [] : [q, p];

  while (stack.length > 0) {
    const p = stack.pop();
    const q = stack.pop();

    if (p == null && q == null) {
      continue;
    }

    if (p == null || q == null || p.val !== q.val) {
      return false;
    }

    stack.push(q.left, p.left);
    stack.push(q.right, p.right);
  }

  return true;
};
