---
title: "1. Two Sum"
tags:
  - Array
  - Hash Table
difficulty: "Easy"
date_solved: "2025-10-25"
link: "https://leetcode.com/problems/two-sum/description/"
---

## 問題描述

給予數字(integer)陣列 nums，找到兩個數字相加等於 target，回傳任何順序皆可得兩數 indices

題目保證只會有一個答案，且同一個數字只能使用一次

## Constraints

- 2 <= nums.length <= 10\*\*4
- -10\*\*9 <= nums[i] <= 10\*\*9
- -10\*\*9 <= target <= 10\*\*9
- <strong>Only one valid answer exists.</strong>

## 解題思路

### 初步分析(觀察與發想)

- 暴力解，兩次迴圈將數字相加後，如果找到 target 就 early return

- 使用 hashmap 紀錄當前數字和當前數字的 index，

  這樣後續遍歷在計算差值時，若存在於 hashmap 中，則代表找到兩個相加的數字等於 target 的 indices 了。

## 解法總覽

### Solution1

- **思路說明**：暴力解，使用兩層迴圈，找兩個數字相加是否等於 target

- **複雜度分析**：

  - 時間複雜度：O(n \*\* 2)

  - 空間複雜度：O(1)

  - 通過狀態：✅ AC

- **其他備註\(優化方向、特殊限制、問題延伸討論\)**：

  - 使用 hashmap 的方式，只需要一層迴圈即可，空間換時間。

- **測試案例**：

  - 案例 A:

    Input: nums = [3,2,4]; target = 6

    Output: [1, 2]

    Expected: [1, 2]

  - 案例 B: 只有兩個數字

    Input: nums = [2,7]; target = 9

    Output: [0, 1]

    Expected: [0, 1]

  ***

### Solution2 (最佳解)

- **思路說明**：

  使用 hashmap 紀錄當前數字和當前數字的 index(其中當前數字作為 key，當前數字的 index 作為 value)，

  後續遍歷數字計算差值時，該差值若存在於 hashmap 中就代表找到兩數相加等於 target，

  即當前數字和 hashmap 中的數字，即可回傳兩個數字的 indices

  > 相較於 Solution1，透過空間換時間，把遍歷過得數字和其 index 存到 hashmap 中，後續遍歷數字時想找差值時可以直接 hashmap lookup

- **複雜度分析**：

  - 時間複雜度：O(n)

  - 空間複雜度：O(n) - 最壞情況下要紀錄全部數字

  - 通過狀態：✅ AC

- **測試案例**： 同 Solution1

## 學習記錄

- 複習1：2025-10-25 | 耗時：10分鐘 | 獨立完成：是 | 順暢度：流暢
- 複習2：2025-10-26 | 耗時：3分鐘 | 獨立完成：是 | 順暢度：流暢
- 複習3：2025-11-01 | 耗時：5分鐘 | 獨立完成：是 | 順暢度：流暢
- 複習4：2025-11-08 | 耗時：4分鐘 | 獨立完成：是 | 順暢度：流暢
