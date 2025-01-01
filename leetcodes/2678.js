/*
 * - [x] Done
 * - [x] Follow up solutions
 *   - seems all the same logic
 */
/**
 * @param {string[]} details
 * @return {number}
 */
let countSeniors = (details) => {
  /**
   * the details[i].length == 15
   * the last 4 characters represent the age and the seat allotted
   *
   * we cound found the first two characters of 4 characters from the end
   *
   * if (age > 60) count++
   **/
  let count = 0;

  for (const detail of details) {
    if (+(detail[11] + detail[12]) > 60) {
      count++;
    }
  }

  return count;
};

countSeniors = (details) => {
  /**
   * the details[i].length == 15
   * the last 4 characters represent the age and the seat allotted
   *
   * we cound found the first two characters of 4 characters from the end
   *
   * if (detail[11] > 6) {
   *   count++
   *   continue
   * }
   *
   * if(detail[11] == 6 && detail[12] > 0)count++
   **/
  let count = 0;

  for (const detail of details) {
    if (+detail[11] > 6) {
      count++;
      continue;
    }

    if (+detail[11] >= 6 && +detail[12] > 0) count++;
  }

  return count;
};

countSeniors(["7868190130M7522", "5303914400F9211", "9273338290F4010"]);
countSeniors(["1313579440F2036", "2921522980M5644"]);
