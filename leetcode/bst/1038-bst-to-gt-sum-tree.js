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
  //  - leaf node have same value
  //
  //  - go up to parent node
  //    - parnet node value += first right child value
  //
  //    - parent node left child value +=  parent node value + sum of parent node left child right child value
  //      - sum of parent node left child right child value
  //
  //  - until go up to root node
  //    - Go to rightmost node of left child node of root node
  //      - leaf node = left child node value + root node value
  //
  //    - go up to parent node
  //      - parnet node value = parent node value + first right child value
  //      - parent node left child value = parent node left child value + parent node value

  const sumOfLeftChilds = (root) => {
    sumOfRightChilds(root.left);

    root.left.left.val += root.left.val;
    while (current) {
      current.val += root.left.val;
      current = current.left;
    }
  };

  const sumOfRightChilds = (root) => {
    let current = root;
    let stack = [];
    while (current) {
      stack.push(current);
      current = current.right;
    }

    while (stack.length) {
      const node = stack.pop();

      if (node.right) node.val += node.right.val;

      if (node.left) {
        let temp = node.left;
        while (temp) {
          sumOfRightChilds(node.left);
          temp.val += node.val;
          temp = temp.left;
        }
      }
    }
  };

  const getDfsRightStack = (root) => {
    let current = root;
    let stack = [];
    // 1. Go to rightmost node
    while (current) {
      stack.push(current);
      current = current.right;
    }
    return stack;
  };

  const calculate = (stack) => {
    while (stack.length) {
      // 2. Go up to parent node
      let node = stack.pop();

      // 2.1 parnet node value += first right child value
      if (node.right) node.val += node.right.val;

      if (node.left) {
        if (node.left.right) calculate(getDfsRightStack(node.left));
        node.left.val += node.val + (node.left.right ? node.left.right.val : 0);
      }
    }
  };

  calculate(getDfsRightStack(root));
  // 4. until go up to root node
  const stack = getDfsRightStack(root.left);
  while (stack.length) {
    let node = stack.pop();

    node.val += root.val + (node.right ? node.right.val : 0);

    if (node.left) {
    }
  }

  // const _bstToGst = (root) => {
  //   // find the rightmost node
  //   let current = root.right;
  //   let stack = [root];
  //   /* O(log n) */
  //   while (current) {
  //     if (current.right) stack.push(current.right);
  //     current = current.right;
  //   }
  //
  //   /* O((log n) ^ 2) */
  //   while (stack.length) {
  //     let node = stack.pop();
  //
  //     // node.val = node.val + node.right.val
  //     if (node.right) node.val += node.right.val;
  //
  //     // node.left.val = node.left.val + node.val + sum of  node.left.right.val
  //     if (node.left) {
  //       current = node.left;
  //       while (current) {
  //         _bstToGst(current);
  //         current.val += current.val + (current.right ? current.right.val : 0);
  //         current = current.left;
  //       }
  //     }
  //   }
  // };
  //
  // _bstToGst(root);
  return root;
};
