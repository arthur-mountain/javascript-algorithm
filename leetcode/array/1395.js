/**
 * @param {number[]} rating
 * @return {number}
 */
let numTeams = (rating) => {
};

/* problem-solving by violence but `Time Limit Exceeded` */
numTeams = (rating) => {
  let count = 0;

  for (let i = 0; i < rating.length; i++) {
    for (let j = i + 1; j < rating.length; j++) {
      for (let k = j + 1; k < rating.length; k++) {
        if (
          (rating[i] < rating[j] && rating[j] < rating[k]) ||
          (rating[i] > rating[j] && rating[j] > rating[k])
        ) {
          count++;
        }
      }
    }
  }

  return count;
};
