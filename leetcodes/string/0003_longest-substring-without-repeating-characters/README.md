---
title: "3. Longest Substring Without Repeating Characters"
tags:
  - Hash Table
  - String
  - Sliding Window
difficulty: "Medium"
date_solved: "2025-10-25"
link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/description/"
---

## 問題描述

給予一個 string s 找出沒有重複字元的最長 substring，substring 定義為連續且不為空的字元組成

其中 s 包含英文字母、數字、空白

## Constraints

- 0 <= s.length <= 5 \* 10\*\*4
- s consists of English letters, digits, symbols and spaces.

## 解題思路

### 初步分析(觀察與發想)

- 暴力解，兩層迴圈找最長的重複字串，透過 set 紀錄有使用的 characters。複雜度：n \*\* 2，其中 n = 5 \* 10\*\*4，應該會 TLE

- 要在一個字串中找連續得字元，並計算出最長的長度，可以考慮使用 two pointers + hashset

## 解法總覽

### Solution1

- **思路說明**：

  初始化 l、r 指針，一個最大長度的變數，hashset 紀錄當前連續字串中有使用的字符，

  盡可能延展 r 指針，先判斷 r 指針所指向得字元是否存在 hashset 中

  1. 如果沒有 -> 更新最大長度，把 r 指針所指向得字元加入 hashset

  1. 如果有 -> 不斷更新 l 指針縮小範圍，縮小過程中將 l 指針所指向的字元從 hashset 中移除

  最後終止條件，當 r 指針超過字串中最後一個字元時，即可返回紀錄得最長長度

- **複雜度分析**：

  - 時間複雜度：O(n) -> 每個 characters 遍歷至多兩次，因此會是 O(n)

  - 空間複雜度：O(n) -> 最壞情況下，used 要存放不同的字元

  - 通過狀態：✅ AC

- **測試案例**：

  - 案例 A: 基礎測試

    Input: "abcabcbb"

    Output: 3

    Expected: 3

  ***

  - 案例 B: 全部字符都一樣

    Input: "ssss"

    Output: 1

    Expected: 1

  ***

  - 案例 C: 包含大小寫、數字、單個空白

    Input: "Abc123 567abC"

    Output: 11

    Expected: 11

  ***

  - 案例 D: 連續兩個空白，不能算作子字串

    Input: "Abc123 567abC"

    Output: 7

    Expected: 7

  ***

  - 案例 E: 空字串

    Input: ""

    Output: 0

    Expected: 0

### Solution2 (最佳解)

- **思路說明**：

  透過 hashmap 紀錄是否重複得同時，快速取出上一次出現該字元的位置，

  key 是字元，value 是該字元最後一次出現的位置，

  後續縮小範圍再移動 l 指針時，可以快速移動到正確的位置，

  前提是要注意，檢查取出的位置是否大於等於當前 l(即是否在當前視窗內)，否則會錯誤地縮小視窗，

  複雜度雖然同 solution1，但實際運行時應該會比 solution1 快

- **複雜度分析**：

  - 時間複雜度：O(n)

  - 空間複雜度：O(n)

  - 通過狀態：✅ AC

- **測試案例**： 同 solution1

## 學習記錄

首次開始：2025-10-25 07:05:29 PM

- 首次解題：2025-10-25 | 耗時：50分鐘 | 獨立完成：是
- 複習 1：\_\_\_\_ | 順暢度：□ 流暢 □ 卡頓 □ 忘記
