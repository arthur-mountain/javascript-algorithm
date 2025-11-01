/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let l = 0;
  let max = 0;
  let used = new Set();

  for (let r = 0; r < s.length; r++) {
    while (used.has(s[r])) {
      used.delete(s[l]);
      l++;
    }

    max = Math.max(max, r - l + 1);
    used.add(s[r]);
  }

  return max;
};
