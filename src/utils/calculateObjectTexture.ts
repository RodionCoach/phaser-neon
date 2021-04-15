const calculateObjectTextureNumber = (string: string): number => {
  if (string.length <= 2) {
    return 1;
  } else if (string.length <= 3) {
    return 2;
  } else if (string.length <= 5) {
    return 3;
  } else if (string.length <= 6) {
    return 4;
  } else {
    return 4;
  }
};

export default calculateObjectTextureNumber;
