/*
 * - [x] Done
 * - [] Follow up solutions
 */
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
let getLucky = (s, k) => {
  const mapping = new Map([
    ["a", 1],
    ["b", 2],
    ["c", 3],
    ["d", 4],
    ["e", 5],
    ["f", 6],
    ["g", 7],
    ["h", 8],
    ["i", 9],
    ["j", 10],
    ["k", 11],
    ["l", 12],
    ["m", 13],
    ["n", 14],
    ["o", 15],
    ["p", 16],
    ["q", 17],
    ["r", 18],
    ["s", 19],
    ["t", 20],
    ["u", 21],
    ["v", 22],
    ["w", 23],
    ["x", 24],
    ["y", 25],
    ["z", 26],
  ]);

  s = s
    .split("")
    .map((char) => mapping.get(char))
    .join("");

  let temp = 0;
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < s.length; j++) {
      temp += +s[j];
    }
    s = temp.toString();
    temp = 0;
  }

  return s;
};

/**
 * self follow-up: using unicode to get convert number for reduce memory usage
 * */
getLucky = (s, k) => {
  s = s
    .split("")
    .map((char) => char.charCodeAt(0) - 96)
    .join("");

  let temp = 0;
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < s.length; j++) {
      temp += +s[j];
    }
    s = temp.toString();
    temp = 0;
  }

  return s;
};

getLucky("iiii", 1); //?
getLucky("leetcode", 2); //?
getLucky("zbax", 2); //?
