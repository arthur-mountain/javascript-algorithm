/*
 * - [x] Done
 */
/**
 * @param {number[][]} customers
 * @return {number}
 */
let averageWaitingTime = (customers) => {
  let wait = 0;
  let endsAt = 0;
  let total = 0;

  for (let i = 0; i < customers.length; i++) {
    // if the previous customer end time gt current customer arrival time
    // means the current customer need to wait extra time for chef service previous customer
    wait =
      endsAt > customers[i][0]
        ? customers[i][1] + (endsAt - customers[i][0])
        : customers[i][1];

    // current customer end time it also means the next customer start time
    endsAt = customers[i][0] + wait;

    // the total waiting time for all customers
    total += wait;
  }

  return total / customers.length;
};

averageWaitingTime([
  [1, 2],
  [2, 5],
  [4, 3],
]);

averageWaitingTime([
  [5, 2],
  [5, 4],
  [10, 3],
  [20, 1],
]);
