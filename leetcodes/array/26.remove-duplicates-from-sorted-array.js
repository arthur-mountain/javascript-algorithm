/**
 * @param {number[]} nums
 * @return {number}
 */
const solution1 = (nums) => {
  let index = 0;

  for (let i = 0; i < nums.length; i++) {
    if (i === 0 || nums[i] !== nums[i - 1]) {
      nums[index] = nums[i];
      index++;
    }
  }
  return index;
};

const solution2 = (nums) => {
  const set = new Set(nums);
  let idx = 0;
  set.forEach((num) => {
    nums[idx] = num;
    idx++;
  });
  return set.size;
};

console.log("remove duplicate test1: ", solution2([1, 1, 2]));
console.log(
  "remove duplicate test2: ",
  solution2([0, 0, 1, 1, 1, 2, 2, 3, 3, 4])
);
