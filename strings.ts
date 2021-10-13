export function replaceChar(
  origString: string,
  replaceChar: string,
  index: number
): string {
  let firstPart = origString.substr(0, index);
  let lastPart = origString.substr(index + 1);

  let newString = firstPart + replaceChar + lastPart;
  return newString;
}
