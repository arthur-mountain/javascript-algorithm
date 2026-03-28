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

// 2026-03-28 新增中序解法：左右中間判斷
var goodNodesInorder = function (root) {
  const helper = (node, max) => {
    if (node == null) return 0;
    const leftCount = helper(node.left, Math.max(max, node.val));
    const currentCount = node.val >= max ? 1 : 0;
    const rightCount = helper(node.right, Math.max(max, node.val));
    return leftCount + currentCount + rightCount;
  };

  return helper(root, -Infinity);
};

// 2026-03-28 新增後序解法：子樹算完再判斷
var goodNodesPostorder = function (root) {
  // postorder count good nodes
  const helper = (node, max) => {
    if (node == null) return 0;
    const leftCount = helper(node.left, Math.max(max, node.val));
    const rightCount = helper(node.right, Math.max(max, node.val));
    const currentCount = node.val >= max ? 1 : 0;
    return leftCount + rightCount + currentCount;
  };
  return helper(root, -Infinity);
};
