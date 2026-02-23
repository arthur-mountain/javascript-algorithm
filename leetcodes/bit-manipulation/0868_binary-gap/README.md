---
title: "868. Binary Gap"
tags:
  - Bit Manipulation
difficulty: "Easy"
date_solved: "2026-02-22"
link: "https://leetcode.com/problems/binary-gap/description/"
---

## 問題描述

給予一個正整數 n，回傳最長的距離兩兩相鄰的 1，如果沒有任何兩兩相鄰的 1 則回傳 0。

範例："1001"，最長距離為 3。

## Constraints

- 1 <= n <= 10\*\*9

## 解題思路

### 初步分析(觀察與發想)

- 將數字轉為 binary string，使用 sliding window 找出最長的相鄰 1 之間的距離。

## 解法總覽

### Solution 1：Sliding Window on Binary String

- **思路說明**：

  將數字轉為 binary string 並遍歷。初始化 `l`、`r` 兩個指針，其中 `l` 記錄上一個 `1` 的位置(初始為 `-1` 表示尚未見過任何 `1`)，`r` 作為 window 的右端向前擴展。

  當 `r` 指向 `1` 時，若 `l !== -1`(代表之前已出現過至少一個 `1`)，則計算 `r - l` 並更新最長距離；接著將 `l` 移至 `r` 的位置(記錄最後一個 `1` 的位置)，`r` 繼續向右擴展。

  終止條件：`r` 超出 binary string 的範圍。

- **複雜度分析**：

  - 時間複雜度：O(n)，n 為 binary string 的長度(即 log₂N)

  - 空間複雜度：O(n)，用於儲存 binary string

  - 通過狀態：✅ AC

- **測試案例**：

  - 案例 A：如果 binary 全為 1

    Input: `n = 15`(binary: `1111`)

    Output: `1`

    Expected: `1`

    Explain: 每個相鄰 1 的距離皆為 1，最長距離為 1。

  ***

  - 案例 B：如果 binary 的 1 只在頭尾

    Input: `n = 9`(binary: `1001`)

    Output: `3`

    Expected: `3`

    Explain: 唯一一對相鄰 1 的距離為 `3 - 0 = 3`。

  ***

  - 案例 C：如果 binary 的 0 只在尾部

    Input: `n = 14`(binary: `1110`)

    Output: `1`

    Expected: `1`

    Explain: 所有 1 皆連續，相鄰距離均為 1，最長距離為 1。

  ***

  - 案例 D：如果 binary 的 1/0 交錯排列

    Input: `n = 21`(binary: `10101`)

    Output: `2`

    Expected: `2`

    Explain: 每對相鄰 1 的距離皆為 2，最長距離為 2。

  ***

  - 案例 E：如果 binary 中只有一個 1

    Input: `n = 4`(binary: `100`)

    Output: `0`

    Expected: `0`

    Explain: 只有一個 1，`l` 始終為 `-1`，無法構成兩兩相鄰的 1，因此沒辦法計算最長距離，結果為 0。

### Solution 2：Bit Manipulation

- **核心策略**：

  核心 sliding window 邏輯與 Solution 1 完全一致

  差異只在資料讀取方式， Solution 1 讀取的是字串索引，

  此解法，讀取的是右移後的整數狀態，因此省去了字串轉換所需的額外空間。

- **思路說明**：

  不將整數轉為 binary string，改用右移(`>>`)直接逐位檢查。每次將 `n` 右移一位，等同於從最低有效位(LSB)開始依序讀取每一個 bit。

  用 `position` 追蹤當前 bit 的索引，`l` 同樣記錄上一個 `1` 的位置。當 `n & 1` 為真(最低位為 `1`)且 `l !== -1` 時，計算最長距離並更新 `l`。右移一位後 `position` 遞增，直到 `n` 為 `0` 為止。

- **複雜度分析**：

  - 時間複雜度：O(log n)，即 n 的二進制位數

  - 空間複雜度：O(1)，無額外空間，直接對整數做位元運算

  - 通過狀態：✅ AC

- **測試案例**：

  (與 Solution 1 共用，測試案例 A–E 皆適用)

## 學習記錄

首次開始：2026-02-22 02:40:53 PM

- 首次解題(solution1)：2026-02-22 | 耗時：不紀錄(重理解思路) | 獨立完成：一半

  - 有參考解答，原本是透過 sliding window，但 l 指針的更新邏輯，一直想成標準的 sliding window 更新邏輯，導致卡住

- 首次解題(solution2)：2026-02-22 | 耗時：不紀錄(重理解思路) | 獨立完成：否

  - 完全請教 AI

- 複習1(solution2)：2026-02-23 | 耗時：5分鐘 | 獨立完成：是 | 順暢度：卡頓

  - 沒有到非常卡頓，但每一步都有自己仔細思考出來
