/**
 * Backtracking — 標準實作模板集
 *
 * 核心思想：系統性建構候選解，約束違反時立即剪枝，避免探索注定失敗的子樹
 * 適用前提：問題可分解為逐步選擇的遞迴結構，搜尋空間有限（n ≤ ~20）
 */

// ====================================================================
// 模板 1：子集型 Subsets — 基礎版
// ====================================================================
/**
 * 子集型（基礎版）— 列舉所有子集（power set）
 *
 * @param {number[]} nums - 候選元素陣列（元素不重複）
 * @return {number[][]} 所有子集
 *
 * 適用場景：列舉所有子集或所有不限長度的組合
 * 觸發條件：「所有子集」「power set」「所有組合方式」，且元素不重複
 *
 * 時間複雜度：O(n × 2ⁿ) — 共 2ⁿ 個子集，每個需 O(n) 複製
 * 空間複雜度：O(n) — 遞迴深度 + path 長度（不計結果集）
 */
function subsets(nums) {
  const results = [];

  const backtrack = (start, path) => {
    // Step 1: 隱式 Base Case — 子集型每個節點都是合法子集（包括空集），無條件收集
    // 與組合/排列型的差異：不需要判斷長度才收集，也不需要 return
    // ⚠️ 易錯點：必須用 [...path] 複製，因為 path 是 mutable 會被後續 pop() 修改
    results.push([...path]);

    for (let i = start; i < nums.length; i++) {
      // Step 2: Choose — 將 nums[i] 加入當前子集
      path.push(nums[i]);

      // Step 3: Explore — i+1 確保每個元素最多選一次（避免重複子集）
      // 核心：傳入 i + 1，確保「下一層」只能從「當前元素的後面」開始選，避免選到重複元素或順序顛倒
      // 易錯點：若寫成 backtrack(start + 1, path) 會導致漏掉部分組合
      // 與排列型的差異：排列型永遠從 i=0 開始 + used[] 追蹤
      backtrack(i + 1, path);

      // Step 4: Unchoose — 撤銷選擇，嘗試不包含 nums[i] 的分支
      path.pop();
    }
  };

  backtrack(0, []);
  return results;
}

// ====================================================================
// 模板 1b：子集型 Subsets — 去重版
// ====================================================================
/**
 * 子集型（去重版）— 含重複元素時列舉不重複的子集
 *
 * @param {number[]} nums - 候選元素陣列（可能含重複）
 * @return {number[][]} 所有不重複的子集
 *
 * 適用場景：Subsets II — 候選元素有重複
 * 觸發條件：「含重複元素」+「所有不重複的子集」
 *
 * 時間複雜度：O(n × 2ⁿ) — 最壞情況（全部不重複時）
 * 空間複雜度：O(n)
 */
function subsetsWithDup(nums) {
  const results = [];

  // 前提：必須先排序，讓相同值相鄰，去重邏輯才能生效
  nums.sort((a, b) => a - b);

  const backtrack = (start, path) => {
    // Step 1: 隱式 Base Case — 同基礎版
    results.push([...path]);

    for (let i = start; i < nums.length; i++) {
      // Step 2 前置檢查：去重 — 同一層中跳過與前一個相同的值
      // 前提：nums 已排序（見上方 sort）
      // 與基礎版的差異：多了這一行 continue
      if (i > start && nums[i] === nums[i - 1]) continue;

      // Step 2: Choose
      path.push(nums[i]);

      // Step 3: Explore
      backtrack(i + 1, path);

      // Step 4: Unchoose
      path.pop();
    }
  };

  backtrack(0, []);
  return results;
}

// ====================================================================
// 模板 2：組合型 — 固定長度
// ====================================================================
/**
 * 組合型（固定長度）— 從 [1, n] 中選 k 個數
 *
 * @param {number} n - 元素範圍上界
 * @param {number} k - 需要選擇的數量
 * @return {number[][]} 所有 k 長度的組合
 *
 * 適用場景：C(n,k) 列舉
 * 觸發條件：「從 n 個中選 k 個」「固定長度組合」
 *
 * 時間複雜度：O(k × C(n,k))
 * 空間複雜度：O(k)
 */
function combine(n, k) {
  const results = [];

  const backtrack = (start, path) => {
    // Step 1: Base Case — 已選夠 k 個
    if (path.length === k) {
      results.push([...path]);
      return;
    }

    // Step 2 前置檢查：剪枝 — 剩餘可選元素數量不足以湊齊 k 個
    // 還需要 (k - path.length) 個，從 i 到 n 共有 (n - i + 1) 個可選
    // 複雜度來源：這個剪枝避免了大量不可能成功的遞迴分支
    const need = k - path.length;
    for (let i = start; i <= n - need + 1; i++) {
      // Step 2: Choose
      path.push(i);

      // Step 3: Explore
      backtrack(i + 1, path);

      // Step 4: Unchoose
      path.pop();
    }
  };

  backtrack(1, []);
  return results;
}

// ====================================================================
// 模板 2b：組合型 — Combination Sum（可重複選）
// ====================================================================
/**
 * 組合型（目標總和，可重複）— 從候選中選數字湊出 target，元素可重複使用
 *
 * @param {number[]} candidates - 候選數字（無重複）
 * @param {number} target - 目標總和
 * @return {number[][]} 所有總和等於 target 的組合
 *
 * 適用場景：Combination Sum
 * 觸發條件：「組合總和」「可重複使用」
 *
 * 時間複雜度：O(n^(T/min)) — T = target，min = 最小候選值
 * 空間複雜度：O(T/min) — 遞迴深度
 */
function combinationSum(candidates, target) {
  const results = [];

  // 前提：排序以啟用剪枝（當前值超過 remaining 時後面更大的不用試）
  candidates.sort((a, b) => a - b);

  const backtrack = (start, path, remaining) => {
    // Step 1: Base Case — 湊齊目標
    if (remaining === 0) {
      results.push([...path]);
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      // Step 2 前置檢查：剪枝
      // 前提：candidates 已排序，所以當前值超過 remaining 代表後面的也都超過
      // 複雜度來源：這個剪枝大幅減少實際搜尋的分支數
      if (candidates[i] > remaining) break;

      // Step 2: Choose
      path.push(candidates[i]);

      // Step 3: Explore — 傳 i（非 i+1）因為同一元素可重複選取
      // 與 Combination Sum II 的差異：那邊傳 i+1（每個元素只能用一次）
      backtrack(i, path, remaining - candidates[i]);

      // Step 4: Unchoose
      path.pop();
    }
  };

  backtrack(0, [], target);
  return results;
}

// ====================================================================
// 模板 2c：組合型 — Combination Sum II（不可重複 + 候選有重複）
// ====================================================================
/**
 * 組合型（目標總和，不可重複 + 去重）— Combination Sum II
 *
 * @param {number[]} candidates - 候選數字（可能有重複）
 * @param {number} target - 目標總和
 * @return {number[][]} 所有不重複的組合
 *
 * 適用場景：Combination Sum II — 有重複元素，每個只能用一次
 * 觸發條件：「每個數字只能用一次」+「候選有重複」
 *
 * 時間複雜度：O(2ⁿ) — 最壞情況
 * 空間複雜度：O(n)
 */
function combinationSum2(candidates, target) {
  const results = [];

  // 前提：排序同時啟用「去重」和「剪枝」
  candidates.sort((a, b) => a - b);

  const backtrack = (start, path, remaining) => {
    // Step 1: Base Case
    if (remaining === 0) {
      results.push([...path]);
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      // Step 2 前置檢查 1：剪枝 — 當前值超過 remaining
      // 前提：candidates 已排序
      if (candidates[i] > remaining) break;

      // Step 2 前置檢查 2：去重 — 同一層跳過重複值
      // 前提：candidates 已排序
      // 與子集去重版使用完全相同的機制
      if (i > start && candidates[i] === candidates[i - 1]) continue;

      // Step 2: Choose
      path.push(candidates[i]);

      // Step 3: Explore — i+1（每個只用一次）
      // 與可重複版本的差異：那邊傳 i
      backtrack(i + 1, path, remaining - candidates[i]);

      // Step 4: Unchoose
      path.pop();
    }
  };

  backtrack(0, [], target);
  return results;
}

// ====================================================================
// 模板 3：排列型 Permutations — 基礎版
// ====================================================================
/**
 * 排列型（基礎版）— 列舉所有排列（順序有關）
 *
 * @param {number[]} nums - 候選元素陣列（元素不重複）
 * @return {number[][]} 所有排列
 *
 * 適用場景：全排列、順序有關的列舉
 * 觸發條件：「全排列」「所有排列」「不同順序算不同解」，且元素不重複
 *
 * 時間複雜度：O(n × n!) — n! 個排列，每個需 O(n) 複製
 * 空間複雜度：O(n) — 遞迴深度 + used 陣列 + path
 */
function permutations(nums) {
  const results = [];
  const used = new Array(nums.length).fill(false);

  const backtrack = (path) => {
    // Step 1: Base Case — 所有元素都已排入
    if (path.length === nums.length) {
      results.push([...path]);
      return;
    }

    // 與子集/組合型的核心差異：每次都從 i=0 開始（順序有關）
    // 用 used[i] 取代 start 來避免重複使用同一元素
    for (let i = 0; i < nums.length; i++) {
      // Step 2 前置檢查：跳過已使用的元素
      if (used[i]) continue;

      // Step 2: Choose — 標記為已使用（2 個操作）
      used[i] = true;
      path.push(nums[i]);

      // Step 3: Explore
      backtrack(path);

      // Step 4: Unchoose — 與 Choose 嚴格對稱（2 個操作 → 2 個還原）
      // ⚠️ 易錯點：漏掉 used[i] = false 會導致後續分支認為此元素已被佔用
      path.pop();
      used[i] = false;
    }
  };

  backtrack([]);
  return results;
}

// ====================================================================
// 模板 3b：排列型 Permutations — 去重版
// ====================================================================
/**
 * 排列型（去重版）— 含重複元素時列舉不重複的排列
 *
 * @param {number[]} nums - 候選元素陣列（可能含重複）
 * @return {number[][]} 所有不重複的排列
 *
 * 適用場景：Permutations II — 候選元素有重複
 * 觸發條件：「含重複元素」+「所有不重複的排列」
 *
 * 時間複雜度：O(n × n!) — 最壞情況（全不重複）
 * 空間複雜度：O(n)
 */
function permutationsUnique(nums) {
  const results = [];
  const used = new Array(nums.length).fill(false);

  // 前提：必須先排序，讓相同值相鄰，去重邏輯才能生效
  nums.sort((a, b) => a - b);

  const backtrack = (path) => {
    // Step 1: Base Case
    if (path.length === nums.length) {
      results.push([...path]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      // Step 2 前置檢查 1：跳過已使用的元素
      if (used[i]) continue;

      // Step 2 前置檢查 2：去重 — 相同值強制按原始順序選取
      // 前提：nums 已排序（見上方 sort）
      // 與基礎版的差異：多了這一行 continue
      // 與子集/組合去重的差異：那邊用 i > start，這裡用 !used[i-1]
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;

      // Step 2: Choose
      used[i] = true;
      path.push(nums[i]);

      // Step 3: Explore
      backtrack(path);

      // Step 4: Unchoose
      path.pop();
      used[i] = false;
    }
  };

  backtrack([]);
  return results;
}

// ====================================================================
// 模板 4：約束搜尋型 — N-Queens
// ====================================================================
/**
 * 約束搜尋型 — N-Queens（在 n×n 棋盤上放置 n 個皇后使其互不攻擊）
 *
 * @param {number} n - 棋盤大小
 * @return {string[][]} 所有合法配置
 *
 * 適用場景：在結構化空間中搜尋滿足多維約束的配置
 * 觸發條件：「互不衝突地放置」「填入值使其滿足所有規則」
 *
 * 時間複雜度：O(n!) — 第 1 行 n 選，第 2 行 ≤ n-1 選，...
 * 空間複雜度：O(n) — 遞迴深度 + 3 個約束追蹤 Set
 */
function solveNQueens(n) {
  const results = [];
  const cols = new Set(); // 已佔用的列
  const diag1 = new Set(); // 已佔用的主對角線（row - col 恆定）
  const diag2 = new Set(); // 已佔用的副對角線（row + col 恆定）
  const queens = []; // queens[row] = col

  const backtrack = (row) => {
    // Step 1: Base Case — 所有行都放完
    if (row === n) {
      results.push(
        queens.map((col) => ".".repeat(col) + "Q" + ".".repeat(n - col - 1)),
      );
      return;
    }

    for (let col = 0; col < n; col++) {
      // Step 2 前置檢查：約束驗證 — O(1)
      // 主對角線上的格子 (r,c) 的 r-c 為常數；副對角線上的 r+c 為常數
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
        continue; // 剪枝：此位置被攻擊
      }

      // Step 2: Choose — 放置皇后（4 個操作）
      queens.push(col);
      cols.add(col);
      diag1.add(row - col);
      diag2.add(row + col);

      // Step 3: Explore — 處理下一行
      backtrack(row + 1);

      // Step 4: Unchoose — 移除皇后（嚴格對稱於 Choose 的 4 個操作）
      // ⚠️ 易錯點：漏掉任何一個 delete 都會導致後續行的合法位置判斷錯誤
      queens.pop();
      cols.delete(col);
      diag1.delete(row - col);
      diag2.delete(row + col);
    }
  };

  backtrack(0);
  return results;
}
