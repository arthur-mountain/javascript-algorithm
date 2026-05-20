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

- 要在一個字串中找連續的字元，並計算出最長的長度，可以考慮使用 two pointers + hashset

## 解法總覽

### Solution1

- **思路說明**：

  核心邏輯是專注維持 \[l, r\] 這個閉區間。

  1. 擴展右邊界：透過迴圈移動 r，嘗試將新元素納入窗口。

  2. 收縮左界滿足約束：當進到 s\[r\] 時，若窗口內（Set 中）已經有重複元素(此時窗口不符合約束)，就一直刪到沒有為止，直到滿足「無重複」的約束。

  3. 確保區間合法：將 s\[r\] 加入 Set，確保當前窗口符合「無重複」定義且包含 l 與 r 本身(滿足「閉區間」不變量)。

  4. 更新答案：既然現在窗口是乾淨合法的，直接以 r - l + 1 更新全域最優長度。

- **複雜度分析**：

  - 時間複雜度：O(n) -> 每個 characters 遍歷至多兩次(進出窗口兩次)，因此會是 O(n)

  - 空間複雜度：O(n) -> 最壞情況下，Set 整個字串的字元

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

  同樣是維持 \[l, r\] 區間，但利用 Map 紀錄字元最後出現的 index 位置，將 while 收縮優化為查表 Jump。

  1. 快速收縮：當發現 s\[r\] 重複時，直接查表讓 l 跳轉到該字元最後一次出現位置的下一格(下一格是要確保滿足「閉區間」不變量)。

  1. 維持區間定義：跳轉時必須確保 l 只能往右跳，不能跳回舊的 index(確保不跳到窗口外的索引，所以取最大值)。

  1. 確保區間合法：在 Map 中更新 s\[r\] 最新出現的位置。

  1. 更新答案：此時區間同樣保證符合「無重複」約束，直接以 r - l + 1 更新結果。

  複雜度雖然同 solution1，但實際運行時應該會比 solution1 快

- **複雜度分析**：

  - 時間複雜度：O(n)，比 Solution 1 少了內部迴圈刪除的動作。

  - 空間複雜度：O(n)，Map 存放字元及其對應的 index。

  - 通過狀態：✅ AC

- **測試案例**： 同 solution1

## 學習記錄

- 首次解題：2025-10-25 | 耗時：50分鐘 | 獨立完成：是

- 複習 1：2026-04-30 | 耗時：10分鐘 | 獨立完成：否 | 順暢度：卡頓

  - 筆記：不再糾結索引增減，轉而專注於「維持區間合法性」。

  - **核心總結：專注維持 \[l, r\] 閉區間，先跳轉或縮減左界滿足「無重複」約束，確保窗口合法後再結算答案。**
