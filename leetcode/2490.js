/*
 * Status:
 *  - [x] Done
 *  - [x] Follow up solutions
 *    - Not significant improvements in follow-up, but a few more solutions were added.
 *
 * Title:
 *  2490. Circular Sentence
 *
 * Topics:
 *  String
 *
 * Constraints:
 *  1. The sentence consist of all lowercase or uppercase letters.
 *  2. No leading or trailing spaces.
 *  3. Each word separated by a space.
 *
 * Statements:
 *  The last char of first word in the sentence is the first char of the next word,
 *  The last char of the last word in the sentence is the first char of the first word.
 *
 *  For example:
 *   sentence = "leetcode exercises sound delightful"
 *   leetcode -> exercises -> sound -> delightful -> leetcode -> ...
 *          e -> e       s -> s   d -> d        l -> l      e -> ...
 *
 * Thoughts:
 *  Iterate sentence,
 *
 *  if is last word
 *    check is the last char of sentence[i]
 *    is equal to the first char of the sentence[0] word
 *  else
 *    check is the last char of sentence[i]
 *    is equal to the first char of the sentence[i+1] word
 *
 **/
/**
 * @param {string} sentence
 * @return {boolean}
 */
let isCircularSentence = (sentence) => {
  sentence = sentence.split(" ");

  let isCircular = true;
  for (let i = 0, lastIdx = sentence.length - 1; i <= lastIdx; i++) {
    if (i === lastIdx) {
      isCircular = sentence[i][sentence[i].length - 1] === sentence[0][0];
    } else {
      isCircular = sentence[i][sentence[i].length - 1] === sentence[i + 1][0];
    }
    if (!isCircular) return false;
  }
  return isCircular;
};

isCircularSentence = (sentence) => {
  sentence = sentence.split(" ");

  for (let i = 0, lastIdx = sentence.length - 1; i <= lastIdx; i++) {
    if (i === lastIdx) {
      if (sentence[i][sentence[i].length - 1] !== sentence[0][0]) return false;
    } else {
      if (sentence[i][sentence[i].length - 1] !== sentence[i + 1][0])
        return false;
    }
  }

  return true;
};

isCircularSentence = (sentence) => {
  const len = sentence.length;

  // compare last char of the last word is equal to the first char of the first word
  if (sentence[0] !== sentence[len - 1]) return false;

  for (let i = 0; i < len; i++) {
    // found the space, compare the prev and next char is circular
    if (sentence[i] === " " && sentence[i - 1] !== sentence[i + 1]) {
      return false;
    }
  }

  return true;
};

/**
 * !!!Not recommended,
 * as same as above solution but we check the last char of the last word
 * is equal to the first char of the first word in for loop.
 * */
isCircularSentence = (sentence) => {
  const len = sentence.length;

  for (let i = 0; i < len; i++) {
    if (sentence[i] === " ") {
      // found the space, compare the prev and next char is circular
      if (sentence[i - 1] !== sentence[i + 1]) return false;
    } else if (i === len - 1) {
      // found the last char of last word, compare the first char of the first word
      if (sentence[i] !== sentence[0]) return false;
    }
  }

  return true;
};
