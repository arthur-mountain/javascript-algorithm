# Sorting

## bubble sort (n²)

每一輪一路往後比較，如果【前一個元素比後一個元素大】就【直接兩兩交換】，

每輪排序完後，可以排序出後面較大的值

## selection sort (n²)

每輪比完才交換位置，【以預設最小值的方式】，把每輪比較出來的最小值往前放

## insertion sort (n²)

拿當下的每個元素，跟【前面的元素比較】，插入到正確的位置

## merge sort (nlogn)

- 拆分: 將大陣列使用【二分法左右一直拆成小陣列】直到小陣列中只剩一個元素，

- 合併: 兩邊各自將【小陣列進行排序及合併】，直到最後兩邊會有已排序完的小陣列，再組回成大陣列

## quick sort (n²)

- 拆分:
  以【一個值為基準點(pivot)】進行拆分，
  【比 pivot 小就放到前面】(比基準值小的小陣列)，
  【比 pivot 大就放到後面】(比基準值大的小陣列)，
  直到陣列中只剩一個元素。
- 合併: 把左右陣列合併，組回大陣列。

P.S.
若【基準點落在最大值或最小值】，O(n²)
若【基準點落在中間】，O(nlogn)