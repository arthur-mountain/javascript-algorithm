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
  // 單趟掃描 (One-pass) 完成找中點與前半段原地反轉。
  // 讓反轉後的前半段與原始後半段，從中間向兩側同步比對。
  //
  // Time: O(n)
  // Space: O(1)

  let max = 0;
  let newList = null; // 用來儲存反轉後的前半段
  let current = head; // 當前遍歷指標
  let currHalf = head; // 快指標，用於定位中點

  // 1. 找中點並同時反轉前半段
  while (currHalf != null && currHalf.next != null) {
    currHalf = currHalf.next.next; // 快指標跳兩格

    let temp = current.next; // 暫存下一個節點
    current.next = newList; // 將當前節點指向反轉鏈
    newList = current; // 更新反轉鏈頭部
    current = temp; // 前進
  }

  // 2. 從中間向兩側擴散計算 Twin Sum
  // 此時 newList 是前半段反轉後的中點，current 是後半段的中點
  while (current != null) {
    max = Math.max(max, current.val + newList.val);
    current = current.next;
    newList = newList.next;
  }

  return max;
};
