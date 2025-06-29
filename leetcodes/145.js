/**
 * Status:
 *    - [x] Done
 *    - [x] Follow-up solutions
 *
 * Title:
 *    145. Binary Tree Postorder Traversal
 *
 * Topics:
 *    1. Stack
 *    2. Tree
 *    3. Depth-First Search
 *    4. Binary Tree
 *
 * Statements:
 *    Given the root of a binary tree, return the postorder traversal of its nodes' values.
 *
 * Constraints:
 *    1. The number of the nodes in the tree is in the range [0, 100].
 *    2. -100 <= Node.val <= 100
 **/

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
 * @return {number[]}
 */

// postorder: left -> right -> root
let postorderTraversal = (root) => {
  // recursively
  const outputs = [];
  (function postorder(node) {
    if (node == null) {
      return;
    }
    // traverse left subtree and right subtree
    postorder(node.left);
    postorder(node.right);
    // visit node val
    outputs.push(node.val);
  })(root);
  return outputs;
  // Time : O(n)
  // Space: O(log n) for balanced tree, O(n) for skewed tree
};

postorderTraversal = (root) => {
  // iteratively 通用模板
  const outputs = [];
  const stack = root == null ? [] : [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node == null) {
      // visit node val
      outputs.push(stack.pop().val);
      continue;
    }
    // push node and marker
    stack.push(node);
    stack.push(null);
    // traverse left subtree and right subtree
    node.right && stack.push(node.right);
    node.left && stack.push(node.left);
  }
  return outputs;
  // Time : O(n)
  // Space: O(log n) for balanced tree, O(n) for skewed tree
};

postorderTraversal = (root) => {
  // iteratively with two stack
  const outputs = [];
  // 用來存放「走訪整棵樹」的節點，用以把正確的節點順序推進 stack2
  const stack1 = root == null ? [] : [root];
  // 將節點以 root -> right -> left 的順序儲存，後續再以反向 pop 的方式，可以得到 postorder 的結果
  const stack2 = [];

  let current;
  while (stack1.length > 0) {
    // 將 root 推進 stack2
    stack2.push((current = stack1.pop()));

    // 先推左子樹，再推右子樹。
    // 為什麼要先左再右？ 因為我們最終是要在 stack2 中得到「根 -> 右 -> 左」的順序，
    current.left && stack1.push(current.left);
    current.right && stack1.push(current.right);
  }

  // 前處理完成後，stack2 中的順序會是「root -> 右子樹 -> 左子樹...」，
  // 因此只要把 stack2 反向彈出，即可獲得「左 -> 右 -> 根」的後序遍歷
  while (stack2.length > 0) {
    outputs.push(stack2.pop().val);
  }

  return outputs;
  // Time : O(n)
  // Space: O(log n) for balanced tree, O(n) for skewed tree
};

postorderTraversal = (root) => {
  // (待複習，不熟) iteratively 標準作法，業界常見
  const outputs = [];
  const stack = [];
  // current 指向目前要處理的節點，初始為 root
  let current = root;
  // prev 用來記錄「剛剛走完的節點」，用於判斷右子樹是否已經被處理
  let prev = null;
  while (current != null || stack.length > 0) {
    // 1. 若當前節點存在，從該節點往左走到底，沿路把節點 push 進 stack
    while (current != null) {
      stack.push(current);
      current = current.left;
    }

    // 2. peek stack(但不 pop 出來)，目的是確認要不要處理這個節點
    const top = stack[stack.length - 1];

    // 如果「頂端節點」的右子樹不存在 or 已經被處理過(=== prev)，
    // 表示現在可以把這個頂端節點放入結果(因為後序要先處理完左右節點後再處理根節點)
    if (top.right == null || top.right === prev) {
      outputs.push(top.val); // 處理這個頂端節點(加入結果)
      stack.pop(); // 正式把它從堆疊彈出
      prev = top; // 更新 prev，表示這個節點已處理完
    } else {
      // 若頂端節點的右子樹還沒處理，就先轉去處理右子樹
      current = top.right;
    }
  }
  return outputs;
  // Time : O(n)
  // Space: O(log n) for balanced tree, O(n) for skewed tree
};
