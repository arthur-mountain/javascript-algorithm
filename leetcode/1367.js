/*
 * - [] Done
 * - [] Follow up solutions
 */
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
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
 * @param {ListNode} head
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSubPath = function (head, root) {
  let isSub = false;
  const dfs = (startHead, node) => {
    if (node.val === startHead.val) {
      startHead = startHead.next;
    } else if (node.val === head.val) {
      startHead = head.next;
    } else {
      startHead = head;
    }

    if (!startHead) return (isSub = true);

    node.left && dfs(startHead, node.left);
    node.right && dfs(startHead, node.right);
  };
  dfs(head, root);
  return isSub;
};
