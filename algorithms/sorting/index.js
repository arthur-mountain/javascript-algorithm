/**
 * 排序演算法 Sorting Algorithms - 統一入口（barrel）
 *
 * 每種排序的實作與說明都拆到各自的子目錄：
 *   {algo}/index.js  ← 程式碼的 Single Source of Truth
 *   {algo}/README.md ← 該演算法的完整講解
 * 總覽請見 README.md。
 */

const { bubbleSort } = require("./bubble-sort");
const { selectionSort } = require("./selection-sort");
const { insertionSort } = require("./insertion-sort");
const {
  mergeSort,
  merge,
  mergeSortInPlace,
  mergeInPlace,
} = require("./merge-sort");
const { quickSort, lomutoPartition, quickSort3Way } = require("./quick-sort");
const { heapSort, heapify } = require("./heap-sort");
const { shellSort } = require("./shell-sort");
const { countingSort } = require("./counting-sort");
const { radixSort, countingSortByDigit } = require("./radix-sort");
const { bucketSort } = require("./bucket-sort");

module.exports = {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  merge,
  mergeSortInPlace,
  mergeInPlace,
  quickSort,
  lomutoPartition,
  quickSort3Way,
  heapSort,
  heapify,
  shellSort,
  countingSort,
  radixSort,
  countingSortByDigit,
  bucketSort,
};
