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
 * @return {TreeNode}
 */
const bstToGst = (root) => {
  if (!root) return root;

  // - Go to rightmost node
  //
  // - Start at rightmost node,
  //   - current is sum = 0
  //   - the current node value will be sum += self.val
  //   - go up to parent node
  //   - parnet node value will be sum += parent.val
  //   - if left node exists, go to left node
  //     - recursively repeat the above steps

  let sum = 0;
  const _sum = (rootNode) => {
    let current = rootNode;
    let stack = [];
    while (current) {
      stack.push(current);
      current = current.right;
    }

    while (stack.length) {
      const node = stack.pop();

      node.val = sum += node.val;

      if (node.left) {
        _sum(node.left);
      }
    }

    return rootNode;
  };

  return _sum(root);
};

const bstToGstBFS = (root) => {
  let sum = 0;

  const dfs = (node) => {
    if (!node) return;

    dfs(node.right);

    sum += node.val;
    node.val = sum;

    dfs(node.left);
  };

  dfs(root);

  return root;
};
