/**
 * Status:
 *  - [x] Done
 *  - [ ] Follow-up solutions
 *
 * Title:
 *    383. Ransom Note
 *
 * Topics:
 *    1. HashMap
 *
 * Statements:
 *    Given two strings ransomNote and magazine,
 *
 *    we cloud pick any char from magazine to make a string of ransomNote.
 *
 *    note: each char in magazine can only be used once.
 *
 * Constraints:
 *    1. 1 <= ransomNote.length, magazine.length <= 10^5
 *
 *    2. ransomNote and magazine consist of lowercase English letters.
 **/
/**
 * @param {string} ransomNote
 * @param {string} magazine
 * @return {boolean}
 */
let canConstruct = (ransomNote, magazine) => {
  /*
   * Thoughts:
   *  preprocess to calculate the frequency of each char in magazine into a hashmap.
   *
   *  iterate the ransomNote, if the char is not in the hashmap or the frequency is 0, return false.
   *  if the char is in the hashmap and the frequency is not 0, decrease the frequency by 1.
   *  otherwise, return false.
   *
   *  Space: O(n)
   *
   *  Time: O(m + n)
   * */

  const map = new Map();
  for (const char of magazine) {
    map.set(char, (map.get(char) || 0) + 1);
  }

  for (const char of ransomNote) {
    if (!map.has(char) || map.get(char) === 0) {
      return false;
    }
    map.set(char, map.get(char) - 1);
  }
  return true;
};
