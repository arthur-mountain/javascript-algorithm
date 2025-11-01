---
title: "66. Plus One"
tags:
  - Array
  - Math
difficulty: "Easy"
date_solved: "2025-10-28"
link: "https://leetcode.com/problems/plus-one/description/"
---

## 問題描述

有一個很大的數字表示成 ordered digits array from left to right，
第 i 個 digit 代表 i 個位數，該數字不會有零開頭，
請把這個很大的數字 + 1 後返回對應得 diigts array

## Constraints

- 1 <= digits.length <= 100
- 0 <= digits[i] <= 9
- digits does not contain any leading 0&#39;s.

## 解題思路

### 初步分析(觀察與發想)

- 從後往前遍歷，如果數字 + 1 等於 10 就要進位

## 解法總覽

### Solution1

- **思路說明**：

  初始化 carry 變數為零，用來紀錄進位的資訊，

  將當前最後一個 digit + 1，如果仍小於 10 可以直接回傳，不用因為進位處理前面的 digits，

  要進位的話，從後往前遍歷， 如果數字 + carry 超過 10，就要記錄 carry 變數，並更新當前 digit

  若數字 + 1 + carry 超過 10：

  1. 數字 + 1 + carry 除以 10 的商，是下一個 carry 變數
  1. 數字 + 1 + carry 除以 10 的餘數，是當前的 digit

  > 進位處理，可以用 Math.floor 同時處理大於 10 和小於 10 的情境

  最後回傳 digits 時，要判斷當前 carry 是否大於 0，如果 carry 大於 0 就要在 digits 前方補上 carry

- **複雜度分析**：

  - 時間複雜度：O(n)

  - 空間複雜度：O(1)

  - 通過狀態：✅ AC

- **測試案例**：

  - 案例 A: 只有一個 digit

    Input: digits = [1]

    Ouput: [2]

    Expected: [2]

  ***

  - 案例 B: 只有一個 digit 且值為 9，要進位

    Input: digits = [8, 9]

    Ouput: [9, 0]

    Expected: [9, 0]

  ***

  - 案例 C: 多個 digit ，有連續的值為 9，要連續進位

    Input: digits = [1, 8, 9, 9, 9]

    Ouput: [1, 9, 0, 0, 0]

    Expected: [1, 9, 0, 0, 0]

  ***

  - 案例 D: 遍歷到最前面結束，carry 還有值，要在前面補上 carry

    Input: digits = [9, 9, 9]

    Ouput: [1, 0, 0, 0]

    Expected: [1, 0, 0, 0]

### Solution2(最佳解)

- **思路說明**：

  從尾巴開始遍歷，再遍歷每個 digit 當下，就知道要不要進到下一輪迴圈繼續進位了

  如果當前遍歷到的 digit 是 9，就把當前的 digit 更新為 0
  (高位的 digits 需要進位，就把當前 digit 更新為 0，繼續進到下一輪迴圈)

  如果當前遍歷到的 digit 不是 9，就把數字 + 1，然後直接 return digits
  (高位的 digits 已經不需要再進位，直接在這輪 + 1 後 return 了)

  如果遍歷到最後，沒有被 early return，就要 digits.unshift(1)
  (最高位的數字被更新為 0 退出迴圈，因此仍需要再進位)

- **複雜度分析**：

  - 時間複雜度：O(n)

  - 空間複雜度：O(1)

  - 通過狀態：✅ AC

- **測試案例**： 同 solution1

## 學習記錄

- 首次解題：2025-10-28 | 耗時： 27分鐘 | 獨立完成：是
- 複習 1：2025-11-01 | 耗時：12分鐘(3分鐘釐清題目、3分鐘釐清實作，6分鐘實作) | 獨立完成：是 | 順暢度：卡頓。沒有寫出最佳解而是寫出 solution1 並且程式碼也沒很乾淨，有些冗餘的邏輯
