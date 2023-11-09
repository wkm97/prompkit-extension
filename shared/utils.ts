export const randomId = () => {
  return Math.random().toString(36).substring(2, 9);
}

export const capitalize = (word) => {
  return word
    .split('')
    .map((letter, index) =>
      index ? letter.toLowerCase() : letter.toUpperCase(),
    )
    .join('');
}
