export default function formatRequestKey(
  time: string,
  identifier: string,
  roundId: string
): string {
  return `${identifier}-${time}-${roundId}`;
}
