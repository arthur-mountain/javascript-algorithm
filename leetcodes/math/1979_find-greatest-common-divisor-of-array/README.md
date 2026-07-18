---
title: "1979. Find Greatest Common Divisor of Array"
tags:
  - Array
  - Math
  - Number Theory
difficulty: "Easy"
date_solved: "2026-07-18"
link: "https://leetcode.com/problems/find-greatest-common-divisor-of-array/description/"
---

## 問題描述

從輸入陣列中，找到最大、最小值中間的最大的公因數

## Constraints

- 2 <= nums.length <= 1000
- 1 <= nums[i] <= 1000

## 解題思路

### 初步分析(觀察與發想)

- 需要先知道範圍，需要一次遍歷找到陣列中的最大、最小值

- 有了最大、最小值後，從最大值遞減遍歷，找到最大公因數可以整除最大、最小值

## 解法總覽

### Solution1：

- **核心策略**：

  先找到最大、最小值，從最大值遞減遍歷找到最大公因數

- **思路說明**：

  1. 先遍歷輸入 nums，找到最大、最小值

  2. 因為要找最大公因數，因此從最大值遞減，找到一個數字能同時整除最大值、最小值中間的最大的公因數

  補充：fallback 的最大公因數是 1，因為 1 可以整除任何數字

- **複雜度分析**：

  - 時間複雜度：O(n)

  - 空間複雜度：O(1)

  - 通過狀態：✅ AC

- **其他備註\(優化方向、特殊限制、問題延伸討論\)**：

  - 找到最大公因數那段，應該有數學公式，而非透過遍歷遞減找公因數

- **測試案例**：

  - 案例 A：最小長度陣列 — 極小輸入下界

    Input: nums = [2, 4]

    Ouput: 2

    Expected: 2

    Explain: nums.length 下界為 2，驗證兩元素時 min/max 初始化（min = max = nums[0]）後，只需再比較一次 nums[1] 即可正確運作

  ***

  - 案例 B：min = 1 — 值域下界觸發最壞時間複雜度

    Input: nums = [1, 1000]

    Ouput: 1

    Expected: 1

    Explain: gcd(1, x) 恆為 1，遞減迴圈必須從 1000 一路檢查到 i = 1 才會 return，驗證此寫法在 min = 1 時退化為 O(max) 的最壞情況

  ***

  - 案例 C：互質無字面 1 — fallback 真實觸發路徑

    Input: nums = [8, 3, 5]

    Ouput: 1

    Expected: 1

    Explain: min = 3, max = 8

## 學習記錄

首次開始：2026-07-18 01:38:13 PM

- 首次解題：2026-07-18 | 耗時：不紀錄(重理解思路) | 獨立完成：是
- 複習1：<!-- 日期 --> | 耗時：分鐘 | 獨立完成：□ 是 □ 否 | 順暢度：□ 流暢 □ 卡頓 □ 忘記
