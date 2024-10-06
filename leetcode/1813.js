/*
 * - [] Done
 * - [] Follow up solutions
 */
/**
 * @param {string} sentence1
 * @param {string} sentence2
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

