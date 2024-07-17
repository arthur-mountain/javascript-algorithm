/*
 * - [x] Done
 * - [] Refer to what others are doing
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
 * @param {number[]} to_delete
 * @return {TreeNode[]}
 */
let delNodes = (root, to_delete) => {
  /*
   * Depth-First Search(ffs) each node,
   *
   * when the parent node needs deleted,
   * then the children node will be the root node of disjoint tree,
   *
   * if the children node is the root node of disjoint tree and
   * itself does not deleted, then add it to result.
   *
   * the actual root node doest not parent, so we check if
   * if node is root node and it not deleted, then add it to result
   */
  const dels = new Set(to_delete);
  let result = [];

  const dfs = (node, isDisjointRootNode) => {
    if (!node) return;

    const isCurrentNodeNeedsDeleted = dels.has(node.val);

    if (node.left) {
      dfs(node.left, isCurrentNodeNeedsDeleted);
      if (dels.has(node.left.val)) node.left = null;
    }

    if (node.right) {
      dfs(node.right, isCurrentNodeNeedsDeleted);
      if (dels.has(node.right.val)) node.right = null;
    }

    if (
      (isDisjointRootNode && !dels.has(node.val)) ||
      (node === root && !isCurrentNodeNeedsDeleted)
    ) {
      result.push(node);
    }
  };

  dfs(root);
  return result;
};

delNodes([1, 2, 3, 4, 5, 6, 7], [3, 5]);
delNodes([1, 2, 4, null, 3], [3]);
delNodes([1, 2, null, 4, 3], [2, 3]);
