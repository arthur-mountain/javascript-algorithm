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
        // NOTE: there're still add zero as leading number that processing by javascript engine, could we make it better?
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

  if (!num) return 0;

  // 4. check the interger is in range
  // 4.1 if gt than 2^31 -1 return 2^31 -1
  // 4.2 if lt than -2^31 return -2^31
  const MAX = 2147483647;
  const MIN = -2147483648;
  if (num > MAX) return MAX;
  if (num < MIN) return MIN;
  return num;
};

// console.log(myAtoi("0-1"));
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
