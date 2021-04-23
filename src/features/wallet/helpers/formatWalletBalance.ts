// There are two different colours for the first 4 digits and last 4 digits of the number.
// Hence we need to return an array of strings.
// We want to limit the overall string length to ~8 digits.
export default function formatWalletBalance(balance: string): string[] {
  if (balance.includes(".")) {
    const strArray: string[] = [];
    const split = balance.split(".");
    const MAX_LENGTH_RIGHT_SIDE = 9 - split[0].length;
    let rightSide = "";
    // Need to confirm is the left whole number isn't a massive amount.
    // If it is, just show 1 decimal.
    if (MAX_LENGTH_RIGHT_SIDE > 0) {
      rightSide = split[1].substr(0, MAX_LENGTH_RIGHT_SIDE);
    } else {
      rightSide = split[1].substr(0, 1);
    }
    strArray.push(`${split[0]}.`);
    strArray.push(rightSide.substr(0, 8));
    return strArray;
  } else {
    const MAX_LENGTH_RIGHT_SIDE = 9 - balance.length;
    let trailingZeros = "";
    for (let i = 0; i < MAX_LENGTH_RIGHT_SIDE; i++) {
      trailingZeros = trailingZeros.concat("0");
    }
    return [`${balance}.`, trailingZeros];
  }
}
