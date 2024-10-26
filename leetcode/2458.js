/**
 * - [] Done
 * - [] Follow up solutions
 */
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
 * @param {number[]} queries
 * @return {number[]}
 */
let treeQueries = (root, queries) => {
  /**
       * Removed the rooted at node value is $query from tree,
       * calc the max height of current tree,
       * repeating the processing, until the all queries visited
  
       * Algorithm:
          1. if query is the root node, reutrn 0
  
       *  2. calc the height with BFS.
              2.1. if the node.val == $query, do not push the node to queue.
       */
  const helper = (root, query) => {
    // constraints: query not allowed equals to  root.val
    // if (root.val === query) {
    //     return 0
    // }
    let height = 0;
    let queue = [root];
    while (queue.length) {
      for (let idx = 0, len = queue.length; idx < len; idx++) {
        const node = queue.shift();
        if (node.val === query) continue;
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      if (queue.length) {
        height++;
      }
    }

    return height;
  };

  let heights = [];
  for (const query of queries) {
    heights.push(helper(root, query));
  }
  return heights;
};
