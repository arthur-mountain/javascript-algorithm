---
title: "101. Symmetric Tree"
tags:
  - Tree
  - Depth-First Search
  - Breadth-First Search
  - Binary Tree
difficulty: "Easy"
date_solved: "2025-11-01"
link: "https://leetcode.com/problems/symmetric-tree/description/"
---

## 問題描述

給予一個 binary tree root，檢查它自己是否為鏡像

## Constraints

- The number of nodes in the tree is in the range [1, 1000].
- -100 <= Node.val <= 100

## 解題思路

### 初步分析(觀察與發想)

- 使用 DFS 遍歷，檢查左右子樹對應得節點是否為鏡像，一但發現不是就 return false，否則繼續往下找，直到 eade case

## 解法總覽

### Solution1

- **思路說明**：

  使用 DFS 建立一個 helper function(e.g. hasSamePath)，兩個參數：互相為鏡像的節點，

  - 其中一個節點為空，非鏡像樹
  - 節點值不一樣，非鏡像樹
  - 繼續往下比較

  直到兩個節點為 null 代表走到葉子節點，返回 true。

  題目確保一定會有一個節點，因此不用擔心 root 等於 null 的情況

- **複雜度分析**：

  - 時間複雜度：O(n)

  - 空間複雜度：O(h) -> 在完全平衡的樹中是 O(log n)，但在最壞情況（完全不平衡的樹）可能達到 O(n)。

  - 通過狀態：✅ AC

- **其他備註\(優化方向、特殊限制、問題延伸討論\)**：

  - 可否改用 iterative 實作? 參考 solution1-iter.js

- **測試案例**：

  - 案例 A: 鏡像樹

    Input: root = [1,2,2,3,4,4,3]

    Ouput: true

    Expected: true

  ***

  - 案例 B: 非鏡像樹

    Input: root = [1,2,2,null,3,null,3]

    Ouput: false

    Expected: false

  ***

  - 案例 C: 只有一個節點

    Input: root = [1]

    Ouput: true

    Expected: true

## 學習記錄

- 首次解題：2025-11-01 | 耗時：13分鐘 | 獨立完成：是
- 複習1：<!-- 日期 --> | 耗時：分鐘 | 獨立完成：□ 是 □ 否 | 順暢度：□ 流暢 □ 卡頓 □ 忘記
