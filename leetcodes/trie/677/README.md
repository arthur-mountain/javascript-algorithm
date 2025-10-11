---
title: "677. Map Sum Pairs"
tags:
  - Hash Table
  - String
  - Design
  - Trie
difficulty: "Medium"
date_solved: "2025-10-10"
---

## 問題描述

設計一個資料結構，支援以下兩種操作：

- insert(key, val)：插入一個 key-value 配對，如果 key 已存在則更新其值

- sum(prefix)：返回所有以 prefix 為前綴的 key 的值的總和

## Constraints

- 1 <= key.length, prefix.length <= 50
- key and prefix consist of only lowercase English letters.
- 1 <= val <= 1000
- At most 50 calls will be made to insert and sum.

## 解法總覽

### Solution1

- **思路說明**：實作 trie ，在每個 end of word 的節點紀錄 value(同時也代表著有 value 的節點是一個 end of word 的節點)

  - insert：一般 Trie 的 insert，在最後要更新 value 值

    - 時間複雜度：O(k) -> K 是插入時 key 的長度
    - 空間複雜度：O(k) -> K 是插入時 key 的長度，最壞情況第一次插入時，每個 char 都要建立 CharNode

  - sum: 先找到 prefix 節點，從 prefix 節點往下累加所有 end of word 節點的值

    - 時間複雜度：O(p + n) -> p 是 prefix 的長度，因為要先找到 prefix 節點，n 是以 prefix 為根的子樹節點，因為每一個子樹節點都會走訪一次
    - 空間複雜度：O(h) -> h 以 prefix 為根的子樹高度，作為遞迴深度從 prefix 節點往下累加節點得值

- **其他備註\(優化方向、特殊限制、問題延伸討論\)**：

  1. insert and sum 時，key, prefix 為空時的情境要做處理，不然可能會不合預期。（雖然題目有說 key, prefix 不得為空）

  2. 問題延伸討論：如果 sum 重複被喊多次導致重複計算，怎麼處理？

     - 參考 solution2

  3. 問題延伸討論：如果要支援 delete 方法？

     - lazy deletion: 將 value 設值為 null，只標記 key 已刪除，不移除節點

       優點：實作簡單，delete 操作快速

       缺點：記憶體無法回收，空間浪費，因此若如果頻繁插入和刪除，會有記憶體洩漏

       - 時間複雜度：O(k) -> k 是 key 的長度，只需要遍歷到結尾節點，設為 null
         空間複雜度：O(1)

     - immediate deletion: 刪除 key 時，移除不再需要的節點，判斷一個節點是否可以刪除：「沒有子節點」、「不是任何其他 key 的結尾」，會需要「由下而上」的遞迴刪除。

       優點：節省記憶體，真正回收記憶體，適合長期運行的系統

       缺點：實作複雜，需要判斷節點是否被其他 key 使用

       - 時間複雜度：O(k) -> k 是 key 的長度，雖然有遞迴，但每個節點只訪問一次
       - 空間複雜度：O(k)

### Solution2

- **思路說明**：

  每一個節點先算好以當前節點為根的子樹和，這樣就可以不會每次都遞迴累加，雖然可以會多耗費一些 insert 時的複雜度。

  需要用額外 Map 紀錄每一個 key 的值（用於處理更新）

  - insert：雖然每個節點要多累加以該節點為根時的 sum，但仍是 O(k)

    - 時間複雜度：O(k) -> K 是插入時 key 的長度
    - 空間複雜度：O(k) -> K 是插入時 key 的長度

  - (優化）sum: 找到 prefix 節點後直接回傳 sum。因為已經累加好了

    - 時間複雜度：O(p) -> p 是 prefix 的長度
    - 空間複雜度：O(1)
