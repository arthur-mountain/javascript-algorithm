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
  const queue = p == null && q == null ? [] : [p, q];

  while (queue.length > 0) {
    const p = queue.shift();
    const q = queue.shift();

    if (p == null && q == null) {
      continue;
    }

    if (p == null || q == null || p.val !== q.val) {
      return false;
    }

    queue.push(p.left, q.left);
    queue.push(p.right, q.right);
  }

  return true;
};
