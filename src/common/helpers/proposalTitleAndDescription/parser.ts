import fs from "fs";

const contents = fs.readFileSync("approvedIdentifiers.txt", "utf-8");
const lines = contents.split("\n");
const parsedLines = JSON.stringify(lines.map(parseLine))
fs.writeFile('approvedIdentifiers.json', parsedLines, err => console.error(err))

function parseLine(line: string) {
  const dividerIndices: number[] = [];

  for (let i = 0; i < line.length; i++) {
    if (line[i] === "|") {
      dividerIndices.push(i);
    }
  }

  const title = line.substring(dividerIndices[0] + 1, dividerIndices[1]);
  const summary = line.substring(dividerIndices[1] + 2, dividerIndices[2]);
  const unparsedUmipLink = line.substring(dividerIndices[2] + 2, line.length);
  const umipLink = parseUmipLink(unparsedUmipLink);

  return { title, summary, umipLink };
}

function parseUmipLink(umipLink: string) {
  const number = umipLink.substring(
    umipLink.indexOf("[") + 1,
    umipLink.indexOf("]")
  );
  const url = umipLink.substring(
    umipLink.indexOf("(") + 1,
    umipLink.indexOf(")")
  );

  return { number, url };
}
