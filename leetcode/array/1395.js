/**
 * @param {number[]} rating
 * @return {number}
 */
let numTeams = (rating) => {
  let count = 0;

  for (let i = 0; ; i++) {
    if (i >= rating.length - 2) break;

    let j = i + 1;
    let k = j + 1;

    while (k <= rating.length) {
      console.log(i, j, k);

      if (
        (rating[i] < rating[j] && rating[j] < rating[k]) ||
        (rating[i] > rating[j] && rating[j] > rating[k])
      ) {
        console.log(i, "-> ", rating[i]);
        console.log(j, "-> ", rating[j]);
        console.log(k, "-> ", rating[k]);
        count++;
      }

      k++;

      if (k > rating.length) {
        j++;
        k = j + 1;
      }
    }
  }

  console.log(count);

  return count;
};

/* problem-solving by violence but `Time Limit Exceeded` */
// numTeams = (rating) => {
//   let count = 0;
//
//   for (let i = 0; i < rating.length; i++) {
//     for (let j = i + 1; j < rating.length; j++) {
//       for (let k = j + 1; k < rating.length; k++) {
//         if (
//           (rating[i] < rating[j] && rating[j] < rating[k]) ||
//           (rating[i] > rating[j] && rating[j] > rating[k])
//         ) {
//           count++;
//         }
//       }
//     }
//   }
//
//   return count;
// };

/* problem-solving by violence but `Time Limit Exceeded` */
// numTeams = (rating) => {
//   let count = 0;
//
//   for (let i = 0; ; i++) {
//     if (i >= rating.length - 2) break;
//
//     let j = i + 1;
//     let k = j + 1;
//
//     while (k <= rating.length) {
//       if (
//         (rating[i] < rating[j] && rating[j] < rating[k]) ||
//         (rating[i] > rating[j] && rating[j] > rating[k])
//       ) {
//         count++;
//       }
//
//       k++;
//
//       if (k > rating.length) {
//         j++;
//         k = j + 1;
//       }
//     }
//   }
//
//   return count;
// };

numTeams([2, 5, 3, 4, 1]);
// numTeams([2, 1, 3]);
// numTeams([1, 2, 3, 4]);
