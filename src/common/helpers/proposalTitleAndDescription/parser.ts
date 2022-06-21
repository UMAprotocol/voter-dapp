import fs from "fs";
import path from "path";

const contents = fs.readFileSync(
  path.join(__dirname, "./approvedIdentifiersTable.txt"),
  "utf-8"
);
const lines = contents.split("\n");
const parsedLines = JSON.stringify(lines.map(parseLine));
fs.writeFile(
  path.join(__dirname, "./approvedIdentifiersTable.json"),
  parsedLines,
  (err) => console.error(err)
);

function parseLine(line: string) {
  const dividerIndices: number[] = [];

  for (let i = 0; i < line.length; i++) {
    if (line[i] === "|") {
      dividerIndices.push(i);
    }
  }

  const title = line.substring(dividerIndices[0] + 1, dividerIndices[1]);
  const summary = line.substring(dividerIndices[1] + 2, dividerIndices[2]);
  const umipLink = line.substring(dividerIndices[2] + 2, line.length);

  return { title, summary, umipLink };
}
