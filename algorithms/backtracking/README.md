# Backtracking

## 🎯 設計理念

### 存在意義

**這個演算法策略被發明出來，是為了解決什麼類型的問題？**

- **暴力法**：列舉所有可能的組合/排列/配置，逐一檢查是否滿足條件。對於 n 個元素的子集問題是 O(2ⁿ)，排列問題是 O(n!)，約束滿足問題可能更差。瓶頸在於：大量分支在很早期就已經注定不會產生合法解，但暴力法仍然完整展開每一條路徑。
- **可利用的結構特性**：問題的約束具有**不可逆性**——部分解一旦違反約束，不可能透過繼續添加元素來修復。選的越多，約束只會越緊，不會越鬆。例如在 Combination Sum 中，當前總和已超過 target，再加任何正數只會更大。
- **核心加速原理**：系統性地建構候選解，在每一步檢查約束條件，一旦當前部分解不可能延伸為合法解就立即剪枝——砍掉以當前選擇為根的整棵子樹，避免逐一展開注定失敗的分支。

### 心智模型

**類比：走迷宮**

想像你在一個分支迷宮中找出口：

- 每到一個岔路口，你選擇一條路往前走（Choose）
- 走到死胡同或已經走過的路，你退回上一個岔路口（Unchoose / Backtrack）
- 在上一個岔路口選另一條路繼續嘗試（Explore next option）
- 如果找到出口，記錄這條路徑（收集結果）

**更精確的類比：有約束的填表**

像填數獨一樣：每個空格嘗試填入 1-9，填入後立即檢查行/列/宮格是否違規。一旦違規，擦掉（Unchoose）換下一個數字。所有數字都試過仍不行，退回上一格重新嘗試。

**局限**：迷宮類比暗示只有一條正確路徑，但 Backtracking 常用於「列舉所有合法解」而非「找唯一解」。數獨類比更準確，但數獨的約束是全域的（行/列/宮格），而許多 Backtracking 問題的約束更局部。

---

## 🏗️ 運作機制

### 核心組件

| 組件                            | 功能                   | 為什麼需要                                   |
| ------------------------------- | ---------------------- | -------------------------------------------- |
| 部分解 `path`                   | 記錄當前已做的選擇序列 | 建構候選解的容器，最終成為結果的一部分       |
| 選擇列表 `choices`              | 當前步驟可用的選項集合 | 定義搜尋空間的寬度（每層的分支數）           |
| 約束條件 `isValid`              | 判斷當前選項是否合法   | 剪枝的依據——不合法的選項直接跳過，不進入子樹 |
| 結果集 `results`                | 收集所有合法的完整解   | 儲存最終答案                                 |
| 遞迴參數（如 `start`, `depth`） | 控制搜尋的進度與範圍   | 避免重複選擇、追蹤遞迴深度、定義子問題邊界   |

### 狀態表示

- **變數與初始狀態**：

  - `path`（當前部分解）：通常是一個 array，記錄從根到當前節點的選擇序列。初始為 `[]`（空的部分解）。
  - `start` 或 `used`：控制「哪些元素可選」——`start` 用於組合/子集（只往後選，避免重複子集），`used` 用於排列（標記已選元素，避免重複使用）。初始為 `start = 0` 或 `used = 全 false`。
  - `results`：收集所有完整合法解的陣列。初始為 `[]`。

- **Invariant（合法條件）**：在任何遞迴呼叫的入口，`path` 代表一個合法的部分解——它本身不違反任何約束，且有可能被延伸為完整合法解。

- **Maintenance（狀態維護）**：
  Backtracking 是修復型演算法。Choose 步驟將新元素加入 `path`，「可能」暫時破壞 Invariant（新選擇是否合法尚未驗證）。為此，約束檢查在 Choose 之前以 `continue` 剪枝，確保只有通過驗證的選項才進入 `path`，從而在 Choose 完成時 Invariant 即已成立。若 Explore 的整棵子樹沒有找到完整解，Unchoose 步驟將 `path` 恢復到 Choose 前的狀態——Choose 加了什麼，Unchoose 就必須嚴格對稱地移除什麼。

- **Extract（結果提取）**：

  - 收集型（列舉所有解）：每次 base case 命中時（`path.length === 目標長度`、`remaining === 0`、或子集型的「每個節點即收集」），將 `path` 的**副本**（`[...path]`）加入 `results`。
  - 搜尋型（找一個解）：第一次 base case 命中時 `return true`，透過逐層短路傳遞立即結束所有遞迴。

- **Termination（終止條件）**：所有分支都已被探索（for loop 耗盡所有選項）或被剪枝（`continue` / `break` 跳過）。遞迴自然收斂，因為每次呼叫都縮小問題規模（`start` 遞增或 `used` 中 true 數量增加）。

### 適用前提條件

**使用這個策略之前，必須確認以下前提條件成立：**

| 前提條件                                                | 為什麼需要                                         | 違反時的後果                                                | 替代方案                                          |
| ------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------- |
| 問題要求列舉所有合法解，或在搜尋空間中找到滿足約束的解  | Backtracking 的核心價值是系統性列舉 + 剪枝         | 如果只需最優解且有重疊子問題，Backtracking 做了大量重複計算 | DP（有重疊子問題時）、Greedy（有貪心選擇性質時）  |
| 問題可以分解為一系列「逐步做選擇」的過程                | 遞迴結構依賴於「每步做一個決策，縮小問題規模」     | 無法定義遞迴子結構，概念上就不適用                          | 數學公式 / 位元運算 / 其他直接計算方法            |
| 約束條件可以在部分解階段就檢查（early pruning）         | 若約束只能在完整解上驗證，剪枝無效，退化為暴力列舉 | 效能與暴力法相同，沒有加速效果（答案仍然正確，只是慢）      | 暴力法 + 後過濾，或重新建模以提取可提前驗證的約束 |
| 搜尋空間有限（n 通常 ≤ 20 for 指數級，≤ 10 for 階乘級） | 即使剪枝，最壞情況仍是指數/階乘複雜度              | 超時（TLE）                                                 | DP、狀態壓縮 DP（n ≤ 20）、數學方法               |

### 與資料結構的關聯

底層所依賴的資料結構來儲存資料與維護狀態：

| 資料結構         | 角色     | 在本演算法中的用途                                           | 典型題目/場景                                |
| ---------------- | -------- | ------------------------------------------------------------ | -------------------------------------------- |
| Array            | 輸入載體 | 儲存候選元素集合                                             | Subsets, Permutations, Combination Sum       |
| Array (path)     | 狀態維護 | 記錄當前部分解（選擇序列）                                   | 所有 Backtracking 問題                       |
| Array (results)  | 狀態維護 | 收集所有合法完整解                                           | 所有列舉型問題                               |
| boolean[] / Set  | 狀態維護 | 記錄元素是否已被使用（排列型）或位置是否被佔用（約束搜尋型） | Permutations, N-Queens                       |
| 2D Array (board) | 輸入載體 | 棋盤/網格的狀態                                              | N-Queens, Sudoku, Word Search                |
| String           | 輸入載體 | 字元序列的排列/組合                                          | Letter Combinations, Palindrome Partitioning |

**關鍵洞察**：Backtracking 定義「何時選擇、何時撤銷、何時剪枝」的邏輯，資料結構負責「高效地記錄與還原狀態」。選擇哪種追蹤結構，取決於問題需要避免什麼樣的重複。

### 流程步驟

**本演算法的流程類型**：執行期流程（Type A）

每次遞迴呼叫中，依序執行以下步驟：

---

1. **Base Case（判斷終止）**

**目的**：檢查當前部分解是否已經是一個完整解，或是否已不需要繼續探索。

**關鍵決策點**：什麼條件代表「部分解已完成」？

- 組合/排列型：`path.length === k`（固定長度）或 `remaining === 0`（目標總和歸零）
- 子集型：每個節點都是合法子集，「收集」在進入遞迴時無條件執行，沒有顯式的 return 型 base case（for loop 耗盡即自然終止）
- 約束搜尋型：「所有行/格都填完」
- 搜尋型（只找一個解）：找到合法解時 `return true`

```javascript
// 組合/排列型：path 達到目標長度
if (path.length === targetLength) {
  results.push([...path]); // ⚠️ 必須複製，因為 path 是 mutable
  return;
}

// 子集型：每個節點即收集（無顯式 return base case）
results.push([...path]);
// for loop 自然終止即可，不需要額外的 return 條件
```

---

2. **Choose（做選擇）**

**目的**：從當前可用選項中選擇一個合法的選項，加入部分解。包含一個前置檢查：剪枝——在做選擇前跳過不合法的選項。

**關鍵決策點**：

- 選項的範圍是什麼？（從 `start` 開始避免重複子集？用 `used[]` 追蹤已選？）
- 剪枝條件是什麼？（值超過 remaining 直接 `break`？同層重複值 `continue`？）
- 如何表示「選了這個」？（`path.push(x)`、`board[r][c] = 'Q'`、`used[i] = true`）

```javascript
for (let i = start; i < candidates.length; i++) {
  // 前置檢查：剪枝 — 跳過不合法的選項（在 Choose 之前，避免修改狀態後再撤銷）
  if (/* 約束檢查失敗，例如 candidates[i] > remaining */) continue;

  // 做選擇
  path.push(candidates[i]);
```

---

3. **Explore（遞迴探索）**

**目的**：在做了選擇的基礎上，遞迴解決「規模更小」的子問題。

**關鍵決策點**：遞迴參數如何變化？

- 子集/組合（不可重複選）：`start = i + 1`
- 組合（可重複選）：`start = i`
- 排列：不用 `start`，靠 `used[]` 控制可選範圍
- 約束搜尋：移動到下一個待填位置（如 `row + 1`）

```javascript
// 遞迴探索：縮小問題規模
backtrack(i + 1, path); // 子集/組合（不可重複）：下一個起點
// backtrack(i, path);  // 組合（可重複）：同一起點
// backtrack(path);     // 排列：靠 used[] 控制
```

---

4. **Unchoose（撤銷選擇）**

**目的**：回溯到做選擇前的狀態，讓下一輪迴圈嘗試其他選項。

**關鍵決策點**：如何正確還原狀態？必須嚴格對稱於 Choose 步驟的每一個操作。Choose 做了幾件事，Unchoose 就必須逆序還原幾件事。

- `path.push(x)` → `path.pop()`
- `used[i] = true` → `used[i] = false`
- `board[r][c] = 'Q'` → `board[r][c] = '.'`

```javascript
  // 撤銷選擇：恢復狀態（與 Choose 嚴格對稱）
  path.pop();
} // for loop 結束，嘗試下一個選項
```

---

**完整骨架**：

以下以組合型為代表。子集型的差異在於 Step 1 退化為「無條件收集」（不 return）。排列型的差異在於用 `used[]` 取代 `start`，且 for 從 `i = 0` 開始。各變體的完整差異見下方模式分類。

```javascript
function backtrack(start, path, results) {
  // Step 1: Base Case — 組合型在此判斷是否完成
  if (path.length === targetLength) {
    results.push([...path]);
    return;
  }

  for (let i = start; i < candidates.length; i++) {
    // Step 2 前置檢查：剪枝（可選）
    if (/* 約束檢查失敗，例如值超過 remaining */) continue;

    // Step 2: Choose
    path.push(candidates[i]);

    // Step 3: Explore
    backtrack(/* 下一個起點 */, path, results);

    // Step 4: Unchoose
    path.pop();
  }
}
```

### 模式分類

**變體總覽**：

```plaintext
Backtracking
├── 子集型 Subsets
│   ├── 基礎版（元素不重複）
│   └── 去重版（元素有重複，需排序 + 同層跳過）
├── 組合型 Combinations
│   ├── 固定長度（從 n 選 k 個）
│   ├── 目標總和 — 可重複選（Combination Sum）
│   └── 目標總和 — 不可重複 + 候選有重複（Combination Sum II）
├── 排列型 Permutations
│   ├── 基礎版（元素不重複）
│   └── 去重版（元素有重複，需排序 + 強制選取順序）
└── 約束搜尋型 Constraint Search（在結構化空間中搜尋滿足多維約束的配置）
```

---

**變體 A：子集型 Subsets — 基礎版**

**觸發條件**：題目要求列舉所有子集（power set，即一個集合的所有可能子集合，包含空集和自身）。關鍵詞：「所有子集」「所有組合」（不限長度）。元素保證不重複。

**與其他變體的核心差異**：每個遞迴節點都是一個合法的部分解（包括空集），所以在進入遞迴時就收集結果，而非只在 base case 收集。

**核心機制 — 避免重複子集**：使用 `start` 參數確保每層只從當前位置往後選，保證 `{1,2}` 和 `{2,1}` 不會被重複列舉。

```javascript
/**
 * 子集型（基礎版）模板
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

      // Step 4: Unchoose — 撤銷選擇，嘗試不包含 nums[i] 的其他分支
      path.pop();
    }
  };

  backtrack(0, []);
  return results;
}
```

---

**變體 A'：子集型 Subsets — 去重版**

**觸發條件**：列舉所有不重複的子集，但候選元素本身有重複值。關鍵詞：「含重複元素」+「所有不重複的子集」。

**與基礎版的差異**：增加排序預處理 + 同層跳過相同值（一行 `continue`）。排序使相同值相鄰，`i > start && nums[i] === nums[i-1]` 確保同一層不會選擇兩次相同的值。`i > start`（而非 `i > 0`）保證只跳過「同層」的重複——不同層選相同值是合法的（如 `[1,1]` 是 `{1,1,2}` 的合法子集）。

```javascript
/**
 * 子集型（去重版）模板
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
    // Step 1: 隱式 Base Case — 同基礎版，每個節點即收集
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
```

---

**變體 B：組合型 Combinations — 固定長度**

**觸發條件**：題目要求「從 n 個元素中選 k 個」（順序無關）。關鍵詞：「選 k 個」「C(n,k)」。

**與子集型的差異**：有明確的目標長度（`path.length === k` 時收集 + return），可以透過「剩餘元素不足以湊齊 k 個」進行更積極的剪枝。

```javascript
/**
 * 組合型（固定長度）模板
 *
 * @param {number} n - 元素範圍 [1, n]
 * @param {number} k - 需要選擇的數量
 * @return {number[][]} 所有 k 長度的組合
 *
 * 適用場景：C(n,k) 列舉
 * 觸發條件：「從 n 個中選 k 個」「固定長度組合」
 *
 * 時間複雜度：O(k × C(n,k)) — C(n,k) 個組合，每個需 O(k) 複製
 * 空間複雜度：O(k) — 遞迴深度 + path 長度
 */
function combine(n, k) {
  const results = [];

  const backtrack = (start, path) => {
    // Step 1: Base Case — 已選夠 k 個
    if (path.length === k) {
      results.push([...path]);
      return;
    }

    // Step 2 前置檢查：剪枝 — 剩餘可選元素不足以湊齊 k 個
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
```

---

**變體 B'：組合型 Combination Sum — 可重複選**

**觸發條件**：題目要求找到總和等於 target 的所有組合，且同一元素可重複使用。關鍵詞：「組合總和」「可重複使用」「湊出 target」。

**與固定長度版本的差異**：base case 從 `path.length === k` 變為 `remaining === 0`；Explore 傳 `i`（非 `i+1`）因為同一元素可重複選取。

```javascript
/**
 * 組合型（目標總和，可重複選）模板
 *
 * @param {number[]} candidates - 候選數字（無重複）
 * @param {number} target - 目標總和
 * @return {number[][]} 所有總和等於 target 的組合
 *
 * 適用場景：Combination Sum — 元素可重複選取
 * 觸發條件：「組合總和」「可重複使用」「湊出 target」
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
```

---

**變體 B''：組合型 Combination Sum II — 不可重複 + 候選有重複**

**觸發條件**：題目要求找到總和等於 target 的所有組合，每個元素只能用一次，且候選中有重複值。關鍵詞：「每個數字只能用一次」「候選有重複」。

**與可重複版本的差異**：（1）Explore 傳 `i + 1`（每個只用一次）；（2）增加同層去重邏輯（與子集去重版相同的 `i > start && nums[i] === nums[i-1]` 機制）。

```javascript
/**
 * 組合型（目標總和，不可重複 + 去重）模板
 *
 * @param {number[]} candidates - 候選數字（可能有重複）
 * @param {number} target - 目標總和
 * @return {number[][]} 所有不重複的組合
 *
 * 適用場景：Combination Sum II — 有重複元素，每個只能用一次
 * 觸發條件：「每個數字只能用一次」+「候選有重複」
 *
 * 時間複雜度：O(2ⁿ) — 最壞情況列舉所有子集
 * 空間複雜度：O(n) — 遞迴深度
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
      // 前提：candidates 已排序（相同值才會相鄰）
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
```

---

**變體 C：排列型 Permutations — 基礎版**

**觸發條件**：題目要求列舉所有排列（ordering matters）。關鍵詞：「所有排列」「全排列」「不同順序算不同結果」。元素保證不重複。

**與子集/組合型的核心差異**：

- 子集/組合用 `start` 控制「只往後選」→ 順序無關
- 排列每次都從頭開始選（`i = 0`），用 `used[]` 標記已選元素 → 順序有關

```javascript
/**
 * 排列型（基礎版）模板
 *
 * @param {number[]} nums - 候選元素陣列（元素不重複）
 * @return {number[][]} 所有排列
 *
 * 適用場景：列舉所有排列（順序有關）
 * 觸發條件：「全排列」「所有排列」「順序不同算不同解」，且元素不重複
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

      // Step 2: Choose — 標記為已使用
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
```

---

**變體 C'：排列型 Permutations — 去重版**

**觸發條件**：列舉所有不重複的排列，但候選元素本身有重複值。關鍵詞：「含重複元素」+「所有不重複的排列」。

**與基礎版的差異**：增加排序預處理 + 強制選取順序。跳過 `nums[i] === nums[i-1] && !used[i-1]` 的情況——`!used[i-1]` 表示前一個相同值的元素在「當前層」沒被選（已被回溯撤銷），代表我們在同一層嘗試選第二個相同值，必須跳過。

直覺：對於 `[1a, 1b, 2]`，強制先選 1a 再選 1b。若 1a 沒被 used（= 不在 path 中）而我們試圖選 1b → 跳過。

```javascript
/**
 * 排列型（去重版）模板
 *
 * @param {number[]} nums - 候選元素陣列（可能含重複）
 * @return {number[][]} 所有不重複的排列
 *
 * 適用場景：Permutations II — 候選元素有重複
 * 觸發條件：「含重複元素」+「所有不重複的排列」
 *
 * 時間複雜度：O(n × n!) — 最壞情況（全不重複時）
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
      // 原因：排列沒有 start 參數，需要用 used 狀態來判斷「同層」
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
```

---

**變體 D：約束搜尋型 Constraint Search**

**觸發條件**：題目要求在搜尋空間中找到滿足特定約束的配置。不是「列舉元素的子集/排列」，而是「在棋盤/網格/結構上放置/填入值」。關鍵詞：「放置 N 個皇后」「填數獨」「在 board 上搜尋」。

**與前三種的核心差異**：

- 前三種的選擇空間是「從候選陣列中選元素」
- 約束搜尋的選擇空間是「在某個位置上填入某個值」
- 約束檢查通常更複雜（行/列/對角線/區塊等多維度約束）
- 往往需要一個 `isValid(position, value)` 函式

```javascript
/**
 * 約束搜尋型模板 — 以 N-Queens 為例
 *
 * @param {number} n - 棋盤大小
 * @return {string[][]} 所有合法的 N 皇后配置
 *
 * 適用場景：在結構化空間中搜尋滿足多維度約束的配置
 * 觸發條件：「放置元素使其互不衝突」「填入值使其滿足所有規則」
 *
 * 時間複雜度：O(n!) — 第 1 行 n 個選擇，第 2 行最多 n-1 個，...
 * 空間複雜度：O(n) — 遞迴深度 + 約束追蹤集合
 */
function solveNQueens(n) {
  const results = [];
  // 用 Set 追蹤被攻擊的列/對角線，實現 O(1) 約束檢查
  const cols = new Set(); // 已佔用的列
  const diag1 = new Set(); // 已佔用的主對角線（row - col 為常數）
  const diag2 = new Set(); // 已佔用的副對角線（row + col 為常數）
  const queens = []; // queens[row] = col，記錄每行皇后的列位置

  const backtrack = (row) => {
    // Step 1: Base Case — 所有行都放完了
    if (row === n) {
      results.push(
        queens.map((col) => ".".repeat(col) + "Q" + ".".repeat(n - col - 1)),
      );
      return;
    }

    for (let col = 0; col < n; col++) {
      // Step 2 前置檢查：約束驗證 — O(1)，三個 Set 分別追蹤列、主對角線、副對角線
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
```

### 複雜度總結

| 變體                                   | 時間複雜度    | 空間複雜度 | 備註                                             |
| -------------------------------------- | ------------- | ---------- | ------------------------------------------------ |
| 子集型（基礎版）                       | O(n × 2ⁿ)     | O(n)       | 2ⁿ 個子集，每個 O(n) 複製                        |
| 子集型（去重版）                       | O(n × 2ⁿ)     | O(n)       | 最壞情況同基礎版（全不重複時），重複多時實際更快 |
| 組合型（固定 k）                       | O(k × C(n,k)) | O(k)       | C(n,k) 個組合，每個 O(k) 複製                    |
| 組合型（Combination Sum，可重複）      | O(n^(T/min))  | O(T/min)   | T = target，min = 最小候選值                     |
| 組合型（Combination Sum II，不可重複） | O(2ⁿ)         | O(n)       | 最壞情況列舉所有子集                             |
| 排列型（基礎版）                       | O(n × n!)     | O(n)       | n! 個排列，每個 O(n) 複製                        |
| 排列型（去重版）                       | O(n × n!)     | O(n)       | 最壞情況同基礎版（全不重複時）                   |
| 約束搜尋型（N-Queens）                 | O(n!)         | O(n)       | 每行的可選列遞減                                 |

**符號定義**：

- `n`：候選元素數量（或棋盤大小）
- `k`：目標選擇數量
- `T`：目標總和值

---

## ⭐ 抽象化翻譯器

**這是最關鍵的部分——建立「問題情境 → 抽象工具」的映射能力**

### 識別核心抽象

> 這個工具的核心對象是：**搜尋樹（Decision Tree）中的節點與路徑**
>
> 它管理的是這些對象之間的什麼關係？**從根節點到葉節點的路徑代表一個完整候選解；每個內部節點的分支代表「當前步驟的可選項」；剪枝是砍掉不合法的子樹**

### 建立映射維度

| 維度             | 要回答的問題                           | 這個答案決定了什麼                                                   |
| ---------------- | -------------------------------------- | -------------------------------------------------------------------- |
| ① 選擇空間       | 每一步有哪些選項？                     | for 迴圈的範圍（Step 2 的迭代空間）                                  |
| ② 順序是否重要   | `{1,2}` 和 `{2,1}` 算同一個還是不同？  | 子集/組合型（用 `start`）vs 排列型（用 `used`）（Step 2 的控制機制） |
| ③ 元素可否重複選 | 同一個元素能否被選多次？               | `i+1`（不可）vs `i`（可重複）（Step 3 的遞迴參數）                   |
| ④ 終止條件       | 什麼構成一個完整解？                   | Step 1 Base Case 的判斷邏輯                                          |
| ⑤ 約束與剪枝     | 什麼情況下部分解一定無法延伸為合法解？ | Step 2 前置檢查的剪枝邏輯                                            |

### 實戰檢查表

```plaintext
題目:_______________

① 選擇空間：每一步可選什麼？_______________
② 順序重要嗎？_______________  → 用 start 還是 used？
③ 元素可重複選嗎？_____________ → i+1 還是 i？
④ 終止條件：_______________
⑤ 剪枝條件：_______________

填完後，選擇對應的變體模板（子集/組合/排列/約束搜尋），填入題目特定的值即可實作。
```

### 映射範例

**題目 A**：39. Combination Sum

| 維度         | 具體問題                          | 抽象映射                 |
| ------------ | --------------------------------- | ------------------------ |
| ① 選擇空間   | candidates 陣列中的每個數字       | `for i = start to n-1`   |
| ② 順序重要嗎 | 不重要（[2,3] 和 [3,2] 同一組合） | 組合型，用 `start`       |
| ③ 可重複選嗎 | 可以（同一數字可重複使用）        | 遞迴時傳 `i`（非 `i+1`） |
| ④ 終止條件   | `remaining === 0`                 | Step 1 收集結果          |
| ⑤ 剪枝       | `candidates[i] > remaining`       | 排序後 `break`           |

**從映射到實作**：選擇「組合型 — Combination Sum（可重複）」模板，填入 `candidates`, `target`, 剪枝條件即可。

**題目 B**：46. Permutations

| 維度         | 具體問題                      | 抽象映射                           |
| ------------ | ----------------------------- | ---------------------------------- |
| ① 選擇空間   | nums 中所有未使用的數字       | `for i = 0 to n-1`，跳過 `used[i]` |
| ② 順序重要嗎 | 重要（[1,2,3] ≠ [3,2,1]）     | 排列型，用 `used[]`                |
| ③ 可重複選嗎 | 不可以                        | `used[i]` 標記                     |
| ④ 終止條件   | `path.length === nums.length` | Step 1 收集結果                    |
| ⑤ 剪枝       | `used[i] === true`            | `continue`                         |

**從映射到實作**：選擇「排列型（基礎版）」模板，直接套用。

---

## 🔍 觸發器(模式識別)

### 正向觸發器

| 層級     | 特徵                                                     | 為什麼這個特徵指向 Backtracking                |
| -------- | -------------------------------------------------------- | ---------------------------------------------- |
| 關鍵字   | 「所有組合」「所有排列」「所有子集」「所有方案」「列舉」 | 明確要求窮舉所有可能性                         |
| 關鍵字   | 「是否存在一種配置使得...」「放置 N 個...」「填入...」   | 約束滿足搜尋                                   |
| 結構     | 輸入是一組離散的候選元素，要從中挑選/排列                | 自然形成決策樹                                 |
| 結構     | 問題有「逐步做選擇」的遞迴子結構                         | 每一步是一個遞迴分支                           |
| 目標     | 輸出是「答案的列表」而非「單一最優值」                   | 列舉 vs 最優化                                 |
| 操作模式 | 選擇 → 驗證 → 探索 → 撤銷 的循環                         | Choose-Explore-Unchoose 模式                   |
| 約束     | n ≤ 20（指數級）或 n ≤ 10（階乘級）                      | 2²⁰ ≈ 10⁶、10! ≈ 3.6×10⁶，都在典型時限內可接受 |
| 約束     | 暴力法是 O(2ⁿ) 或 O(n!)，且沒有重疊子問題                | 無法用 DP 加速，Backtracking + 剪枝是最佳選擇  |

**一句話觸發規則**：「需要列舉所有合法的選擇組合/排列，且問題規模允許指數/階乘複雜度（n ≤ ~20）」→ Backtracking。

### 反向觸發器

| 陷阱情境                                          | 為什麼不適用                                    | 更好的選擇                                        |
| ------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------- |
| 「求最優值」（最大/最小/最長/最短）且有重疊子問題 | Backtracking 會重複計算相同子問題，效率低下     | Dynamic Programming                               |
| 「求數量」（有多少種方案）且 n 較大               | Backtracking 逐一列舉再計數太慢                 | DP 或數學組合公式                                 |
| 每步都有明確的最優選擇且可證明局部最優=全域最優   | 不需要回溯嘗試                                  | Greedy                                            |
| 搜尋空間是連續的（非離散選擇）                    | Backtracking 處理離散決策；連續空間需要數學優化 | Binary Search on answer / 數學方法                |
| n 很大（> 20）且無有效剪枝                        | 指數/階乘複雜度必然 TLE                         | DP、Greedy、或問題需要重新建模                    |
| 約束只能在完整解上驗證（無法提前剪枝）            | 退化為暴力列舉，Backtracking 的剪枝優勢完全消失 | 暴力法 + 後過濾，或重新建模以提取可提前驗證的約束 |

### 與類似工具的決策點

```plaintext
「列舉所有可能性」的問題
├── 有重疊子問題 + 求最優值 → DP
├── 有貪心選擇性質 → Greedy
├── 問題在圖/樹上 + 不需回溯
│   ├── 按層級搜尋 / 最短路徑 → BFS
│   └── 深度搜尋 / 路徑探索 → DFS
├── 需要回溯（嘗試 → 失敗 → 撤銷 → 重試）
│   ├── n ≤ 20 且無重疊子問題 → Backtracking（本演算法）
│   └── n ≤ 20 且有重疊子問題 → Backtracking + Memoization（≈ DP）
└── 問題可以分成獨立子問題 → Divide and Conquer

「Backtracking vs DFS」的精確區分：
├── DFS：圖/樹遍歷，通常「訪問過就標記、不撤銷」
└── Backtracking：搜尋空間探索，「選擇後必須撤銷以嘗試其他分支」
    └── Backtracking = DFS + 狀態撤銷（Unchoose）
```

---

## ⚠️ 注意事項

### 常見陷阱

| 陷阱                                  | 錯誤寫法                               | 正確寫法                                            | 為什麼                                                                                                         |
| ------------------------------------- | -------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 忘記複製 path                         | `results.push(path)`                   | `results.push([...path])`                           | `path` 是 mutable reference，後續 `pop()` 會修改已收集的結果。對 `[1,2,3]` 做完三次 pop 後 results 裡只剩 `[]` |
| 子集/組合用了 `i = 0`                 | `for (let i = 0; ...)`                 | `for (let i = start; ...)`                          | 從 0 開始會產生重複子集（`{2,1}` 和 `{1,2}` 同時出現）。位於所有子集/組合型模板的 Step 2                       |
| 排列去重少了 `!used[i-1]`             | `if (nums[i] === nums[i-1]) continue`  | `if (nums[i] === nums[i-1] && !used[i-1]) continue` | 少了 `!used[i-1]` 會連合法的「不同層選相同值」也跳過，導致結果缺失。位於排列去重版的 Step 2 前置檢查           |
| Unchoose 與 Choose 不對稱             | 只 `path.pop()` 忘記 `used[i] = false` | `path.pop(); used[i] = false;`                      | 漏了任何一個還原操作，後續分支的狀態就是錯的。位於排列型和約束搜尋型的 Step 4                                  |
| 剪枝條件放在 Choose 之後              | 先 `path.push(x)` 再檢查               | 先檢查（`continue`）再 `path.push(x)`               | Choose 之後才檢查意味著已經修改了 `path`，需要額外 Unchoose 才能復原。位於所有模板的 Step 2 前置檢查           |
| 組合去重忘記排序                      | 直接跳過 `nums[i] === nums[i-1]`       | 先 `nums.sort()`，再跳過                            | 不排序的話相同值不相鄰，跳過邏輯不生效。所有含去重的模板都在函式開頭呼叫 sort                                  |
| Combination Sum 用 `i+1` 但應該用 `i` | `backtrack(i + 1, ...)`                | `backtrack(i, ...)`                                 | 題目允許重複選取時，遞迴起點應該是 `i` 而非 `i+1`。位於 Combination Sum 模板的 Step 3                          |

### 常見變體

| 變體                  | 修改內容                                                                                                                                              | 適用場景                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| + Memoization         | 對遞迴狀態加快取（通常用序列化的 state 作 key），在 Step 1 前查快取，在 return 前寫入快取                                                             | 搜尋空間有重疊子問題（此時 Backtracking ≈ top-down DP） |
| + 迭代式 Backtracking | 用顯式 stack 取代遞迴（你在 79. Word Search 已實作過），stack 元素需包含 `directionIndex` 追蹤已試方向                                                | 遞迴深度極大或需要避免 stack overflow                   |
| + 字串建構            | `path` 是字串而非陣列，Choose 用 `+` 拼接，Unchoose 用 `substring(0, len-1)` 回溯                                                                     | Letter Combinations, Generate Parentheses               |
| + 棋盤標記            | 直接在 board 上標記 `'#'` 代替 visited set，Choose 改為 `board[r][c] = '#'`，Unchoose 改為 `board[r][c] = original`。在子集/組合型模板上修改 Step 2/4 | 網格搜尋（Word Search），節省空間                       |
| + 位元遮罩            | 用 bitmask 代替 `used[]` 追蹤已選元素，Choose 改為 `mask \|= (1 << i)`，Unchoose 改為 `mask ^= (1 << i)`。在排列型模板上修改 Step 2/4                 | n ≤ 20 且需要快速子集操作                               |
| + HashMap 去重        | 用 HashMap 追蹤每個值的剩餘可選次數，取代「排序 + 同層跳過」機制。在任何去重版模板上修改 Step 2 前置檢查                                              | 輸入不允許修改（不能排序）時的替代去重方案              |
