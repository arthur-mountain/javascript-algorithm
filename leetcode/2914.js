/*
 * Status:
 *  - [x] Done
 *  - [x] Follow-up solutions
 *
 * Title:
 *  2914. Minimum Number of Changes to Make Binary String Beautiful
 *
 * Topics:
 *  String
 *  Greedy
 *
 * Constraints:
 *  1. s has an even length.
 *
 *  2. s[i] is either '0' or '1'.
 *
 * Statements:
 *  A beautiful string is one where we can partition it into substrings,
 *  each with an even length, where all characters in each substring are the same(0 or 1).
 **/
/**
 * @param {string} s
 * @return {number}
 */
let minChanges = (s) => {
  /* refer answer */
  /*
   * Thoughts:
   *  Greedy approach:
   *  - Traverse each character `s[i]` in the string and check if it's different from the next character `s[i+1]`.
   *
   *  - If `s[i]` is not equal to `s[i+1]`, increment the `changes` counter because we need to change one of these characters to make the pair identical.
   *
   *  - Since modifying `s[i]` and `s[i+1]` makes this pair "beautiful," we can skip ahead by incrementing `i` by 2 to check the next pair.
   *
   * Each change ensures that a problematic adjacent pair becomes "beautiful."
   *
   * By skipping to `i + 2` after each change, we avoid unnecessary checks on characters we've already handled,
   * which minimizes the total number of changes.
   *
   * In summary, the algorithm efficiently guarantees that all adjacent pairs in the string are identical with the least number of changes.
   **/
  let changes = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== s[i + 1]) {
      changes++;
    }
  }
  return changes;
};
