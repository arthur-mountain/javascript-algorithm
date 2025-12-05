---
title: "3432. Count Partitions with Even Sum Difference"
tags:
  - Array
  - Math
  - Prefix Sum
difficulty: "Easy"
date_solved: "2025-12-05"
link: "https://leetcode.com/problems/count-partitions-with-even-sum-difference/description/"
---

## 問題描述

給予一個長度為 n 的陣列，找到 pivot index i 作為 partition（0 <= i < n - 1），

回傳有幾個 partition index，使得以該 index 為分界，左右兩邊 subarrays 的總和相減後為偶數。

## Constraints

- 2 <= n == nums.length <= 100
- 1 <= nums[i] <= 100

## 解題思路

### 初步分析（觀察與發想）

- 先計算總和，再透過遍歷時累加當前數字，即可動態得到左右兩邊的 sum

## 解法總覽

### Solution1（Prefix Sum）

- **思路說明**：

  **初始化：**

  - 先計算 total
  - 追蹤 leftTotal 的變數
  - 追蹤當前 partition 達成偶數差的 even count 計數

  **遍歷 nums：**

  - 透過 total 減去當前累積的 leftTotal 可以得到 rightTotal
  - leftTotal - rightTotal 得到 diff，判斷 diff 是否為偶數（正負數不影響，只要看絕對值），若是則計數++

  最後回傳 even count

- **複雜度分析**：

  - 時間複雜度：O(n) → 計算總和 + 遍歷 nums，總共 O(2n)

  - 空間複雜度：O(1) → 沒有額外使用空間儲存，都是數字的加減累積，皆為 O(1)

  - 通過狀態：✅ AC

- **測試案例**：

  - 案例 A: 基本案例（總和為偶數）

    Input: nums = [1, 2, 3, 4]

    Output: 3

    Expected: 3

    Explain:

    ```plaintext
    total = 10（偶數）

    i=0: leftTotal=1, rightTotal=9, diff=1-9=-8 → 偶數 ✓
    i=1: leftTotal=3, rightTotal=7, diff=3-7=-4 → 偶數 ✓
    i=2: leftTotal=6, rightTotal=4, diff=6-4=2 → 偶數 ✓

    所有 partition 都產生偶數差，答案 = 3
    ```

  ***

  - 案例 B: 基本案例（總和為奇數）

    Input: nums = [1, 2, 2]

    Output: 0

    Expected: 0

    Explain:

    ```plaintext
    total = 5（奇數）

    i=0: leftTotal=1, rightTotal=4, diff=1-4=-3 → 奇數 ✗
    i=1: leftTotal=3, rightTotal=2, diff=3-2=1 → 奇數 ✗

    所有 partition 都產生奇數差，答案 = 0
    ```

  ***

  - 案例 C：最小長度陣列（n=2，總和偶數）

    Input: nums = [2, 4]

    Output: 1

    Expected: 1

    Explain:

    ```plaintext
    total = 6（偶數）

    i=0: leftTotal=2, rightTotal=4, diff=2-4=-2 → 偶數 ✓

    只有一個合法 partition，答案 = 1
    ```

  ***

  - 案例 D：最小長度陣列（n=2，總和奇數）

    Input: nums = [1, 2]

    Output: 0

    Expected: 0

    Explain:

    ```plaintext
    total = 3（奇數）

    i=0: leftTotal=1, rightTotal=2, diff=1-2=-1 → 奇數 ✗

    答案 = 0
    ```

  ***

  - 案例 E：全為相同數字（偶數）

    Input: nums = [2, 2, 2, 2]

    Output: 3

    Expected: 3

    Explain:

    ```plaintext
    total = 8（偶數）

    i=0: leftTotal=2, rightTotal=6, diff=-4 → 偶數 ✓
    i=1: leftTotal=4, rightTotal=4, diff=0  → 偶數 ✓
    i=2: leftTotal=6, rightTotal=2, diff=4  → 偶數 ✓

    答案 = 3
    ```

  ***

  - 案例 F：全為相同數字（奇數，偶數個）

    Input: nums = [3, 3, 3, 3]

    Output: 3

    Expected: 3

    Explain:

    ```plaintext
    total = 12（偶數，因為奇數×偶數個=偶數）

    所有 partition 都產生偶數差，答案 = 3
    ```

  ***

  - 案例 G：全為相同數字（奇數，奇數個）

    Input: nums = [3, 3, 3]

    Output: 0
    Expected: 0

    Explain:

    ```plaintext
    total = 9（奇數，因為奇數×奇數個=奇數）

    i=0: leftTotal=3, rightTotal=6, diff=-3 → 奇數 ✗
    i=1: leftTotal=6, rightTotal=3, diff=3  → 奇數 ✗

    答案 = 0
    ```

### Solution2（Math）

- **思路說明**：

  基於 Solution1，將 diff 的計算轉換成代數：

  ```plaintext
    diff = leftTotal - rightTotal
        = leftTotal - (total - leftTotal)
        = 2 * leftTotal - total
  ```

  因為 2 \* leftTotal 一定是偶數，

  所以只要 total 是偶數，diff 就一定是偶數；若 total 是奇數，diff 就一定是奇數。原因是：

  - 偶數 - 偶數 → 偶數

  - 偶數 - 奇數 → 奇數

  因此，只要 total 是偶數，nums 中的每一個合法 partition index 都能產生偶數差。

  既然 0 <= i < n - 1，合法的 partition 數量就是 n - 1。

- **複雜度分析**：

  - 時間複雜度：O(n) → 只有計算總和的遍歷 O(n)

  - 空間複雜度：O(1) → 沒有額外使用空間儲存，都是數字的加減累積，皆為 O(1)

  - 通過狀態：✅ AC

- **測試案例**： 同 Solution1 測試案例

## 學習記錄

- 首次解題（PrefixSum）：2025-12-05 | 耗時：不紀錄（重理解思路） | 獨立完成：是。無意識寫出 prefix sum，其概念待複習仍不熟
- 首次解題（Math）：2025-12-05 | 耗時：不紀錄（重理解思路） | 獨立完成：否
- 複習1：<!-- 日期 --> | 耗時：分鐘 | 獨立完成：□ 是 □ 否 | 順暢度：□ 流暢 □ 卡頓 □ 忘記
