import fs from "fs";
import path from "path";
import https from "https";

main();

async function main() {
  const url =
    "https://raw.githubusercontent.com/UMAprotocol/docs/master/docs/uma-tokenholders/approved-price-identifiers.md";
  await downloadFile(
    url,
    path.join(__dirname, "./approvedIdentifiersTable.md")
  );
  const contents = fs.readFileSync(
    path.join(__dirname, "./approvedIdentifiersTable.md"),
    "utf-8"
  );
  const lines = contents
    .split("\n")
    // ignore the first 8 lines (headmatter and table headers)
    .slice(8);
  const parsedLines = JSON.stringify(lines.map(parseLine));
  fs.writeFile(
    path.join(__dirname, "./approvedIdentifiersTable.json"),
    parsedLines,
    (err) => console.error(err)
  );
}

function parseLine(line: string) {
  const dividerIndices: number[] = [];

  for (let i = 0; i < line.length; i++) {
    if (line[i] === "|") {
      dividerIndices.push(i);
    }
  }

  const title = line.substring(dividerIndices[0] + 1, dividerIndices[1]);
  const summary = line.substring(dividerIndices[1] + 2, dividerIndices[2]);
  const markdownUmipLink = line.substring(dividerIndices[2] + 2, line.length);
  const umipLink = parseMarkdownUmipLink(markdownUmipLink);

  return {
    title,
    summary,
    umipLink,
  };
}

function parseMarkdownUmipLink(umipLink: string) {
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

async function downloadFile(url: string, targetFile: fs.PathLike) {
  return await new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        const code = response.statusCode ?? 0;

        if (code >= 400) {
          return reject(new Error(response.statusMessage));
        }

        // handle redirects
        if (code > 300 && code < 400 && !!response.headers.location) {
          return downloadFile(response.headers.location, targetFile);
        }

        // save the file to disk
        const fileWriter = fs.createWriteStream(targetFile).on("finish", () => {
          resolve({});
        });

        response.pipe(fileWriter);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
