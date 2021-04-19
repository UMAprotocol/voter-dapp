import formatRequestKey from "../formatRequestKey";

describe("formatRequestKey", () => {
  test("combines identifier, time, and roundId into a hyphenated string", () => {
    const time = "12345";
    const identifier = "Admin 420";
    const roundId = "420";

    const combinedString = `${identifier}-${time}-${roundId}`;
    expect(formatRequestKey(time, identifier, roundId)).toEqual(combinedString);
  });
});
