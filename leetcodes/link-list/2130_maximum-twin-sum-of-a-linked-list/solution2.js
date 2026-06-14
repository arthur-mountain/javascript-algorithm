/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 * this.val = (val===undefined ? 0 : val)
 * this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {number}
 */
var pairSum = function (head) {
  // 核心概念：
  // 為了達成 O(1) 空間複雜度，因此不使用額外空間儲存數據。
  // 透過快慢指標找到中點，原地反轉後半段鏈結串列，
  // 最後同步遍歷前半段與反轉後的後半段來計算最大 Twin Sum。
  //
  // Time: O(n)
  // Space: O(1)

  // 初始化
  let slow = head;
  let fast = head;

  // 1. 使用快慢指針找中點
  // fast 走兩步，slow 走一步，當 fast 結束時，slow 到達後半段起始點
  while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // 2. 反轉後半段鏈結串列 (In-place Reversal)
  // 將 slow 之後的節點反轉方向
  let prev = null;
  let curr = slow;
  let nextNode = null;
  while (curr != null) {
    nextNode = curr.next; // 暫存下一個節點
    curr.next = prev; // 將指針轉向
    prev = curr; // prev 前進
    curr = nextNode; // curr 前進
  }

  // 3. 同步遍歷並計算 Twin Sum
  // head 從頭開始，prev 為反轉後後半段的頭，兩者同步往後走
  let max = -Infinity;
  let firstHalf = head;
  let secondHalf = prev;
  while (secondHalf != null) {
    max = Math.max(max, firstHalf.val + secondHalf.val);
    firstHalf = firstHalf.next;
    secondHalf = secondHalf.next;
  }

  return max;
};
