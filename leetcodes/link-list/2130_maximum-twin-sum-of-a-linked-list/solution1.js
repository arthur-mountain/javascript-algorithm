/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {number}
 */
var pairSum = function (head) {
  // even link list
  // return maximum twin sum of link list
  // two pointer, calc the twin sum and capture maximun sum
  //
  // 單向練表，沒辦法 O(1) 取得尾巴的節點，需要先記錄前半段 i 的數字
  // 到後半段後，再累加紀錄最大值。
  // O(n)遍歷＋O(n)紀錄數值
  //
  // 用一個 stack 記錄前半節點的數值
  // 過中間後，一路 pop 前半段節點，並加上當前節點數值後取最大值？
  // 中間的 index 是多少？ slow and fast pointer 取得？
  //
  // slow 往前走時，順便紀錄 stack。
  // 當 fast 結束，slow 到中間時。從 slow 在開始走
  // 一次遍歷O(n)，不用兩次遍歷（取中間值、再重新遍歷技術，O(2n))
  //
  // Time: O(n)
  // Space: O(n/2) -> O(n)

  // 初始化
  let slow = head;
  let fast = head;
  let stack = [];
  let max = -Infinity;

  // 遍歷記錄前半段節點數值到 stack，同時快慢指針找中點
  while (fast != null && fast.next != null) {
    stack.push(slow.val);
    slow = slow.next;
    fast = fast.next.next;
  }

  // slow 剛好到中間，繼續從 slow 往後走後半段
  // 並且把 stack 內前半段節點 pop 出來計算 twin sum，並紀錄最大值
  while (slow != null) {
    max = Math.max(max, stack.pop() + slow.val);
    slow = slow.next;
  }

  return max;
};
