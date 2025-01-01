/*
 * - [x] Done
 *   - Check direction that depends on a multiple of n-1
 *   - Check if the increase starts at 1 or if the decrease starts at n,
 *   then add the remaining count which is time - pow * round
 * - [x] Follow up solutions
 *   - Same logic to check the direction of time
 *   - But use the modulo operator for the remaining n
 */
/**
 * @param {number} n
 * @param {number} time
 * @return {number}
 */
let passThePillow = (n, time) => {
  // check the example below,
  // the time   starts at 0
  // the number starts at 1

  // If the number is greater than time,
  // it just goes in one direction,
  // so do not consider alternating directions
  if (n > time) {
    return time + 1;
  }

  // check direction of increase or decrease
  // Each turn will be a multiple of n-1

  const pow = n - 1;

  const round = Math.floor(time / pow);

  // If it is 0, it is exactly n
  if (round === 0) {
    return n;
  }

  // If it is even, start at 1, and add remain n(time - pow * round)
  // If it is odd,  start at n, and sub remain n(time - pow * round)
  return round % 2 === 0 ? 1 + (time - pow * round) : n - (time - pow * round);
};

console.log(passThePillow(9, 4));
// time: 0 1 2 3 4
// n:    1 2 3 4 5

console.log(passThePillow(4, 5));
// time: 0 1 2 3 4 5
// n:    1 2 3 4 3 2

console.log(passThePillow(4, 7));
// time: 0 1 2 3 4 5 6 7
// n:    1 2 3 4 3 2 1 2

console.log(passThePillow(4, 13));
// time: 0 1 2 3 4 5 6 7 8 9 10 11 12 13
// n:    1 2 3 4 3 2 1 2 3 4 3  2  1  2

console.log(passThePillow(3, 2));
// time: 0 1 2
// n:    1 2 3

console.log(passThePillow(2, 2));
// time: 0 1 2
// n:    1 2 1

console.log(passThePillow(3, 10));
// time: 0 1 2 3 4 5 6 7 8 9 10
// n:    1 2 3 2 1 2 3 2 1 2 3

console.log(passThePillow(3, 11));
// time: 0 1 2 3 4 5 6 7 8 9 10 11
// n:    1 2 3 2 1 2 3 2 1 2 3  2

console.log(passThePillow(3, 13));
// time: 0 1 2 3 4 5 6 7 8 9 10 11 12 13
// n:    1 2 3 2 1 2 3 2 1 2 3  2  1  2

/* Refer answer */
passThePillow = (n, time) => {
  let count = Math.floor(time / (n - 1));
  let mod = time % (n - 1);

  // If is even starts at 1 and add remain n
  if (count % 2 == 0) {
    return 1 + mod;
  }

  // otherwise starts at n and sub remain n
  return n - mod;
};
