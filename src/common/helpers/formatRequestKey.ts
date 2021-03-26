export default function formatRequestKey(
  time: string,
  identifier: string,
  roundId: string
) {
  return identifier + "-" + time + "-" + roundId;
}
