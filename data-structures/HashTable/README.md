# HashTable

key-value pair 的資料結構(類似JS的Object)，適用於查詢與刪除

## Actions

- Insert： O(1)：若要插入的 bucket 已有值，用 LinkList or Array 的方式串連

- Lookup: O(1)：若有 collision 發生，lookup 的時間複雜度就可能會變成 O(n)

- Delete: O(1)：透過 hash function 直接找出該 key 對應的 value

- Search: O(1)：同上
