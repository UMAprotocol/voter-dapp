// Shorten ETH address to 0xaa...bbbb
export default function shortenAddress(address: string) {
  const leftSide = address.substr(0, 4);
  const rightSide = address.substr(address.length - 4, address.length);

  return `${leftSide}...${rightSide}`;
}
