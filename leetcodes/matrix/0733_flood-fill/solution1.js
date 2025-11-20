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
  const queue = [sr, sc];

  while (queue.length > 0) {
    const cr = queue.shift();
    const cl = queue.shift();

    if (cr < 0 || cr >= row || cl < 0 || cl >= col || image[cr][cl] !== start) {
      continue;
    }

    image[cr][cl] = color;
    queue.push(cr - 1, cl); // 上
    queue.push(cr, cl + 1); // 右
    queue.push(cr + 1, cl); // 下
    queue.push(cr, cl - 1); // 左
  }

  return image;
};
