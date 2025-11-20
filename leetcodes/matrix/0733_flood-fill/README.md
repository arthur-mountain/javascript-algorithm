---
title: "733. Flood Fill"
tags:
  - Array
  - Depth-First Search
  - Breadth-First Search
  - Matrix
difficulty: "Easy"
date_solved: "2025-11-20"
link: "https://leetcode.com/problems/flood-fill/description/"
---

## 問題描述

給定一個 m x n 的 grid 代表 image pixels，同時給定三個參數 sr, sc, color。

直接更改 image 原始輸入 grid，以 sr, sc 作為 grid 起點，將其周圍值與起始 pixel 相同的所有相連 pixel，替換成 color。

最後返回更改過後的 image。

## Constraints

- m == image.length
- n == image[i].length
- 1 <= m, n <= 50
- 0 <= image[i][j], color < 2\*\*16
- 0 <= sr < m
- 0 <= sc < n

## 解題思路

### 初步分析(觀察與發想)

- 從 sr, sc 開始，紀錄初始值，透過 BFS/DFS 進行遍歷，將所有與初始值相同的相連 pixel 更改為 color。

  為了避免重複訪問同一個 pixel 造成無限迴圈，需要一個資料結構來記錄已訪問過的 pixel。

## 解法總覽

### Solution1(BFS)

- **思路說明**：

  **初始化**：

  - 紀錄 image\[sr\]\[sc\] 的初始值，作為後續比較的基準

  - 將 sr, sc 放入 queue 作為 BFS 起點

  - 建立一個 Set 用於紀錄訪問過的 pixel indices，key 格式：`${rowIndex}-${colIndex}`

  **進入 BFS 流程**：

  - 從 queue 取出這次要處理的 pixel indices (cr, cl)

  - 檢查 indices 是否符合以下任一條件，若符合則跳過此 pixel：

    - 已經訪問過（在 Set 中）

    - 越界（超出 grid 範圍）

    - 當前 pixel 的值不等於初始值

  - 將當前 indices 組成的 key 加入 Set 標記為已訪問

  - 將當前 pixel 的值更新為 color

  - 將當前 pixel 四個方向的鄰居座標（上、右、下、左）依序加入 queue，當前 pixel 處理完畢

  - 重複上述步驟直到 queue 為空

  最後返回更改過後的 image

- **複雜度分析**：

  - 時間複雜度：O(m × n) -> 最壞情況下每個 pixel 都需要訪問一次

  - 空間複雜度：O(m × n) -> queue 與 Set 所需的空間，最壞情況下 Set 會存滿所有 m × n 個 pixel 的 keys

  - 通過狀態：✅ AC

- **測試案例**：

  - 案例 A: 當起始 pixel 已經等於 color

    Input: image = \[\[0,0,0],[0,0,0\]\], sr = 0, sc = 0, color = 0

    Output: \[\[0,0,0\],\[0,0,0\]\]

    Expected: \[\[0,0,0\],\[0,0,0\]\]

    Explain: 當起始 pixel 的值已經等於 color 時，則無需有任何變動

  ***

  - 案例 B: 基本 flood fill（LeetCode 範例）

    Input: image = \[\[1,1,1\],\[1,1,0\],\[1,0,1\]\], sr = 1, sc = 1, color = 2

    Output: \[\[2,2,2],[2,2,0],[2,0,1\]\]

    Expected: \[\[2,2,2],[2,2,0],[2,0,1\]\]

    Explain: 從 (1,1) 開始，所有相連的值為 1 的 pixel 都被填充為 2

  ***

  - 案例 C: 單一 pixel 的 image

    Input: image = \[\[0\]\], sr = 0, sc = 0, color = 2

    Output: \[\[2\]\]

    Expected: \[\[2\]\]

    Explain: 只有一個 pixel 時，直接將其更新為目標顏色

  ***

  - 案例 D: 整個 image 都是同一顏色

    Input: image = \[\[0,0,0],[0,0,0],[0,0,0\]\], sr = 1, sc = 1, color = 2

    Output: \[\[2,2,2],[2,2,2],[2,2,2\]\]

    Expected: \[\[2,2,2],[2,2,2],[2,2,2\]\]

    Explain: 所有 pixel 都相連且值相同，全部被填充

  ***

  - 案例 E: 孤立的 pixel（無相鄰相同顏色）

    Input: image = \[\[1,0,1],[0,1,0],[1,0,1\]\], sr = 1, sc = 1, color = 3

    Output: \[\[1,0,1],[0,3,0],[1,0,1\]\]

    Expected: \[\[1,0,1],[0,3,0],[1,0,1\]\]

    Explain: 起始 pixel 四周都是不同顏色，只更新自己

  ***

  - 案例 F: 複雜邊界形狀

    Input: image = \[\[0,0,0],[0,1,1\]\], sr = 1, sc = 1, color = 1

    Output: \[\[0,0,0],[0,1,1\]\]

    Expected: \[\[0,0,0],[0,1,1\]\]

    Explain: 起始 pixel 已經是目標顏色，測試不同 row 長度的情況

  ***

  - 案例 G: 不規則連通區域

    Input: image = \[\[1,1,1\],\[1,1,0\],[1,0,1\]\], sr = 0, sc = 0, color = 2

    Output: \[\[2,2,2],[2,2,0],[2,0,1\]\]

    Expected: \[\[2,2,2],[2,2,0],[2,0,1\]\]

    Explain: 測試 L 形狀的連通區域，確保正確處理四個方向的鄰居

  ***

  - 案例 H: 邊角起始點

    Input: image = \[\[1,1,1],[1,1,0],[1,0,1\]\], sr = 0, sc = 0, color = 2

    Output: \[\[2,2,2],[2,2,0],[2,0,1\]\]

    Expected: \[\[2,2,2],[2,2,0],[2,0,1\]\]

    Explain: 從左上角開始，測試邊界處理邏輯

## 學習記錄

- 首次解題(BFS)：2025-11-20 | 耗時：不紀錄(重理解思路) | 獨立完成：是
- 複習1：<!-- 日期 --> | 耗時：分鐘 | 獨立完成：□ 是 □ 否 | 順暢度：□ 流暢 □ 卡頓 □ 忘記
