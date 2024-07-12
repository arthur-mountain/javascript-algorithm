/********* Need more practice *********/

/*
 * - [] Done
 * - [x] Refer to what others are doing
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

maximumGain("aabbaaxybbaabb", 5, 4);

maximumGain("bcbcbbaaabab", 4, 5);

maximumGain("cbbcbbaaabab", 4, 5);

maximumGain("cdbcbbaaabab", 4, 5);
