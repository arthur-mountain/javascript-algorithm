/*
 * - [x] Done
 * - [] Follow up solutions
 */
/**
 * // Definition for a _Node.
 * function _Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {_Node|null} root
 * @return {number[]}
 */
// recursively
let postorder = (root) => {
  let values = [];

  const dfs = (node) => {
    if (!node) return;

    if (node.children.length) {
      for (let i = 0; i < node.children.length; i++) {
        dfs(node.children[i]);
      }
    }

    values.push(node.val);
  };

  dfs(root);
  return values;
};

// followup: iteratively
postorder = (root) => {
  let stack = [root];
  let values = [];

  let node;
  while (stack.length) {
    node = stack.pop();

    if (!node) continue;

    if (node.children.length) {
      for (let i = 0; i < node.children.length; i++) {
        stack.push(node.children[i]);
      }
    }

    values.push(node.val);
  }

  return values.reverse();
};
