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

- 思路說明：實作 trie ，在每個 end of word 的節點紀錄 value(同時也代表著有 value 的節點是一個 end of word 的節點)

  - insert：一般 Trie 的 insert，在最後要更新 value 值

    - 時間複雜度：O(k) -> K 是插入時 key 的長度
    - 空間複雜度：O(k) -> K 是插入時 key 的長度，最壞情況第一次插入時，每個 char 都要建立 CharNode

  - sum: 先找到 prefix 節點，從 prefix 節點往下累加所有 end of word 節點的值

    - 時間複雜度：O(p + n) -> p 是 prefix 的長度，因為要先找到 prefix 節點，n 是以 prefix 為根的子樹節點，因為每一個子樹節點都會走訪一次
    - 空間複雜度：O(h) -> h 以 prefix 為根的子樹高度，作為遞迴深度從 prefix 節點往下累加節點得值

- 其他備註(優化方向、特殊限制、問題延伸討論)：

1. insert and sum 時，key, prefix 為空時的情境要做處理，不然可能會不合預期。（雖然題目有說 key, prefix 不得為空）

2. 問題延伸討論：如果 sum 重複被喊多次導致重複計算，怎麼處理？

   - 直接在每一個節點先算好以當前節點為根的子樹和，這樣就可以不會每次都遞迴累加，雖然可以會多耗費一些 insert 時的複雜度
