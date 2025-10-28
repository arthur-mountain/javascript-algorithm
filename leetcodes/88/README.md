---
title: "88. Merge Sorted Array"
tags:
  - Array
  - Two Pointers
  - Sorting
difficulty: "Easy"
date_solved: "2025-10-28"
link: "https://leetcode.com/problems/merge-sorted-array/description/"
---

## 問題描述

給予兩個升序得數字陣列num1, num2 和兩個數字 m, n 分別表示要從nums1, nums2 的元素數量

合併 nums1, nums2 變成一個升序陣列，但不要回傳任何值，而是透過更新 nums1 in-place 成合併後的陣列

題目有說，其中 nums1.length 會等於 m + n, nums2.length 等於 n ，所以不會越界

## Constraints

- nums1.length == m + n
- nums2.length == n
- 0 <= m, n <= 200
- 1 <= m + n <= 200
- -10**9 <= nums1[i], nums2[j] <= 10**9

## 解題思路

### 初步分析(觀察與發想)

- 暴力解，使用新陣列合併後更新到 nums1

- 使用雙指針，一個指向 nums1，一個指向 nums2，從前往後遍歷，小的往前放，其中指向 nums1 的指針最長度為 m，反之指向 nums2 的指針最大長度為 n

  如果任一邊到達最大值，把另一邊剩餘的值直接補上

## 解法總覽

### Solution1

- **思路說明**：

  初始化temp陣列，雙指針按照順序把值比較小填入temp陣列中，

  再遍歷 temp 陣列更新到 nums1

- **複雜度分析**：

  - 時間複雜度：O(m + n)

  - 空間複雜度：O(m + n)

  - 通過狀態：✅ AC / ❌ TLE / ❌ MLE / ❌ WA

- **其他備註\(優化方向、特殊限制、問題延伸討論\)**：

  - 不要建立 temp 陣列?

- **測試案例**：

  - 案例 A: m長度 0

    Input: nums1 = [0], m = 0, nums2 = [1], n = 1

    Ouput: [1]

    Expected: [1]

  ***

  - 案例 B: n 長度 0

    Input: nums1 = [1], m = 1, nums2 = [], n = 0

    Ouput: [1]

    Expected: [1]

  ***

  - 案例 C: 左右各取 3 個元素更新nums1進行合併並維持升序

    Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3

    Ouput: [1,2,2,3,5,6]

    Expected: [1,2,2,3,5,6]

## 學習記錄

- 首次解題：2025-10-28 | 耗時：25分鐘 | 獨立完成：是

  - 備註：理解題目6分鐘、實作釐清4分鐘、實作15分鐘，原本在想 solution2，後來中間卡住先換成暴力解 solution1

- 複習 1：<!-- 日期 --> | 耗時：分鐘 | 獨立完成：□ 是 □ 否 | 順暢度：□ 流暢 □ 卡頓 □ 忘記
