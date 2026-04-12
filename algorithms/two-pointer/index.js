/**
 * Two Pointers - 標準實作模板集
 *
 * 核心思想：利用排序/結構的單調性，讓兩個指標根據比較結果有方向性地移動，
 *          每步至少排除一個候選元素，將 O(n²) 配對搜尋降至 O(n)。
 * 適用前提：序列已排序（對撞型）、鏈結結構（快慢型）、或原地操作需求（分區型）
 */

// ====================================================================
// 模板 1：對撞指標（Opposite Direction）
// ====================================================================
/**
 * 對撞指標 - 在已排序序列上找滿足條件的配對
 *
 * @param {number[]} nums - 已排序的數字陣列
 * @param {number} target - 目標值
 * @return {number[]} 滿足條件的索引對，或 [-1, -1]
 *
 * 適用場景：已排序陣列的配對搜尋（Two Sum II, 3Sum 內層）
 * 觸發條件：已排序 + 找兩元素滿足加法/比較關係
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1)
 */
function oppositeDirection(nums, target) {
  // Step 1: Initialize — 兩端出發
  let left = 0;
  let right = nums.length - 1;

  // 不變量：答案若存在，必在 [left, right] 範圍內
  // 終止條件：left >= right 代表搜尋空間耗盡
  while (left < right) {
    // Step 2: Evaluate — 計算當前配對
    // 【題目特定】：這裡是加法，其他題目可能是減法、面積等
    const sum = nums[left] + nums[right];

    // Step 3: Move — 根據單調性決定方向
    if (sum === target) {
      // Step 4: Update Answer
      return [left, right];
    } else if (sum < target) {
      // 總和不夠大，left 右移取更大值
      // 為什麼不動 right？因為 right 已是當前最大，再往左只會更小
      left++;
    } else {
      // 總和太大，right 左移取更小值
      // 為什麼不動 left？因為 left 已是當前最小，再往右只會更大
      right--;
    }
  }

  return [-1, -1];
}

// ====================================================================
// 模板 2a：快慢指標（Fast-Slow）— 環偵測
// ====================================================================
/**
 * 快慢指標 - Floyd's Cycle Detection
 *
 * @param {ListNode} head - 鏈結串列的頭節點
 * @return {boolean} 是否存在環
 *
 * 適用場景：Linked List Cycle, Happy Number, Find the Duplicate Number
 * 觸發條件：偵測循環結構 + O(1) 空間限制
 *
 * 原理：若存在環，快指標終究會「追上」慢指標（每步距離差縮小 1）
 * 數學證明：設環長 C，進入環後 slow 走了 k 步時 fast 走了 2k 步，
 *          兩者距離差 = k mod C，當 k mod C === 0 時相遇
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1)
 */
function hasCycle(head) {
  // Step 1: Initialize — 同一起點出發
  let slow = head;
  let fast = head;

  // 易錯點：必須先檢查 fast !== null 再檢查 fast.next !== null
  // 因為若 fast 為 null，存取 fast.next 會拋出 TypeError
  while (fast !== null && fast.next !== null) {
    // Step 3: Move — 速度差是核心機制
    // slow 走 1 步，fast 走 2 步
    slow = slow.next;
    fast = fast.next.next;

    // Step 2 + 4: Evaluate + Update — 相遇代表存在環
    if (slow === fast) return true;
  }

  // fast 到達尾端（null），代表無環
  return false;
}

// ====================================================================
// 模板 2b：快慢指標（Fast-Slow）— 找中點
// ====================================================================
/**
 * 快慢指標 - 找 Linked List 中點
 *
 * @param {ListNode} head - 鏈結串列的頭節點
 * @return {ListNode} 中間節點（偶數長度時返回前半段最後節點）
 *
 * 適用場景：Merge Sort 切半、Palindrome Linked List
 * 觸發條件：需要 O(1) 空間找中點
 *
 * 與環偵測的差異：
 * - 環偵測：while (fast !== null && fast.next !== null)
 *   → fast 可以走到 null，因為只關心「是否相遇」
 * - 找中點：while (fast.next !== null && fast.next.next !== null)
 *   → fast 停在最後或倒數第二節點，確保 slow 精確停在中點
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1)
 */
function findMiddle(head) {
  let slow = head;
  let fast = head;

  // 與環偵測的差異：這裡檢查 fast.next && fast.next.next
  // 確保偶數長度時 slow 停在前半段的最後節點（方便切割）
  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}

// ====================================================================
// 模板 3a：分區指標（Partition）— 移除指定元素
// ====================================================================
/**
 * 分區指標 - 原地移除指定元素
 *
 * @param {number[]} nums - 數字陣列（不要求已排序）
 * @param {number} val - 要移除的值
 * @return {number} 移除後的有效長度
 *
 * 適用場景：Remove Element (LC 27)
 * 觸發條件：原地操作 + O(1) 空間 + 移除特定值
 *
 * 核心概念：readIdx 掃描所有元素，writeIdx 只在遇到要保留的元素時前進
 * [0, writeIdx) = 已確認保留的元素
 * [writeIdx, readIdx) = 已確認移除的元素
 * [readIdx, n) = 尚未處理
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1)
 */
function removeElement(nums, val) {
  // Step 1: Initialize — writeIdx 標記下一個有效寫入位置
  let writeIdx = 0;

  for (let readIdx = 0; readIdx < nums.length; readIdx++) {
    // Step 2: Evaluate — 判斷當前元素是否應保留
    // 【題目特定】：這裡是「不等於 val」，其他題目條件不同
    if (nums[readIdx] !== val) {
      // Step 3 + 4: Move + Update — 保留此元素，寫入 writeIdx 位置
      nums[writeIdx] = nums[readIdx];
      writeIdx++;
    }
    // 不保留的元素：readIdx 前進但 writeIdx 不動
    // 效果等同於「跳過此元素」
  }

  return writeIdx;
}

// ====================================================================
// 模板 3b：分區指標（Partition）— 已排序陣列去重
// ====================================================================
/**
 * 分區指標 - 已排序陣列原地去重
 *
 * @param {number[]} nums - 已排序的數字陣列
 * @return {number} 去重後的有效長度
 *
 * 適用場景：Remove Duplicates from Sorted Array (LC 26)
 * 觸發條件：已排序 + 原地去重 + O(1) 空間
 *
 * 與 removeElement 的差異：
 * - removeElement 比較的是「readIdx 的值 vs 固定的 val」
 * - removeDuplicates 比較的是「readIdx 的值 vs 上一個已寫入的值」
 * - 因為已排序，重複值必定相鄰，所以只需比較相鄰即可
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1)
 */
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  // 第一個元素必定保留，所以 writeIdx 從 1 開始
  let writeIdx = 1;

  for (let readIdx = 1; readIdx < nums.length; readIdx++) {
    // 比較對象是 nums[writeIdx - 1]（上一個已確認保留的值）
    // 而非 nums[readIdx - 1]，雖然在去重場景中效果相同
    // 但使用 writeIdx - 1 在邏輯上更精確（表示「與已保留的最後一個比較」）
    if (nums[readIdx] !== nums[writeIdx - 1]) {
      nums[writeIdx] = nums[readIdx];
      writeIdx++;
    }
  }

  return writeIdx;
}

// ====================================================================
// 模板 4：合併指標（Merge）
// ====================================================================
/**
 * 合併指標 - 合併兩個已排序序列
 *
 * @param {number[]} nums1 - 已排序陣列 1
 * @param {number[]} nums2 - 已排序陣列 2
 * @return {number[]} 合併後的排序陣列
 *
 * 適用場景：Merge Sorted Array (LC 88), Merge Two Sorted Lists (LC 21)
 * 觸發條件：兩個已排序來源需要歸併為一個排序結果
 *
 * 核心概念：每次從兩個「隊伍的隊首」中選較小的加入結果
 * 因為兩序列各自已排序，隊首必定是該序列中最小的未處理元素
 *
 * 時間複雜度：O(n + m)
 * 空間複雜度：O(n + m) — 需要輸出陣列
 */
function merge(nums1, nums2) {
  const result = [];
  // Step 1: Initialize — 各序列一個指標
  let i = 0;
  let j = 0;

  // 兩序列都有剩餘元素時，逐一比較
  while (i < nums1.length && j < nums2.length) {
    // Step 2: Evaluate — 比較兩端當前最小元素
    if (nums1[i] <= nums2[j]) {
      // Step 3 + 4: 較小者加入結果，該指標前進
      // 用 <= 而非 < 保證穩定性（相等時優先取 nums1）
      result.push(nums1[i]);
      i++;
    } else {
      result.push(nums2[j]);
      j++;
    }
  }

  // 易錯點：別忘了處理剩餘元素
  // 此時至多只有一個序列有剩餘，直接全部加入
  while (i < nums1.length) {
    result.push(nums1[i]);
    i++;
  }
  while (j < nums2.length) {
    result.push(nums2[j]);
    j++;
  }

  return result;
}
