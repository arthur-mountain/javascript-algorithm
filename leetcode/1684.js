/*
 * - [x] Done
 * - [] Follow up solutions
 */
/**
 * @param {string} allowed
 * @param {string[]} words
 * @return {number}
 */
let countConsistentStrings = (allowed, words) => {
  /*
   * Total Time: O(n * m + a)
   * Total Space: O(a + m)
   * */

  let answer = 0;
  // Space: O(a)
  allowed = new Set(allowed.split(""));

  let subStr;
  let subLastIdx;
  // Time: O(n)
  while (words.length) {
    subStr = words.pop().split("");
    subLastIdx = subStr.length - 1;

    // Time: O(m)
    for (let i = 0; i <= subLastIdx; i++) {
      // Time: O(1)
      if (!allowed.has(subStr[i])) {
        break;
      }
      if (i === subLastIdx) {
        answer++;
      }
    }
  }

  return answer;
};
