/*
 * - [x] Done
 * - [x] Follow up solutions
 *     the done answer from reference solutions
 */
/**
 * @param {number[][]} arrays
 * @return {number}
 */
let maxDistance = (arrays) => {
  /*
   * 記錄 iteration 過程中的最小值和最大值
   *
   *  並且記錄當前最大距離，在每次 iteration 過程中，取得當前的最大距離，根據：
   *  1. 當前的最大距離
   *  2. 「iteration 過程中的最大值」減去「當前陣列中的最小值」
   *  3. 「當前陣列中的最大值」      減去「iteration 過程中的最小值」
   *
   * 更新目前 iteration 過程中的最小值和最大值
   *
   * 可以直接更新 itration 過程中的最小值和最大值，不用擔心在同一個陣列中選取相同的值
   * 因為，
   * 每次 itration 都是拿尚未遍歷過的 array 中的最小、最大值 跟 itration 過的 array 的最小、最大值做比較，
   * */
  let currMin = arrays[0][0];
  let currMax = arrays[0][arrays[0].length - 1];
  let maxDistance = 0;

  for (let i = 1, len = arrays.length; i < len; i++) {
    const currArrLen = arrays[i].length;
    // found the maxDistance,
    // 1. current max distance
    // 2. current array min subtract currMax
    // 3. current array max subtract currMin
    maxDistance = Math.max(
      maxDistance,
      Math.abs(currMax - arrays[i][0]),
      Math.abs(arrays[i][currArrLen - 1] - currMin),
    );

    // update current min and max with current array
    // we can update the min and max directly,
    // do not afraid of pick same value in same array,
    currMin = Math.min(currMin, arrays[i][0]);
    currMax = Math.max(currMax, arrays[i][currArrLen - 1]);
  }

  return maxDistance;
};
