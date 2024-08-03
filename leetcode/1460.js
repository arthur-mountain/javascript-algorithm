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
   * */
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
