---
title: "1448. Count Good Nodes in Binary Tree"
tags:
  - Tree
  - Depth-First Search
  - Breadth-First Search
  - Binary Tree
difficulty: "Medium"
date_solved: "2025-11-17"
link: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/description/"
---

## 問題描述

給予一個 binary tree 的 root，計算並返回這棵 tree 中好節點的數量。

好節點的定義：從根節點到當前節點的路徑上，當前節點的值是最大的(或等於最大值)

## Constraints

- The number of nodes in the binary tree is in the range [1, 10^5].
- Each node's value is between [-10^4, 10^4].

## 解題思路

### 初步分析(觀察與發想)

- 需要紀錄當前路徑的最大值，因為只要當前拜訪的節點值大於等於前方路徑上的最大值，就會是好節點

## 解法總覽

### Solution1(DFS)

- **思路說明**：

  建立 helper 遞迴函式處理，接收當前節點和當前路徑上的最大值：

  - 若當前節點為 null，代表已拜訪完該分支，直接 return
  - 檢查當前節點的值是否大於等於「當前路徑上到當前節點前的最大值」，若是則為好節點，計數器++
  - 更新最大值：取「前方路徑上的最大值」和「當前節點值」的較大者
  - 遞迴拜訪左右子樹，繼續計算子樹下的好節點數量

  最後返回好節點的計數器。

- **複雜度分析**：

  - 時間複雜度：O(n) -> 每個節點會拜訪一次

  - 空間複雜度：O(h) -> 遞迴呼叫堆疊深度，h 為樹高，最差情況下為 O(n)（鏈狀樹），平衡樹則為 O(log n)

  - 通過狀態：✅ AC

- **測試案例**：

  - 案例 A（原題範例）:

    Input: root = [3,1,4,3,null,1,5]

    Output: 4

    Expected: 4

    Explain: 好節點為 3, 4, 3, 5（根節點3、右子節點4大於3、左下節點3等於前方最大3、最右節點5大於前方最大4）

  ***

  - 案例 B（遞增路徑 - 全部都是好節點）:

    Input: root = [1,2,3,4,5]

    Output: 5

    Expected: 5

    Explain: 每個節點都大於等於其路徑上的最大值，所有節點都是好節點

  ***

  - 案例 C（遞減路徑 - 僅根節點）:

    Input: root = [10,5,2,1,null,null,3]

    Output: 1

    Expected: 1

    Explain: 只有根節點10是好節點，其他節點都小於前方路徑的最大值

  ***

  - 案例 D（包含負數）:

    Input: root = [-1,5,-2,4,null,null,3]

    Output: 3

    Expected: 3

    Explain: 好節點為 -1（根）, 5（路徑max=-1，5>=-1）, 3（路徑[-1,-2,3]，max=-1，3>=-1）

  ***

  - 案例 E（單節點）:

    Input: root = [1]

    Output: 1

    Expected: 1

    Explain: 根節點必定是好節點

  ***

  - 案例 F（相同值節點）:

    Input: root = [3,3,3,3,3]

    Output: 5

    Expected: 5

    Explain: 所有值相同，每個節點都大於等於路徑最大值，全部都是好節點

  ***

  - 案例 G（極端值）:

    Input: root = [-10000,null,10000]

    Output: 2

    Expected: 2

    Explain: 測試邊界值，兩個節點都是好節點

### Solution2(BFS)

- **思路說明**：

  建立 queue，初始放入根節點和初始最大值（-Infinity）

  當 queue 不為空時，持續執行 BFS 流程：

  - 從 queue 中取出「當前節點」和「當前路徑上到當前節點前的最大值」
  - 檢查當前節點的值是否大於等於「當前路徑上到當前節點前的最大值」，若是則為好節點，計數器++
  - 更新最大值：取「前方路徑上的最大值」和「當前節點值」的較大者
  - 若左子節點存在，將「左子節點」和「更新後的最大值」一起放入 queue
  - 若右子節點存在，將「右子節點」和「更新後的最大值」一起放入 queue

  當 queue 為空時，代表所有節點都已拜訪完畢，返回好節點的計數器。

- **複雜度分析**：

  - 時間複雜度：O(n) -> 每個節點會拜訪一次

  - 空間複雜度：O(w) -> queue 最多需要儲存樹的最大寬度 w 個節點，完全二元樹的最底層約有 n/2 個節點，因此最差情況為 O(n)

  - 通過狀態：✅ AC

- **測試案例**：同 Solution1 測試案例

## 學習記錄

- 首次解題(DFS)：2025-11-18 | 耗時：不紀錄(重理解思路) | 獨立完成：是
- 首次解題(BFS)：2025-11-18 | 耗時：不紀錄(重理解思路) | 獨立完成：是
- 複習1：<!-- 日期 --> | 耗時：分鐘 | 獨立完成：□ 是 □ 否 | 順暢度：□ 流暢 □ 卡頓 □ 忘記
