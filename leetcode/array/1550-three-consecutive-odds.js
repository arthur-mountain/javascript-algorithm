/*
 * - [X] Done
 * - [X] Refer to what others are doing
 *    - Same approach but check the count is equal to 3 after count++
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

/* Refer answer */
threeConsecutiveOdds = (arr) => {
  let count = 0;

  for (const num of arr) {
    if (num % 2 !== 0) {
      count++;
      if (count === 3) {
        return true;
      }
    } else {
      count = 0;
    }
  }

  return false;
};
