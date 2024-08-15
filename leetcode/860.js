/*
 * - [] Done
 * - [] Follow up solutions
 */
/**
 * @param {number[]} bills
 * @return {boolean}
 */
let lemonadeChange = (bills) => {
  let stack = [];

  let change;
  for (const bill of bills) {
    if (bill > 5) {
      change = bill - 5;
      while (stack.length && change > 0) {
        change -= stack.pop() - 5;
      }
      if (change > 0) return false;
    }

    stack.push(bill);
  }

  return true;
};

console.log(lemonadeChange([5, 5, 5, 10, 20]));
console.log(lemonadeChange([5, 5, 10, 10, 20]));
console.log(lemonadeChange([5, 5, 5, 5, 20, 20, 5, 5, 20, 5]));
