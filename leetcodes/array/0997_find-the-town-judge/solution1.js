/**
 * @param {number} n
 * @param {number[][]} trust
 * @return {number}
 */
var findJudge = function (n, trust) {
  const trustScores = Array(n).fill(0);
  for (let i = 0; i < trust.length; i++) {
    const [a, b] = trust[i];
    trustScores[a - 1]--;
    trustScores[b - 1]++;
  }

  let townJudgeIndex = -1;
  for (let i = 0; i < trustScores.length; i++) {
    if (trustScores[i] === n - 1) {
      townJudgeIndex = i + 1;
      break;
    }
  }

  return townJudgeIndex;
};
