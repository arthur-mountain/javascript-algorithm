/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function (digits) {
  let carry = 0;

  digits[digits.length - 1] += 1;

  if (digits[digits.length - 1] < 10) {
    return digits;
  }

  for (let i = digits.length - 1; i >= 0; i--) {
    digits[i] += carry;
    carry = Math.floor(digits[i] / 10);
    digits[i] %= 10;
  }

  if (carry > 0) {
    digits.unshift(carry);
  }

  return digits;
};
