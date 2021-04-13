export const shuffle = (array: Array<number>) => {
  if (array.length > 120) {
    let iBegin = 100;
    let jBegin = 0;
    let tempBegin = 0;
    while (iBegin--) {
      jBegin = Math.floor(Math.random() * (iBegin + 1));
      tempBegin = array[iBegin];
      array[iBegin] = array[jBegin];
      array[jBegin] = tempBegin;
    }
  }

  let i = array.length;
  let j = 0;
  let temp = 0;
  const delta = array.length === 1000 ? 0.1 : 0;
  while (i--) {
    j = Math.floor((Math.random() + delta) * (i + 1));
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};
