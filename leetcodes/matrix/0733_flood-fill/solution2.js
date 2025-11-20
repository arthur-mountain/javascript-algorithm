/**
 * @param {number[][]} image
 * @param {number} sr
 * @param {number} sc
 * @param {number} color
 * @return {number[][]}
 */
var floodFill = function (image, sr, sc, color) {
  const start = image[sr][sc];
  if (start === color) {
    return image;
  }

  const row = image.length;
  const col = image[0].length;

  const dfs = (cr, cl) => {
    if (cr < 0 || cr >= row || cl < 0 || cl >= col || image[cr][cl] !== start) {
      return;
    }

    image[cr][cl] = color;
    dfs(cr - 1, cl); // 上
    dfs(cr, cl + 1); // 右
    dfs(cr + 1, cl); // 下
    dfs(cr, cl - 1); // 左
  };

  dfs(sr, sc);
  return image;
};

var floodFillIteration = function (image, sr, sc, color) {
  const start = image[sr][sc];
  if (start === color) {
    return image;
  }

  const row = image.length;
  const col = image[0].length;
  const stack = [sr, sc];

  while (stack.length > 0) {
    const cl = stack.pop();
    const cr = stack.pop();

    if (cr < 0 || cr >= row || cl < 0 || cl >= col || image[cr][cl] !== start) {
      continue;
    }

    image[cr][cl] = color;
    stack.push(cr - 1, cl); // 上
    stack.push(cr, cl + 1); // 右
    stack.push(cr + 1, cl); // 下
    stack.push(cr, cl - 1); // 左
  }

  return image;
};
