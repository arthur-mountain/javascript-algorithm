---
title: "695. Max Area of Island"
tags:
  - Array
  - Depth-First Search
  - Breadth-First Search
  - Union Find
  - Matrix
difficulty: "Medium"
date_solved: "2025-11-16"
link: "https://leetcode.com/problems/max-area-of-island/description/"
---

## 問題描述

給定一個二維 binary 陣列 grid，

Island(島嶼)的定義：由 '1'(land/陸地) 組成，且四周(horizontal or vertical) 被 '0'(water/水域) 包圍，

回傳擁有最多陸地數量的島嶼面積

## Constraints

- m == grid.length
- n == grid[i].length
- 1 <= m, n <= 50
- grid[i][j] is either 0 or 1.

## 解題思路

### 初步分析(觀察與發想)

- 這題屬於靜態分析問題，不涉及增量或動態更新，可以直接透過 DFS/BFS 處理。當然也能用 UnionFind 處理，但 UnionFind 更擅長處理動態場景

  - 詳情參考 [200. numbers of island](../0200_number-of-islands/README.md)

- 在遍歷過程中需要記錄當前陸地的最大數量。在計算每個島嶼時，同步記錄該島嶼的陸地數量，當該島嶼處理完畢後，與當前最大值比較並更新

## 解法總覽

### Solution1(DFS)

- **思路說明**：

  遍歷整個 grid，當遇到陸地時進入 DFS 處理。在 DFS 中，先將陸地數量加一，再將當前陸地標記為水域('0')，避免重複計算。

  接著對當前陸地的四個方向(上右下左)進行 DFS 遍歷，直到超出邊界或遇到水域時停止。

  每處理完一個島嶼，就更新最大陸地數量。已處理過的陸地因為被標記為水域，在後續遍歷中會被跳過，不會重複計算。

  持續遍歷直到處理完所有 cell，最後回傳記錄到的最大陸地數量

- **複雜度分析**：

  - 時間複雜度：O(m × n) -> 每個 cell 最多被訪問常數次(外層 grid 遍歷一次 + DFS 內部可能再訪問一次)

  - 空間複雜度：O(m × n) -> DFS Call stack 深度，最壞情況發生在陸地呈蛇形排列時

  - 通過狀態：✅ AC

- **測試案例**：

  - 案例 A: 全是水域

    Input: grid = \[\[0,0,0,0,0,0,0,0\]\]

    Output: 0

    Expected: 0

  ***

  - 案例 B: 全是陸地

    Input: grid = \[\[1,1,1,1,1,1,1,1,1\]\]

    Output: 9

    Expected: 9

  ***

  - 案例 C: 多塊島嶼

    Input: grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]

    Output: 6

    Expected: 6

### Solution2(BFS)

### Solution3(UnionFind)

## 學習記錄

- 首次解題(DFS)：2025-11-16 | 耗時：不紀錄(重理解思路) | 獨立完成：是
- 複習1：<!-- 日期 --> | 耗時：分鐘 | 獨立完成：□ 是 □ 否 | 順暢度：□ 流暢 □ 卡頓 □ 忘記
