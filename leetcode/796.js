/*
 * Status:
 *  - [x] Done
 *  - [] Follow up solutions
 *
 * Title:
 *  796. Rotate String
 *
 * Topics:
 *
 * Constraints:
 *  1. 1 <= s.length, goal.length <= 100
 *
 *  2. s and goal consist of lowercase English letters.
 *
 * Statements:
 *  We are given two strings, s and goal.
 *
 *  We can shift s any number of times.
 *
 *  The character that is shifted out from the beginning of s is appended to the end of s,
 *
 *  If it's possible for s to become the same as goal, return true, otherwise return false.
 *
 *  For example, if s = "abcde", and goal = "cdeab", return true.
 *  first  shift -> s = "bcdea"
 *  second shift -> s = "cdeab" # this same as goal so return true
 **/
/**
 * @param {string} s
 * @param {string} goal
 * @return {boolean}
 */
let rotateString = (s, goal) => {
  /**
   * Thoughts:
   *  if s === goal, return true
   *
   *  if s.length === 1, return s === goal
   *
   *  if the len of s and goal are not equal, return false
   *
   *  turn s and goal into array
   *  for each element in s, pop the last element to the beginning of the array
   *  if s.join("") === goal.join("") return true
   *
   *
   * Time complexity: O(n + n + (n * n+n)) => O(n^2)
   * Space complexity: O(n)
   **/
  if (s === goal) return true;

  let sLen = s.length;
  if (sLen === 1) return s === goal;

  if (sLen !== goal.length) return false;

  s = s.split("");
  goal = goal.split("");
  for (let i = 0; i < sLen; i++) {
    s.push(s.shift());
    if (s.join("") === goal.join("")) return true;
  }
  return false;
};

/* improvement v2 */
rotateString = (s, goal) => {
  /**
   * Thoughts:
   *  if s === goal, return true
   *
   *  if s.length === 1, return s === goal
   *
   *  if the len of s and goal are not equal, return false
   *
   *  for each element in s,
   *  concat the substring from i to the end of s and the substring from 0 to i
   *
   *  Time complexity: O(n * (n+n)) => O(n^2)
   *  Space complexity: O(1)
   **/
  if (s === goal) return true;
  let sLen = s.length;
  if (sLen === 1) return s === goal;
  if (sLen !== goal.length) return false;

  for (let i = 0; i < sLen; i++) {
    if (s.substring(i) + s.substring(0, i) === goal) return true;
  }
  return false;
};
