/********* Need more practice *********/

/*
 * - [] Done
 * - [x] Follow up solutions
 *   - ⭐ greedy algorithm
 */
/**
 * @param {string} s
 * @param {number} x
 * @param {number} y
 * @return {number}
 */

/* greedy + extra space for stack */
/* T: O(n), S: O(n) */
let maximumGain = (s, x, y) => {
  let i = 0;
  let score = 0;
  let top, bottom;
  let topScore, bottomScore;

  if (x > y) {
    top = "ab";
    topScore = x;
    bottom = "ba";
    bottomScore = y;
  } else {
    top = "ba";
    topScore = y;
    bottom = "ab";
    bottomScore = x;
  }

  console.log({ top, bottom });

  let stack = [];
  while (i < s.length) {
    if (s[i] === top[1] && stack[stack.length - 1] === top[0]) {
      score += topScore;
      stack.pop();
    } else {
      stack.push(s[i]);
    }
    i++;
  }

  i = 0;
  let newStack = [];
  while (i < stack.length) {
    if (stack[i] === bottom[1] && newStack[newStack.length - 1] === bottom[0]) {
      score += bottomScore;
      newStack.pop();
    } else {
      newStack.push(stack[i]);
    }
    i++;
  }

  return score;
};

/* greedy */
/* T: O(n)
 * S: O(n), string is immutable should needs convert to array that is O(n) in javascript, otherwise O(1) in other languages like c++
 * */
maximumGain = (s, x, y) => {
  const removePairs = (s, target) => {
    let write_ind = 0,
      count = 0;
    s = s.split("");
    for (let i = 0; i < s.length; i++) {
      s[write_ind] = s[i];
      write_ind++;
      if (
        write_ind >= 2 &&
        s[write_ind - 1] == target[1] &&
        s[write_ind - 2] == target[0]
      ) {
        count++;
        write_ind -= 2;
      }
    }
    s = s.slice(0, write_ind).join("");
    return { s, count };
  };

  let res = 0;
  let top, bot;
  let top_score, bot_score;

  if (y > x) {
    top = "ba";
    top_score = y;
    bot = "ab";
    bot_score = x;
  } else {
    top = "ab";
    top_score = x;
    bot = "ba";
    bot_score = y;
  }

  let result = removePairs(s, top);
  s = result.s;
  res += result.count * top_score;

  result = removePairs(s, bot);
  res += result.count * bot_score;

  return res;
};

/* Follow up*/
/* T: O(n), S: O(1) */
maximumGain = (s, x, y) => {
  let aCount = 0;
  let bCount = 0;
  let lesser = Math.min(x, y);
  let result = 0;

  for (let i = 0; i < s.length; i++) {
    let c = s.charAt(i);
    if (c > "b") {
      result += Math.min(aCount, bCount) * lesser;
      aCount = 0;
      bCount = 0;
    } else if (c === "a") {
      if (x < y && bCount > 0) {
        bCount--;
        result += y;
      } else {
        aCount++;
      }
    } else if (c === "b") {
      if (x > y && aCount > 0) {
        aCount--;
        result += x;
      } else {
        bCount++;
      }
    }
  }

  result += Math.min(aCount, bCount) * lesser;
  return result;
};

maximumGain("aabbaaxybbaabb", 5, 4);

maximumGain("bcbcbbaaabab", 4, 5);

maximumGain("cbbcbbaaabab", 4, 5);

maximumGain("cdbcbbaaabab", 4, 5);
