/**
 * Status:
 *  - [x] Done
 *  - [x] Follow-up solutions
 *
 * Title:
 *    804. Unique Morse Code Words
 *
 * Topics:
 *    1. Array
 *    2. Hash Table
 *    3. String
 *
 * Statements:
 *    Give an word list, each word in the list is a string.
 *
 *    transform all word to morse code,
 *
 *    then return the number of different transformations among all words.
 *
 * Constraints:
 *    1. 1 <= words.length <= 100
 *    2. 1 <= words[i].length <= 12
 *    3. words[i] consists of lowercase English letters.
 **/
/**
 * @param {string[]} words
 * @return {number}
 */
const mosesMap = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
};
let uniqueMorseRepresentations = function (words) {
  // create the mosesMap, there are 26 letters in the alphabet, so it's constant time
  // create a set to store the unique moses code
  // transform each word to moses code and store it in the set
  // return the size of the set
  // Time: O(n)
  // Space: O(n)
  const length = words.length;
  const moseWords = new Set();

  let moseWord = "";
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < words[i].length; j++) {
      moseWord += mosesMap[words[i][j]];
    }
    moseWords.add(moseWord);
    moseWord = "";
  }

  return moseWords.size;
};
