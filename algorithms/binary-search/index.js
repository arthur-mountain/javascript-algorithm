/**
 * Binary Search - 標準實作模板集
 *
 * 核心思想：利用搜尋空間的單調性，每次比較排除一半，O(n) → O(log n)
 * 適用前提：搜尋空間具有單調性 + 有明確邊界 + 可隨機存取
 *
 * 統一原則：所有 Binary Search 都是「找第一個 T」
 *   - 找第一個 T → 直接套推導鏈
 *   - 找最後一個 T → condition 取反 + return lo - 1
 *
 * 推導鏈（唯一需要記住的）：
 *   不變量：答案在 [lo, hi] 內
 *   → while (lo < hi)
 *   → condition(mid) ? hi = mid : lo = mid + 1
 *   → mid = lo + Math.floor((hi - lo) / 2)
 *   → return lo
 */

// ====================================================================
// 模板 1：精確搜尋（Exact Search）
// ====================================================================
/**
 * 精確搜尋 - 在已排序陣列中找到 target 的索引
 *
 * @param {number[]} nums - 已排序的陣列（升序）
 * @param {number} target - 要搜尋的目標值
 * @return {number} target 的索引，找不到返回 -1
 *
 * 適用場景：題目要求找特定值是否存在及其位置
 * 觸發條件：「sorted array + find target」
 *
 * 時間複雜度：O(log n)
 * 空間複雜度：O(1)
 */
function exactSearch(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;

  // 不變量：答案（如果存在）在 [lo, hi] 內
  // lo === hi 時那個元素可能就是 target，還需要檢查 → 用 <=
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);

    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      // mid 確定不是答案 → 排除 mid（不違反不變量）
      lo = mid + 1;
    } else {
      // mid 確定不是答案 → 排除 mid（不違反不變量）
      hi = mid - 1;
    }
  }

  return -1;
}

// ====================================================================
// 模板 2：找第一個 T（Find First / Lower Bound）——推導鏈原生形式
// ====================================================================
/**
 * 找第一個 T - 找第一個滿足 condition(mid) 為 true 的位置
 *
 * 搜尋空間結構：[F F F F T T T T]
 *                          ↑ 要找這個位置
 *
 * @param {number} lo - 搜尋空間下界（含）
 * @param {number} hi - 搜尋空間上界（含）
 * @param {function} condition - 單調判斷函式（一旦 true 就持續 true）
 * @return {number} 第一個使 condition 為 true 的位置
 *
 * 適用場景：找第一個 ≥ target、第一個 bad version、插入位置
 * 觸發條件：「first / leftmost / lower bound / insert position」
 *
 * 時間複雜度：O(log n)
 * 空間複雜度：O(1)
 */
function findFirst(lo, hi, condition) {
  // 不變量：第一個 T 在 [lo, hi] 內
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);

    if (condition(mid)) {
      // mid 是 T → 保留 mid（排除它違反不變量）
      hi = mid;
    } else {
      // mid 是 F → 排除 mid（它確定不是答案）
      lo = mid + 1;
    }
  }

  // lo === hi，答案鎖定
  // ⚠️ 若所有元素皆為 F，lo 落在哨兵位置，呼叫者需檢查
  return lo;
}

// ====================================================================
// 模板 3：找最後一個 T（Find Last）——語義轉換
// ====================================================================
/**
 * 找最後一個 T - 找最後一個滿足 condition(mid) 為 true 的位置
 *
 * 搜尋空間結構：[T T T T F F F F]
 *                      ↑ 要找這個位置
 *
 * 實作策略：condition 取反 → 找第一個 F → 減 1
 *
 * @param {number} lo - 搜尋空間下界（含）
 * @param {number} hi - 搜尋空間上界（含），通常設為 n 留哨兵位
 * @param {function} condition - 單調判斷函式（一旦 false 就持續 false）
 * @return {number} 最後一個使 condition 為 true 的位置
 *
 * 適用場景：找最後一個 ≤ target、最後一個 good version
 * 觸發條件：「last / rightmost」
 *
 * 時間複雜度：O(log n)
 * 空間複雜度：O(1)
 */
function findLast(lo, hi, condition) {
  // 不變量：第一個 F 在 [lo, hi] 內
  // （hi 通常設為 n，留哨兵位——全部都是 T 時，「第一個 F」在位置 n）
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);

    // 與 findFirst 的唯一差異：condition 取反
    if (!condition(mid)) {
      // mid 是 F → 第一個 F 可能是 mid 或更左邊 → 保留 mid
      hi = mid;
    } else {
      // mid 是 T → 第一個 F 在更右邊 → 排除 mid
      lo = mid + 1;
    }
  }

  // lo 指向第一個 F；lo - 1 即為最後一個 T
  return lo - 1;
}

// ====================================================================
// 模板 4：答案空間二分（找最小可行值）
// ====================================================================
/**
 * 答案空間二分（找最小可行值）
 *
 * @param {number} minVal - 答案值域下界
 * @param {number} maxVal - 答案值域上界
 * @param {function} feasible - 驗證函式（FFFTTT 結構）
 * @return {number} 最小的可行答案值
 *
 * 適用場景：「最小化最大值」「最小 X 使得 Y 可行」
 * 觸發條件：「minimize the maximum / minimum X such that...」
 *
 * 時間複雜度：O(log R × C)，R = maxVal - minVal，C = feasible 成本
 * 空間複雜度：O(1)
 */
function binarySearchOnAnswerMin(minVal, maxVal, feasible) {
  let lo = minVal;
  let hi = maxVal;

  // 完全等同於 findFirst，搜尋空間從陣列索引換成數值範圍
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);

    if (feasible(mid)) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }

  return lo;
}

// ====================================================================
// 模板 5：答案空間二分（找最大可行值）
// ====================================================================
/**
 * 答案空間二分（找最大可行值）
 *
 * @param {number} minVal - 答案值域下界
 * @param {number} maxVal - 答案值域上界（需比實際上界大 1，作為哨兵）
 * @param {function} feasible - 驗證函式（TTTFFF 結構）
 * @return {number} 最大的可行答案值
 *
 * 適用場景：「最大化最小值」
 *
 * 時間複雜度：O(log R × C)
 * 空間複雜度：O(1)
 */
function binarySearchOnAnswerMax(minVal, maxVal, feasible) {
  let lo = minVal;
  let hi = maxVal;

  // 完全等同於 findLast：feasible 取反 → 找第一個不可行 → 減 1
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);

    if (!feasible(mid)) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }

  return lo - 1;
}
