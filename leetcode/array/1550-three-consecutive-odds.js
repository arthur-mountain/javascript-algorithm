/*
 * - [X] Done
 * - [] Refer to what others are doing
 */
/**
 * @param {number[]} arr
 * @return {boolean}
 */
let threeConsecutiveOdds = (arr) => {
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

threeConsecutiveOdds = (arr) => {
  let length = arr.length;
  let start = 0;

  const isOdd = (v) => (v ? v % 2 !== 0 : false);

  while (start < length) {
    if (isOdd(arr[start]) && isOdd(arr[start + 1]) && isOdd(arr[start + 2])) {
      return true;
    }
    start++;
  }

  return false;
};
