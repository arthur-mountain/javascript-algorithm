/*
 * - [x] Done
 * - [x] Follow up solutions
 *    - Same concept but use two variable name
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

/* Follow up */
averageWaitingTime = (customers) => {
  let wait = 0;
  let start = 0;

  for (let i = 0; i < customers.length; i++) {
    // the current customer chef start time
    // if the previous end time over the current customer arrival time
    // means the current customer need to wait extra time for chef service previous customer
    // that start time should be the previous end time
    start = start > customers[i][0] ? start : customers[i][0];

    // wait time for the current customer
    //
    // chef start time sub customer arrival time,
    // means the extra time that chef server previous customer
    // it's also the waiting time for current customer
    //
    // and plus the original waiting time for the current customer
    wait += start - customers[i][0] + customers[i][1];

    // the next customer chef start time
    start += customers[i][1];
  }

  return wait / customers.length;
};

/* Follow up */
averageWaitingTime = (customers) => {
  let wait = customers[0][1];
  let start = customers[0][0] + wait;

  for (let i = 1; i < customers.length; i++) {
    start = start > customers[i][0] ? start : customers[i][0];
    wait += start - customers[i][0] + customers[i][1];
    start += customers[i][1];
  }

  return wait / customers.length;
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
