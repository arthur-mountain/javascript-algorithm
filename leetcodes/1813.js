/*
 * - [] Done
 *   - [] Follow up solutions
 *
 * - [x] refer solutions
 */
/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
let areSentencesSimilar = (s1, s2) => {
  /**
   *  if s1 == s2 return true
   *
   * two pointer
   * i start at first
   * j start at end
   * while(s1[i] && s2[i] && s1[j] && s2[j])
   *   if [[ s1[i] == s2[i] ]]; then i++;
   *   if [[ s1[j] == s2[j] ]]; then j--;
   * return i > initial vaue || j < initial value
   */
  if (s1 === s2) return true;

  s1 = s1.split(" ");
  s2 = s2.split(" ");

  const s1Len = s1.length;
  const s2Len = s2.length;
  if (s1Len === 1) {
    if (s2[0] === s1[0] || s2[s2Len - 1] === s1[0]) return true;
    return false;
  }
  if (s2Len === 1) {
    if (s2[0] === s1[0] || s1[s1Len - 1] === s2[0]) return true;
    return false;
  }

  let i1 = 0,
    j1 = s1Len;
  let i2 = 0,
    j2 = s2Len;

  while (i1 < j1 && i2 < j2) {
    if (s1[i1] === s2[i2] || s1[j1] === s2[j2]) {
      if (s1[i1] === s2[i2]) {
        i1++;
        i2++;
      }
      if (s1[j1] === s2[j2]) {
        j1--;
        j2--;
      }
    } else {
      return false;
    }
  }
  return true;
};

/** refer solutions */
areSentencesSimilar = (s1, s2) => {
  /** refer solutions */
  // Time complexity: O(n)
  // Space complexity: O(n)
  s1 = s1.split(" ");
  // Time complexity: O(m)
  // Space complexity: O(m)
  s2 = s2.split(" ");

  // Time complexity: swap two array O(1)
  // Ensure s1 is the longer sentence
  if (s1.length < s2.length) [s1, s2] = [s2, s1];

  // Space complexity: O(1)
  let start = 0,
    end = 0;

  // Time complexity: O(n + m)
  // Space complexity: O(1)
  let n1 = s1.length,
    n2 = s2.length;

  // Compare from the start. Time complexity: O(m)
  while (start < n2 && s1[start] === s2[start]) start++;

  // Compare from the end. Time complexity: O(m)
  while (end < n2 && s1[n1 - end - 1] === s2[n2 - end - 1]) end++;

  // Total time complexity: O(n + m)
  // Total space complexity: O(n + m)
  // Check if the remaining unmatched part is in the middle
  return start + end >= n2;
};

/** refer solutions */
areSentencesSimilar = (s1, s2) => {
  if (s1 == s2) return true;
  s1 = s1.split(" ");
  s2 = s2.split(" ");
  while (s1.at(0) === s2.at(0)) s1.shift(), s2.shift();
  while (s1.at(-1) === s2.at(-1)) s1.pop(), s2.pop();
  return !s1.length || !s2.length;
};
