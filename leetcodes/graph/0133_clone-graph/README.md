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

給予一個無向圖(undirected graph)節點，回傳深複製後的 graph。

每個節點包含

- 「一個 int val」
- 「一個 list 包含所有當前節點的鄰居節點」

## Constraints

- The number of nodes in the graph is in the range [0, 100].
- 1 <= Node.val <= 100
- Node.val is unique for each node.
- There are no repeated edges and no self-loops in the graph.
- The Graph is connected and all nodes can be visited starting from the given node.

## 解題思路

### 初步分析(觀察與發想)

- 我們可能需要一個 hashmap 紀錄 origin node 所對應到的 cloned node，再遍歷每一個 node 的時候先查看該節點是否有複製過
  - 如果有，則跳過複製流程，因為該自身及其 neighbors 應該已經處理過了。
  - 如果沒有，複製該節點並存進 hashmap 中，繼續遍歷該節點的鄰居節點進行複製，最後更新 cloned node 的 neighbors

## 解法總覽

### Solution1(DFS)

- **思路說明**：

  建立一個 hashmap，紀錄原節點與複製節點的映射，

  建立一個 clone function 遞迴調用，一個參數只有當前的 origin node，

  若 hashmap 已存在該原節點時，則不需遞迴複製，直接返回其複製節點

  否則，複製新的節點，將原節點與複製節點加入到 hashmap 中，遍歷原節點中的 neighbors 遞迴複製每一個 neighbor，

  最後返回，最根本的原節點其複製節點(即 hashmap.get(cloneGraph 的參數 node))

- **複雜度分析**：

  - 時間複雜度：O(n) -> 每個節點只會遍歷一次進行複製

  - 空間複雜度：O(n) -> call stack + hashmap 紀錄全部節點的映射

  - 通過狀態：✅ AC

- **測試案例**：

  - 案例 A: 多節點的 graph

    Input: adjList = [[2,4],[1,3],[2,4],[1,3]]

    Ouput: [[2,4],[1,3],[2,4],[1,3]]

    Expected: [[2,4],[1,3],[2,4],[1,3]]

  ***

  - 案例 B: 只有一個節點的 graph

    Input: adjList = [[]]

    Ouput: [[]]

    Expected: [[]]

  ***

  - 案例 C: Empty graph

    Input: adjList = []

    Ouput: []

    Expected: []

## 學習記錄

- 首次解題：2025-11-09 | 耗時：15分鐘(DFS) | 獨立完成：是
- 複習1：<!-- 日期 --> | 耗時：分鐘 | 獨立完成：□ 是 □ 否 | 順暢度：□ 流暢 □ 卡頓 □ 忘記
