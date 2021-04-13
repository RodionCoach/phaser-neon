export const numbersArrayGenerator = (maxNumber: number) => {
  return Array.from({ length: maxNumber }, (item, index) => index + 1);
};
