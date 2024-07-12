/**
 * @param {string} s
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
let maximumGain = (s, x, y) => {
  let i = 0,
    j = 1,
    str = "",
    last = -1,
    score = 0;

  while (1) {
    if (!s[i] || !s[j]) break;

    str = s[i] + s[j];

    if (str === "ab") {
      console.log("str === ab", i, j, x);
      score += x;
      j++;
      last = i--;
    } else if (str === "ba") {
      console.log("str === ba", i, j, y);
      score += y;
      i--;
      j++;
      last = i--;
    } else {
      if (last >= 0) {
        last = 0;
        i = j;
        j++;
      } else {
        i++;
        j++;
      }
    }
  }

  console.log(score);

  return score;
};

maximumGain("cdbcbbaaabab", 4, 5);
// maximumGain("aabbaaxybbaabb", 5, 4);
