/*
 * - [X] Done
 * - [] Refer to what others are doing
 */
/**
 * @param {number[]} arr
 * @return {boolean}
 */
const threeConsecutiveOdds = (arr) => {
  let length = arr.length;
  let start = 0;
  let count = 0;

  while (start < length) {
    if (arr[start] % 2 !== 0) {
      count++;
    } else {
      count = 0;
    }

    if (count === 3) {
      return true;
    }

    start++;
  }

  return false;
};
