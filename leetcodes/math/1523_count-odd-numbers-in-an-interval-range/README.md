---
title: "1523. Count Odd Numbers in an Interval Range"
tags:
  - Math
difficulty: "Easy"
date_solved: "2025-12-07"
link: "https://leetcode.com/problems/count-odd-numbers-in-an-interval-range/description/"
---

## 問題描述

給予兩個正數數字 low and high，回傳 low ~ high 之間的奇數數量(包含 low and high)

區間表示法: \[low, hight\] ，包含 low and high

## Constraints

- 0 <= low <= high&nbsp;<= 10\*\*9

## 解題思路

### 初步分析(觀察與發想)

- 計數、奇偶特性，可能會有數學解。公式目前沒頭緒，先寫暴力解

- 暴力解直接迴圈從 low ~ high，用 bitwise 判斷奇偶，進行計數

## 解法總覽

### Solution1(暴力解)

- **思路說明**：

  建立 count 紀錄奇數數量，迴圈遍歷(\[low, high\])，透過 bitwise 判斷奇偶數，

  當 (i & 0) \=\=\= 0 時是偶數，(i & 1) \=\=\= 1 時是奇數，

  因為我們要計數奇數的數量，所以可以直接 count += (i & 0)，

  最後回傳 count

- **複雜度分析**：

  - 時間複雜度：O(n)

  - 空間複雜度：O(1)

  - 通過狀態：✅ AC

- **其他備註\(優化方向、特殊限制、問題延伸討論\)**：

  - 數學解，降低時間複雜度至 O(1)

- **測試案例**：

  - 案例 A: low、high 都是奇數

    Input: low=1, high=5

    Ouput: 3

    Expected: 3

    Explain: 1, 3, 5 是奇數

  ***

  - 案例 B: low、high 都是偶數

    Input: low=2, high=6

    Ouput: 2

    Expected: 2

    Explain: 3, 5 是奇數

  ***

  - 案例 C: low 是奇數，high 是偶數

    Input: low=1, high=6

    Ouput: 3

    Expected: 3

    Explain: 1, 3, 5 是奇數

  ***

  - 案例 D: low 是偶數，high 是奇數

    Input: low=2, high=5

    Ouput: 2

    Expected: 2

    Explain: 3, 5 是奇數

  ***

  - 案例 E: low 等於0, high不等於0

    Input: low=0, high=3

    Ouput: 2

    Expected: 2

    Explain: 1, 3 是奇數

  ***

  - 案例 F: low, high 都等於0

    Input: low=0, high=0

    Ouput: 0

    Expected: 0

    Explain: 沒有奇數

## 學習記錄

- 首次解題(暴力解，迴圈+bitwise)：2025-12-07 | 耗時：不紀錄(重理解思路) | 獨立完成：是
- 複習1：<!-- 日期 --> | 耗時：分鐘 | 獨立完成：□ 是 □ 否 | 順暢度：□ 流暢 □ 卡頓 □ 忘記
