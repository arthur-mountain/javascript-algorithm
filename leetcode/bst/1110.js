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
 * @param {number[]} to_delete
 * @return {TreeNode[]}
 */
let delNodes = (root, to_delete) => {
  /*
   * Breadth-First Search(bfs) each node,
   *
   * save dels val to a set, check the node should be delete or not,
   * using set.has instead of array.includes for better time complexity.
   *
   *
   * if meet a node should be delete,
   * start next dfs for current node to save new array
   *
   * if no nodes, push current remain nodes push it to result
   *
   * */
  const dels = new Set(to_delete);
  let result = [];

  const dfs = (node, nodes) => {
    if (!node) {
      return result.push(nodes);
    }

    if (dels.has(node.val)) {
      dfs(node.left, []);
      dfs(node.right, []);
      return;
    }

    nodes.push(node);

    dfs(node.left, nodes);
    dfs(node.right, nodes);
  };

  dfs(root, []);
};

delNodes([1, 2, 3, 4, 5, 6, 7], [3, 5]);
delNodes([1, 2, 4, null, 3], [3]);
