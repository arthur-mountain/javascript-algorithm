/**
 * Sliding Window - 標準實作模板集
 *
 * 核心思想：用增量更新（加入新元素、移除舊元素）取代整個子序列的重新計算，
 *          將連續子序列問題從 O(n²) 降至 O(n)
 * 適用前提：操作對象是連續子序列 + 約束具有單調性 + 窗口狀態可增量維護
 */

// ====================================================================
// 模板 1：Fixed Size Window
// ====================================================================
/**
 * Fixed Size Window - 窗口大小固定為 k
 *
 * @param {number[]} arr - 輸入序列
 * @param {number} k - 固定窗口大小
 * @return {number} 大小為 k 的窗口中的最大總和
 *
 * 適用場景：窗口大小由題目固定（如「大小為 k 的子陣列的最大總和」）
 * 觸發條件：題目明確給定固定窗口大小 k
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1)
 */
function fixedSizeWindow(arr, k) {
  let left = 0;
  let maxSum = -Infinity;
  let windowSum = 0;

  for (let right = 0; right < arr.length; right++) {
    // Step 1: Expand — 加入右邊新元素
    windowSum += arr[right];

    // Step 2: Shrink — 窗口超過 k 時移除最左元素
    // 用 if 而非 while：固定窗口每次最多超出 1
    if (right - left + 1 > k) {
      windowSum -= arr[left];
      left++;
    }

    // Step 3: Update — 窗口恰好為 k 時才有意義
    if (right - left + 1 === k) {
      maxSum = Math.max(maxSum, windowSum);
    }
  }

  return maxSum;
}

// ====================================================================
// 模板 2：Variable Size Window — 求最長/最大
// ====================================================================
/**
 * Variable Size Window (Max) - 找滿足約束的最長連續子序列
 *
 * @param {string} s - 輸入字串
 * @param {number} k - 約束參數（如：最多 k 種不同字元）
 * @return {number} 滿足約束的最長子字串長度
 *
 * 適用場景：找滿足條件的「最長」連續子序列
 * 觸發條件：題目要求最長/最大 + 約束具有單調性（擴張→更容易違反）
 *
 * 時間複雜度：O(n) — left 和 right 各最多移動 n 次
 * 空間複雜度：O(min(n, 字元集大小))
 */
function variableSizeWindowMax(s, k) {
  let left = 0;
  let maxLen = 0;
  const freq = new Map();

  for (let right = 0; right < s.length; right++) {
    // Step 1: Expand — 加入 s[right]，更新頻率
    const charIn = s[right];
    freq.set(charIn, (freq.get(charIn) || 0) + 1);

    // Step 2: Shrink — 違反約束時持續收縮
    // 與 Fixed Window 的差異：用 while 而非 if
    while (freq.size > k) {
      const charOut = s[left];
      freq.set(charOut, freq.get(charOut) - 1);
      // 易錯點：頻率歸零時必須刪除 key，否則 freq.size 不正確
      if (freq.get(charOut) === 0) freq.delete(charOut);
      left++;
    }

    // Step 3: Update — 收縮後窗口必定合法，更新最大值
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// ====================================================================
// 模板 3：Variable Size Window — 求最短/最小
// ====================================================================
/**
 * Variable Size Window (Min) - 找滿足約束的最短連續子序列
 *
 * @param {number[]} arr - 輸入陣列（全正數）
 * @param {number} target - 目標總和
 * @return {number} 總和 ≥ target 的最短子陣列長度，無解回傳 0
 *
 * 適用場景：找滿足條件的「最短」連續子序列
 * 觸發條件：題目要求最短/最小 + 約束具有單調性（收縮→更不容易滿足）
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(1)
 */
function variableSizeWindowMin(arr, target) {
  let left = 0;
  let minLen = Infinity;
  let windowSum = 0;

  for (let right = 0; right < arr.length; right++) {
    // Step 1: Expand — 加入 arr[right]
    windowSum += arr[right];

    // Step 2 + Step 3: Shrink + Update（合併）
    // 與求最長的關鍵差異：
    // - 收縮條件是「滿足約束」而非「違反約束」
    // - 答案在 while 內更新（每次收縮前窗口都滿足約束）
    while (windowSum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      windowSum -= arr[left];
      left++;
    }
  }

  // 易錯點：無解時 minLen 仍為 Infinity，需特別處理
  return minLen === Infinity ? 0 : minLen;
}

// ====================================================================
// 模板 4：計數型 Sliding Window（atMost 拆解）
// ====================================================================
/**
 * 計數型 Sliding Window - 求「恰好 k 種不同元素」的子陣列數量
 *
 * @param {number[]} arr - 輸入陣列
 * @param {number} k - 恰好 k 種不同元素
 * @return {number} 滿足條件的子陣列數量
 *
 * 適用場景：求恰好/至多滿足某條件的子陣列數量
 * 觸發條件：直接計數 exactly(k) 困難，改用 atMost(k) - atMost(k-1) 拆解
 *
 * 時間複雜度：O(n) — 呼叫兩次 O(n) 的 atMost
 * 空間複雜度：O(min(n, 元素種類數))
 */
function countSubarraysWithExactlyK(arr, k) {
  return atMost(arr, k) - atMost(arr, k - 1);
}

/**
 * 輔助函式：計算「至多 k 種不同元素」的子陣列數量
 *
 * @param {number[]} arr - 輸入陣列
 * @param {number} k - 至多 k 種不同元素
 * @return {number} 滿足 atMost(k) 的子陣列數量
 *
 * 時間複雜度：O(n)
 * 空間複雜度：O(min(n, 元素種類數))
 */
function atMost(arr, k) {
  // 易錯點：k < 0 時直接回傳 0（exactly(0) 會呼叫 atMost(-1)）
  if (k < 0) return 0;

  let left = 0;
  let count = 0;
  const freq = new Map();

  for (let right = 0; right < arr.length; right++) {
    // Step 1: Expand — 加入 arr[right]
    const element = arr[right];
    freq.set(element, (freq.get(element) || 0) + 1);

    // Step 2: Shrink — 不同元素數超過 k 時收縮
    while (freq.size > k) {
      const out = arr[left];
      freq.set(out, freq.get(out) - 1);
      if (freq.get(out) === 0) freq.delete(out);
      left++;
    }

    // Step 3: Update — 以 right 為右端點的合法子陣列數量
    // 關鍵洞察：[left, right], [left+1, right], ..., [right, right]
    // 共 right - left + 1 個子陣列，全部滿足 atMost(k)
    count += right - left + 1;
  }

  return count;
}
