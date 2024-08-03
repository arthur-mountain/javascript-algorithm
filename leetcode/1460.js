/*
 * - [x] Done
 * - [] Follow up solutions
 */
/**
 * @param {number[]} target
 * @param {number[]} arr
 * @return {boolean}
 */
let canBeEqual = (target, arr) => {
  /*
   * Although the target and arr length is equal from Constraints,
   * but we still check it.
   *
   * the length is one, we only compare the element is equal,
   * if not equal, return false.
   *
   * we sorted both of the array, the each element should as same as alternative element
   **/
  if (target.length !== arr.length) {
    return false;
  }

  if (target.length === 1) {
    return target[0] === arr[0];
  }

  // time complexity: O(2 * nlogn) -> O(nlogn)
  target.sort();
  arr.sort();

  // time complexity: O(n)
  for (let i = 0, len = target.length; i < len; i++) {
    if (target[i] !== arr[i]) {
      return false;
    }
  }

  // final time complexity: O(n + nlogn)
  // final space complexity: O(1)
  return true;
};

canBeEqual = (target, arr) => {
  /*
   * the length is one, we only compare the element is equal,
   * if not equal, return false.
   *
   * we create the counter for target arr, {element: count}
   *
   * and we iterate the arr,
   * if the element is not in the counter, return false
   * if the element is in the counter, decrement
   * if the element count is zero, delete the element from the counter
   *
   * final if the counter keys length is zero, return true otherwise false
   *
   * lead the time complexity decrease to O(n)
   * but the space complexity increase to O(n)
   * */
  if (target.length === 1) {
    return target[0] === arr[0];
  }

  let counter = new Map();

  for (const n of target) {
    counter.set(n, (counter.get(n) || 0) + 1);
  }

  for (const n of arr) {
    if (!counter.has(n)) {
      return false;
    }
    counter.set(n, counter.get(n) - 1);
    if (counter.get(n) === 0) {
      counter.delete(n);
    }
  }

  // final time  complexity: O(n)
  // final space complexity: O(n)
  return counter.size === 0;
};
