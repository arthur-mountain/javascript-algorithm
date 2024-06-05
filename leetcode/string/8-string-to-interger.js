/**
 * @param {string} s
 * @return {number}
 */
const myAtoi = (s) => {
  if (!s) return 0;

  const length = s.length;
  const isNumber = (c) => /^[0-9]$/.test(c);
  let i = 0;
  let num = "";
  let sign = "";

  while (1) {
    if (i > length) break;

    if (!num) {
      if (s[i] === " ") {
        if (num || sign) return 0;
        i++;
        continue;
      }

      if (s[i] === "+" || s[i] === "-") {
        if (num || sign) return 0;
        sign = s[i];
        i++;
        continue;
      }

      if (s[i] === "0") {
        num += s[i];
        i++;
        continue;
      }

      if (isNumber(s[i])) {
        num += s[i];
        i++;
        continue;
      }

      return 0;
    }

    if (isNumber(s[i])) {
      num += s[i];
      i++;
      continue;
    }

    break;
  }

  num = +(sign + num) || 0;

  // 4. check the interger is in range
  // 4.1 if gt than 2^31 -1 return 2^31 -1
  // 4.2 if lt than -2^31 return -2^31
  const limit = 2 ** 31;
  if (num > limit - 1) return limit - 1;
  if (num < -limit) return -limit;
  return num;
};

console.log(myAtoi("0-1"));
// console.log(myAtoi("1337c0d3"));
// console.log(myAtoi("42"));
// console.log(myAtoi("        -042"));
// console.log(myAtoi("-91283472332"));
// console.log(myAtoi("21474836460"));
// console.log(myAtoi("+-12"));
// console.log(myAtoi("words and 987"));
// console.log(myAtoi("042"));
// console.log(myAtoi("-042"));
// console.log(myAtoi("000000000000000000000000000011"));
// console.log(myAtoi("   +0 123"));
// console.log(myAtoi("-5-"));
// console.log(myAtoi("  +  413"));

// while (1) {
//   if (i > length) break;
//   // 1. ignored leading white spaces
//   // 2. check the next char is a sign character (+ or -)
//   // 3. ignored the char(s) of zero until reach the first non-zero char
//   // 3.1 if the no zero char founded, return 0
//   if (s[i] === " ") {
//     // if the space is not the leading char, break the loop
//     if (num) break;
//     i++;
//     continue;
//   }
//
//   if (s[i] === "+" || s[i] === "-") {
//     // if the sign is not the leading char, break the loop
//     if (num) break;
//     sign += s[i];
//     i++;
//     continue;
//   }
//
//   // if the first char is not a number, return 0
//   if (!num && !isNumber(s[i])) return 0;
//   // if reach the char is not a number, break the loop
//   if (num && !isNumber(s[i])) break;
//   // if is a number, add to num
//   if (isNumber(s[i])) num += s[i];
//   i++;
// }
