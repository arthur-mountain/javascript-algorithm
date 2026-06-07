/**
 * Fast & Slow Pointers（快慢指標）- 標準實作模板集
 *
 * 核心思想：利用兩個不同速度（或不同起點）的指標在序列中前進，
 *          透過速度差/距離差產生的確定性相遇/位置關係來提取結構資訊。
 * 適用前提：(1) 每個位置 out-degree = 1（恰好一個後繼）
 *          (2) 序列支持逐步前進操作（顯式或隱式的 next function）
 */

// ====================================================================
// 模板 1：環偵測（Cycle Detection）
// ====================================================================
/**
 * 環偵測 - 判斷序列是否包含環
 *
 * @param {ListNode} head - 鏈結串列的頭節點
 * @return {boolean} 是否存在環
 *
 * 適用場景：判斷 Linked List 是否有環、數字序列是否會循環
 * 觸發條件：需要 O(1) 空間偵測環，或序列可能無限循環
 *
 * 時間複雜度：O(n) - fast 最多走 n 步到終點（無環），或在環中最多 C ≤ n 步追上 slow（有環）
 * 空間複雜度：O(1)
 */
function hasCycle(head) {
  // 前提：每個節點 out-degree = 1；head 可為 null（空序列 = 無環）
  // Step 1: Initialize — 兩指標從同起點出發
  let slow = head;
  let fast = head;

  // Step 2: Advance — 持續前進直到 fast 到終點或兩者相遇
  // 複雜度來源：fast 每次走 2 步，最多 n/2 次迭代 → O(n)
  // fast !== null 防止偶數長度越界，fast.next !== null 防止奇數長度越界
  while (fast !== null && fast.next !== null) {
    slow = slow.next; // slow 走 1 步
    fast = fast.next.next; // fast 走 2 步
    // 隱式序列適配：slow = nums[slow] / slow = f(slow)
    // 隱式序列適配：fast = nums[nums[fast]] / fast = f(f(fast))

    // Step 3: Extract — 速度差 = 1，環內間距每步縮減 1 → 最多 C 步相遇
    if (slow === fast) return true;
  }

  // fast 到達終點 → 序列有限 → 無環
  return false;
}

// ====================================================================
// 模板 2：找環入口（Cycle Entry Point / Floyd's Complete Algorithm）
// ====================================================================
/**
 * 找環入口 - 定位環開始的節點
 *
 * @param {ListNode} head - 鏈結串列的頭節點
 * @return {ListNode|null} 環入口節點，無環則回傳 null
 *
 * 適用場景：找鏈結串列環的起點、陣列中的重複數字（287）
 * 觸發條件：需要知道環從哪裡開始，不只是有無環
 *
 * 時間複雜度：O(n) - Phase 1 最多 O(n) + Phase 2 最多 O(n)
 * 空間複雜度：O(1)
 */
function detectCycleEntry(head) {
  // 前提：每個節點 out-degree = 1；head 可為 null
  let slow = head;
  let fast = head;

  // Phase 1: 環偵測 — 找碰撞點（與模板 1 完全相同）
  // 複雜度來源：同模板 1，O(n)
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      // Phase 2: 找環入口（與模板 1 的差異：追加此階段）
      // 數學依據：設 F = 起點到環入口，a = 環入口到碰撞點，C = 環長
      // 碰撞時：2(F+a) = F+a+nC → F = nC-a
      // 從起點走 F 步 = 從碰撞點走 nC-a 步 → 都到達環入口
      // 易錯點：必須用新變數從 head 出發，不可複用 fast
      let pointer = head;
      while (pointer !== slow) {
        pointer = pointer.next;
        slow = slow.next;
      }
      return pointer;
    }
  }

  return null;
}

// ====================================================================
// 模板 3：找中點 — 偏右（Find Middle — Right-biased）
// ====================================================================
/**
 * 找中點 — 偏右 - 偶數長度時回傳後半段第一個
 *
 * @param {ListNode} head - 鏈結串列的頭節點
 * @return {ListNode} 中間節點（偶數長度時回傳後半段第一個）
 *
 * 適用場景：直接回傳中間節點、876 Middle of the Linked List
 * 觸發條件：不知道長度，需要單次遍歷找中點，偶數長度要後半段起點
 *
 * 時間複雜度：O(n) - fast 走完整個串列（n/2 次迭代），slow 走一半
 * 空間複雜度：O(1)
 */
function findMiddle(head) {
  // 前提：head !== null（至少一個節點）
  // Step 1: Initialize
  let slow = head;
  let fast = head;

  // Step 2: Advance — fast 到終點時 slow 在中間
  // 複雜度來源：fast 每次走 2 步，遍歷 n 個節點 → n/2 次迭代 → O(n)
  // 偶數長度 [1,2,3,4]：fast 走 1→3→null，slow 走 1→2→3 → slow 停在 3（偏右中點）
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // Step 3: Extract — 迴圈結束的瞬間，slow 即為偏右中點
  return slow;
}

// ====================================================================
// 模板 4：找中點 — 偏左（Find Middle — Left-biased）
// ====================================================================
/**
 * 找中點 — 偏左 - 偶數長度時回傳前半段最後一個
 *
 * @param {ListNode} head - 鏈結串列的頭節點
 * @return {ListNode} 中間節點（偶數長度時回傳前半段最後一個）
 *
 * 適用場景：Merge Sort 分割鏈結串列（需要在中點前斷開）
 * 觸發條件：偶數長度時需要前半段的尾節點
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1)
 */
function findMiddleLeft(head) {
  // 前提：head !== null（至少一個節點）
  // 易錯點：若串列只有 1 個節點，fast.next 為 null → 條件不成立 → 直接回傳 head，正確
  let slow = head;
  let fast = head;

  // 與模板 3（偏右）的差異：檢查 fast.next.next 而非 fast.next
  // 這讓 slow 在偶數長度時少走一步，停在前半段最後一個
  // 偶數長度 [1,2,3,4]：fast 走 1→3，條件 fast.next.next = null → 停，slow 走 1→2 → slow 停在 2（偏左）
  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // Step 3: Extract — 迴圈結束的瞬間，slow 即為偏左中點
  return slow;
}

// ====================================================================
// 模板 5：找倒數第 k 個（Kth from End）
// ====================================================================
/**
 * 找倒數第 k 個 - 利用固定距離差定位
 *
 * @param {ListNode} head - 鏈結串列的頭節點
 * @param {number} k - 倒數第 k 個（1-indexed）
 * @return {ListNode} 倒數第 k 個節點
 *
 * 適用場景：找或刪除倒數第 k 個節點（19 Remove Nth Node From End of List）
 * 觸發條件：單向鏈結串列，不知道長度，需要一次遍歷
 *
 * 時間複雜度：O(n) - Phase A 走 k 步 + Phase B 走 n-k 步 = n 步
 * 空間複雜度：O(1)
 */
function findKthFromEnd(head, k) {
  // 前提：head !== null；k ≤ 鏈結串列長度（否則 Phase A 中 fast 會越界）
  let slow = head;
  let fast = head;

  // Phase A: Stagger — fast 先走 k 步，建立距離差
  // 與模板 1-4 的差異：不是速度差（2:1），而是距離差（先走 k 步）
  // 易錯點：k 可能等於鏈結串列長度，此時 Phase A 結束後 fast = null，slow = head 就是答案
  for (let i = 0; i < k; i++) {
    fast = fast.next;
  }

  // Phase B: Lockstep — 同速前進直到 fast 到終點
  // 與模板 1-4 的差異：兩指標速度相同（都走 1 步），保持距離差 k 不變
  while (fast !== null) {
    slow = slow.next;
    fast = fast.next;
  }

  // fast 到終點時，slow 距終點恰好 k 步 → 倒數第 k 個
  return slow;
}
