export const random = function (n) {
  return Math.floor(Math.random() * n);
}

export const takeSubArray = function (arr, count, start) {
  const subArr = new Array(count).fill(null);

  const startPositionInSubArr = random(count);
  let del = random(arr.length - count + 1);

  subArr[startPositionInSubArr] = arr[start];

  for (let i = 0; i < count; i++) {
    if (subArr[i]) continue;

    del++;
    const current = arr[(start + del) % arr.length];
    subArr[i] = current;
  }

  return subArr;
}