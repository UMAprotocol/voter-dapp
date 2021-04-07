import stringToByte32 from "../stringToBytes32";

describe("stringToBytes32", () => {
  test("It converts a string of less than 32 to bytes to a Bytes Array", () => {
    const string = "test";
    const uIntString = new Uint8Array([
      116,
      101,
      115,
      116,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ]);
    expect(stringToByte32(string)).toEqual(uIntString);
  });

  test("It throws an error when a string is over 32 bytes", () => {
    const string = "zasdflkjzxciqwerlkjkljklzjxvczklxvcjjkljklxjvklzxjc";
    expect(() => {
      stringToByte32(string);
    }).toThrowError("too long");
  });
});
