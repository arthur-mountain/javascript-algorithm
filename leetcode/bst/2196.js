/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[][]} descriptions
 * @return {TreeNode}
 */
let createBinaryTree = (descriptions) => {
  /*
   * 1. init a nodeMap
   *
   * 2. save child and parent in nodeMap
   *    value is 1 or 0 , 1 means has parent
   *
   * */
  let root = null;
  let nodeMap = new Map();

  for (const [parent, value, isLeft] of descriptions) {
    const key = isLeft ? "left" : "right";

    const parentNode = nodeMap.get(parent) || new TreeNode(parent);
  }

  return root;
};

class TreeNode {
  constructor(val, left, right) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

class BST {
  constructor(root) {
    this.root = root === undefined ? null : root;
  }

  add(val) {
    const newNode = new TreeNode(val);

    if (!root) {
      this.root = newNode;
      return this;
    }

    let current = this.root;
    while (current) {
      if (current.val > newNode.val) {
        current = current.left;
      } else if (current.val < newNode.val) {
        current = current.right;
      } else {
        current;
      }
    }
  }

  bfs(node) {
    if (!this.root) return null;
  }
}

/* refer answer */
createBinaryTree = (descriptions) => {
  let childrenSet = new Set();
  let childrenHashmap = new Map();

  for (let [parent, child, isLeft] of descriptions) {
    if (!childrenHashmap.has(parent)) {
      childrenHashmap.set(parent, [-1, -1]);
    }

    childrenSet.add(child);

    if (isLeft === 1) {
      childrenHashmap.get(parent)[0] = child;
    } else {
      childrenHashmap.get(parent)[1] = child;
    }
  }

  let headNodeVal;
  for (let parent of childrenHashmap.keys()) {
    if (!childrenSet.has(parent)) {
      headNodeVal = parent;
      break;
    }
  }

  return helper(headNodeVal, childrenHashmap);
};

function helper(curNodeVal, childrenHashmap) {
  let newNode = new TreeNode(curNodeVal);
  if (childrenHashmap.has(curNodeVal)) {
    let [left, right] = childrenHashmap.get(curNodeVal);
    if (left !== -1) {
      newNode.left = helper(left, childrenHashmap);
    }
    if (right !== -1) {
      newNode.right = helper(right, childrenHashmap);
    }
  }
  return newNode;
}
