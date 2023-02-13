/**
 * @param {string[]} strs
 * @return {string}
 */
const longestCommonPrefix = (strs) => {
  if (!strs.length) return "";

  let result = "";
  const shortestWord = strs.sort((a, b) => a.length - b.length)[0];

  for (let index = 0; index < shortestWord.length; index++) {
    const word = shortestWord[index];

    if (strs.some((str) => str[index] !== word)) break;
    result += word;
  }

  return result;
};

console.log(
  "expect received 'fl', received: ",
  longestCommonPrefix(["flower", "flow", "flight"])
);
console.log(
  "expect received '', received: ",
  longestCommonPrefix(["dog", "racecar", "car"])
);
