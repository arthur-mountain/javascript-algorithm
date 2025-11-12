---
title: "133. Clone Graph"
tags:
  - Hash Table
  - Depth-First Search
  - Breadth-First Search
  - Graph
difficulty: "Medium"
date_solved: "2025-11-09"
link: "https://leetcode.com/problems/clone-graph/description/"
---

## 問題描述

給定一個無向圖(undirected graph)的某個節點，要求回傳該圖的深複製(deep copy)版本。

圖中的每個節點包含：

- 一個整數值 `val`

- 一個 list，包含所有與當前節點相連的鄰居節點

## Constraints

- The number of nodes in the graph is in the range [0, 100].
- 1 <= Node.val <= 100
- Node.val is unique for each node.
- There are no repeated edges and no self-loops in the graph.
- The Graph is connected and all nodes can be visited starting from the given node.

## 解題思路

### 初步分析(觀察與發想)

在複製圖的過程中，需要避免重複複製同一個節點。

使用 hashmap 紀錄「原節點 → 複製節點」的映射關係。在遍歷每個節點時：

- 如果該節點已經複製過(存在於 hashmap 中)，則直接使用已複製的節點，避免重複處理

- 如果該節點尚未複製，則建立新節點並存入 hashmap，接著繼續處理其鄰居節點

這樣的設計可以確保每個節點只被複製一次，同時正確建立節點之間的連接關係。

## 解法總覽

### Solution1(DFS)

- **思路說明**：

  建立一個 hashmap，用於紀錄原節點與複製節點的映射關係。

  建立一個 clone function 進行遞迴複製，函式參數為當前的原節點。

  遞迴邏輯如下：

  - 若 hashmap 中已存在該原節點，預設該節點及其鄰居已經處理過，直接返回對應的複製節點
  - 否則，建立新的複製節點，將「原節點 → 複製節點」的映射存入 hashmap
  - 遍歷原節點的所有鄰居節點，遞迴呼叫 clone function 複製每個鄰居，並將複製後的鄰居節點加入到複製節點的 neighbors 中

  最後返回根節點對應的複製節點（即 hashmap.get(node)）。

- **複雜度分析**：

  - 時間複雜度：O(V + E)。其中 V 為圖中的節點數量，E 為邊的數量。

    - 圖中的每個節點需要訪問一次進行複製，這部分的成本是 O(V)。

    - 在訪問每個節點的過程中，需要遍歷該節點的所有鄰居來建立連接關係。

      由於每條邊會在其兩個端點各被檢查一次(無向圖的特性)，因此遍歷所有邊的總成本是 O(E)。

  - 空間複雜度：O(V)。包含兩個主要部分：

    - HashMap 儲存所有節點的映射關係，需要 O(V) 的空間

    - 遞迴 call stack，在最壞情況下(例如圖退化成一條鏈)深度可達 O(V)。

  - 通過狀態：✅ AC

- **其他備註(優化方向、特殊限制、問題延伸討論)**：

  - 迭代版本的 DFS 實作：使用 stack 取代遞迴 → solution1-iter.js

- **測試案例**：

  - 案例 A: 多節點的 graph

    Input: adjList = [[2,4],[1,3],[2,4],[1,3]]

    Output: [[2,4],[1,3],[2,4],[1,3]]

    Expected: [[2,4],[1,3],[2,4],[1,3]]

  ***

  - 案例 B: 只有一個節點的 graph

    Input: adjList = [[]]

    Output: [[]]

    Expected: [[]]

  ***

  - 案例 C: Empty graph

    Input: adjList = []

    Output: []

    Expected: []

### Solution2(BFS)

- **思路說明**：

  建立一個 hashmap，用於紀錄原節點與複製節點的映射關係。

  建立一個 queue，用於 BFS 層級遍歷，並將根節點作為初始節點放入 queue。同時，先複製根節點並將映射關係存入 hashmap。

  進入 BFS 流程：

  - 從 queue 中取出當前原節點(此時該節點本身已複製完成，但其鄰居節點可能尚未處理)

  - 遍歷當前節點的所有鄰居節點：

    - 檢查該鄰居節點是否已存在於 hashmap 中

    - 若不存在，表示該鄰居節點尚未複製，則建立複製節點並存入 hashmap，同時將該鄰居節點加入 queue 等待後續處理

      - 為什麼要把鄰居節點放進 queue 中? 因為雖然鄰居節點已經複製完畢，但其鄰居節點的鄰居節點可能還尚未複製

    - 若已存在，則無需重複複製

    - 將鄰居的複製節點加入到當前節點的複製節點的 neighbors 中，建立節點間的連接

  重複以上步驟直到 queue 為空。

  最後返回根節點對應的複製節點（即 hashmap.get(node)）。

- **複雜度分析**：

  - 時間複雜度：O(V + E)。其中 V 為圖中的節點數量，E 為邊的數量。

    - 每個節點只被訪問一次進行複製，成本為 O(V)。

    - 在處理每個節點時，需要檢查其所有鄰居節點來建立連接關係。因此會遍歷圖中的每條邊來建立節點之間的連接，這部分的成本是 O(E)。

  - 空間複雜度：O(V)。同樣包含兩個部分：

    - HashMap 儲存所有節點映射需要 O(V) 的空間

    - Queue 在最壞情況下可能需要同時儲存某一層的所有節點。

      在極端情況下(例如星型圖或完全圖)，某一層可能包含接近 O(V) 個節點，因此queue的空間需求也是 O(V)。

  - 通過狀態：✅ AC

- **測試案例**：同 Solution1 測試範例

## 學習記錄

- 首次解題：2025-11-09 | 耗時：15分鐘(DFS) | 獨立完成：是
- 首次解題：2025-11-09 | 耗時：N/A分鐘(BFS) | 獨立完成：否，參考 AI 解答。待複習，對於該題 BFS 沒有很熟悉
- 複習1：2025-11-10 | 耗時：6分鐘(BFS) | 獨立完成：是 | 順暢度：流暢。刻意練習 BFS，因為上次沒解出來，這次解出來整體思路是清晰的也有理解。
- 複習2：2025-11-13 | 耗時：7分鐘(BFS) | 獨立完成：是 | 順暢度：流暢。再次刻意練習 BFS，整體思路清晰也有理解。
