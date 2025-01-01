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
 * @param {number} startValue
 * @param {number} destValue
 * @return {string}
 */
let getDirections = (root, startValue, destValue) => {
  /*
   * find the shortest path from startValue to root,
   *
   * find the shortest path from destValue to root,
   *
   * combine two shortest paths
   */

  let shortestPaths = "";

  const findShortestFromRoot = (node, value) => {
    if (!node) return;

    if (node.val === value) return node;

    findShortestFromRoot(node.left, value);
    findShortestFromRoot(node.right, value);
  };

  print(root);
};

class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function insertIntoBST(root, val) {
  if (root === null) {
    return new TreeNode(val);
  }

  if (val < root.val) {
    root.left = insertIntoBST(root.left, val);
  } else {
    root.right = insertIntoBST(root.right, val);
  }

  return root;
}

function createBST(arr) {
  if (arr.length === 0) return null;

  let root = null;
  for (let val of arr) {
    root = insertIntoBST(root, val);
  }

  return root;
}

function print(tree) {
  console.log(
    require("node:util").inspect(tree, { colors: true, depth: null }),
  );
}

getDirections(createBST([5, 1, 2, 3, null, 6, 4]), 3, 6);
