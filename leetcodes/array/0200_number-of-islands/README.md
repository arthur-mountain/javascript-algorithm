---
title: "200. Number of Islands"
tags:
  - Array
  - Depth-First Search
  - Breadth-First Search
  - Union Find
  - Matrix
difficulty: "Medium"
date_solved: "2025-11-05"
link: "https://leetcode.com/problems/number-of-islands/description/"
---

## 問題描述

給定一個二維 binary 陣列 m x n grid，1 代表 land；0 代表 water，返回 islands 的總數。

island 的定義為：相鄰的水平 land 和垂直 land 被 water 包圍稱作一個 island

## Constraints

- m == grid.length
- n == grid[i].length
- 1 <= m, n <= 300
- grid[i][j] is '0' or '1'.

## 解題思路

### 初步分析(觀察與發想)

- 從一個 cell 開始遍歷時，盡可能延展自己四個方向的位置，如果是 1 則標記為 0 算作在同一座 island，直到四個方向都遇到 0 無法延展為止，此時 islands 數量 + 1。再接續進行下一個 cell 的遍歷，以此類推。

  - 要從一個 cell 往四個方向遍歷，可以透過四個迴圈或者直接使用 DFS recursion

## 解法總覽

### Solution1(DFS)

- **思路說明**：

  建立 helper function，往四個方向延展，並把遇到的 land 都標記成 water，因為當作同一座 island。邊界要注意、遇到 0 要停止。

  遍歷 grid 的每一個 cell，若當前 cell 為 land 時呼叫 helper function，延展當前 cell 的四個方向（若有遇到相鄰的 land，都算作同一座 island，所以標記為 0，後續再繼續遍歷 cell 時遇到 water 就不會重複計算 island），結束後將當前的 islands 總數加一。

  繼續遍歷下一個 cell 直到 grid 遍歷完畢，即可回傳 islands 總數

- **複雜度分析**：

  - 時間複雜度：O(m x n) -> 雖然有使用遞迴，但每一個 cell 最多只被訪問一次

  - 空間複雜度：O(m x n) -> 遞迴深度，如果整個 grid 都是 1 就會遞迴整個 grid

  - 通過狀態：✅ AC

- **其他備註(優化方向、特殊限制、問題延伸討論)**：

  - 改用 BFS 解？

- **測試案例**：

  - 案例 A: 1 個 island

    Input: grid = [
    ["1","1","1","1","0"],
    ["1","1","0","1","0"],
    ["1","1","0","0","0"],
    ["0","0","0","0","0"]
    ]

    Output: 1

    Expected: 1

  ***

  - 案例 B: 多個 islands

    Input: grid = [
    ["1","1","0","1","0"],
    ["1","1","0","1","0"],
    ["1","1","0","0","0"],
    ["0","0","0","1","0"]
    ]

    Output: 3

    Expected: 3

  ***

  - 案例 C: 整個 grid 都是 0

    Input: grid = [
    ["0","0","0","0","0"],
    ["0","0","0","0","0"],
    ["0","0","0","0","0"],
    ["0","0","0","0","0"]
    ]

    Output: 0

    Expected: 0

  ***

  - 案例 D: 整個 grid 都是 1

    Input: grid = [
    ["1","1","1","1","1"],
    ["1","1","1","1","1"],
    ["1","1","1","1","1"],
    ["1","1","1","1","1"]
    ]

    Output: 1

    Expected: 1

### Solution2(BFS)

- **思路說明**：

  遍歷 grid 的每一個 cell，當遍歷到 land 時，進入 BFS 流程。將當前 land 立即標記為 '0' 並放進 queue。

  當 queue 有值時，dequeue 取出 cell，檢查其四個方向的相鄰位置。

  若相鄰 cell 為 land，則先標記為 '0' 再放進 queue(先標記可避免同一個 cell 被重複加入 queue)。

  重複上述流程直到 queue 為空，代表此次 BFS 流程結束，當前 island 遍歷完畢，islands 總數加一。

  繼續遍歷下一個 cell，直到整個 grid 遍歷結束後回傳 islands 總數。

- **複雜度分析**：

  - 時間複雜度：O(m x n) -> 每一個 cell 最多只被訪問一次

  - 空間複雜度：O(min(m, n)) -> BFS 是層層往外擴散，queue 中最多會同時存在一整層的 cell。在最壞情況下(整個 grid 都是 1)，當 BFS 擴散到對角線附近時 queue 會達到最大長度，約為 min(m, n)

  - 通過狀態：✅ AC

- **測試案例**： 同 solution1 測試案例

## 學習記錄

- 首次解題：2025-11-05 | 耗時：29分鐘 | 獨立完成：是
- 複習1：2025-11-06 | 耗時：7分鐘(2分鐘釐清題目、2分鐘思考實作DFS解、3分鐘實作) | 獨立完成：是 | 順暢度：流暢
- 複習2：2025-11-09 | 耗時：6分鐘(邊講後實作DFS) | 獨立完成：是 | 順暢度：流暢
