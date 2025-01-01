/*
 * - [x] Done
 *   - sorting algorithms
 * - [x] Follow up solutions
 *   - sorting algorithms
 */
/**
 * @param {number[]} nums
 * @return {number[]}
 */
let sortArray = (nums) => {
  return mergeSort(nums, nums.length);
};

/* bubble sort: O(n^2) */
// compare the adjacent elements and swap if they are in the wrong order
// keep doing this until the last element
function bubbleSort(nums, len) {
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (nums[j] > nums[j + 1]) {
        [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
      }
    }
  }
  return nums;
}

/* selection sort: O(n^2) */
// pick the smallest element and swap with the first element
// pick the second smallest element and swap with the second element
// keep doing this until the last element
function selectionSort(nums, len) {
  for (let i = 0; i < len; i++) {
    let minIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (nums[j] < nums[minIndex]) {
        minIndex = j;
      }
    }
    [nums[i], nums[minIndex]] = [nums[minIndex], nums[i]];
  }
  return nums;
}

/* insertion sort: O(n^2) */
// start at index one and compare with the previous elements,
// if the current element is smaller than the previous element,
// move the previous element to the next
// keep doing this until the current element is greater than the previous element
function insertionSort(nums, len) {
  for (let i = 1; i < len; i++) {
    let key = nums[i];
    let j = i - 1;
    while (j >= 0 && nums[j] > key) {
      nums[j + 1] = nums[j];
      j--;
    }
    nums[j + 1] = key;
  }
  return nums;
}

/* quick sort: O(nlogn) */
// pick a pivot element
// divide the array into two halves
// recursively sort the left array until the array length is 1
// recursively sort the right array until the array length is 1
// concatenate the left array, pivot, and right array
function quickSort(nums, len) {
  if (len <= 1) return nums;

  let pivot = nums[0];
  let left = [];
  let right = [];
  for (let i = 1; i < len; i++) {
    if (nums[i] < pivot) {
      left.push(nums[i]);
    } else {
      right.push(nums[i]);
    }
  }

  return quickSort(left, left.length).concat(
    pivot,
    quickSort(right, right.length),
  );
}

/* merge sort: O(nlogn) */
// divide the array into two halves
// recursively sort the left array until the array length is 1
// recursively sort the right array until the array length is 1
// merge the two arrays
function mergeSort(nums) {
  if (nums.length < 2) return nums;
  const mid = Math.floor(nums.length / 2);
  const subLeft = mergeSort(nums.slice(0, mid));
  const subRight = mergeSort(nums.slice(mid));
  return merge(subLeft, subRight);
}
function merge(a, b) {
  let result = [];
  while (a.length && b.length) result.push(a[0] < b[0] ? a.shift() : b.shift());
  return result.concat(a.length ? a : b);
}

/* built-in sort: O(nlogn) */
function builtInSort(nums) {
  return nums.sort();
}

/* counting sort: O(n+k) */
function countingSort(nums, len) {}

/* radix sort: O(nk) */
function radixSort(nums, len) {}

sortArray([5, 2, 3, 1]);
sortArray([5, 1, 1, 2, 0, 0]);
