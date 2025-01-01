/**
 * - [x] Done
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
  const height = new Map(); // 節點子樹高度
  const depth = new Map(); // 節點深度
  const maxHeight = new Map(); // 不經過節點的最大高度

  // 第一次DFS：計算深度和高度
  function calculateHeightAndDepth(node, d = 0) {
    if (!node) return -1; // 如果是空的，回傳-1

    // 記錄這個節點在第幾層
    depth.set(node.val, d);

    // 往左右兩邊走，看看各自最深能走多遠
    const leftHeight = calculateHeightAndDepth(node.left, d + 1);
    const rightHeight = calculateHeightAndDepth(node.right, d + 1);

    // 這個節點的高度 = 最深的那邊 + 1
    const h = Math.max(leftHeight, rightHeight) + 1;
    height.set(node.val, h);

    return h;
  }

  // 第二次DFS：計算不經過每個節點的最大高度
  function calculateMaxHeight(node, maxPathLength = 0) {
    if (!node) return;

    // 先知道自己在第幾層
    const d = depth.get(node.val);

    // 看看左右兩邊各自可以走多遠
    const leftHeight = node.left ? height.get(node.left.val) + 1 : 0;
    const rightHeight = node.right ? height.get(node.right.val) + 1 : 0;

    // 處理左子節點
    if (node.left) {
      // 如果移除左子節點，可能的最長路徑有兩種：
      // 1. 從上面傳下來的路徑長度(maxPathLength)
      // 2. 從這個節點往右子樹走的路徑(d + rightHeight)
      const pathWithoutLeft = Math.max(maxPathLength, d + rightHeight);
      maxHeight.set(node.left.val, pathWithoutLeft);

      // 繼續往左邊走，更新可能的最長路徑
      calculateMaxHeight(node.left, Math.max(maxPathLength, d + rightHeight));
    }

    // 處理右子節點（邏輯同上，但換成考慮左子樹）
    if (node.right) {
      const pathWithoutRight = Math.max(maxPathLength, d + leftHeight);
      maxHeight.set(node.right.val, pathWithoutRight);
      calculateMaxHeight(node.right, Math.max(maxPathLength, d + leftHeight));
    }
  }

  calculateHeightAndDepth(root);
  calculateMaxHeight(root);

  return queries.map((q) => maxHeight.get(q));
};
