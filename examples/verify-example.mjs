import fs from "fs";
import path from "path";
import process from "process";

function compareDirectories(expected, actual) {
  const diffs = [];
  const expectedEntries = new Set(fs.readdirSync(expected));
  const actualEntries = new Set(fs.readdirSync(actual));
  for (const expectedFile of expectedEntries) {
    if (!actualEntries.has(expectedFile)) {
      diffs.push(`expected file ${expectedFile} is not present`);
      continue;
    }

    const expectedContents = fs.readFileSync(
      path.resolve(expected, expectedFile),
      { encoding: "utf-8" }
    );
    const actualContents = fs.readFileSync(path.resolve(actual, expectedFile), {
      encoding: "utf-8",
    });
    if (actualContents !== expectedContents) {
      diffs.push(
        `contents of file ${expectedFile} do not match:\nexpected: ${expectedContents}\nactual: ${actualContents}`
      );
    }
  }
  for (const actualFile of actualEntries) {
    if (!expectedEntries.has(actualFile)) {
      diffs.push(`file ${actualFile} is not expected`);
    }
  }
  return diffs;
}

const dir = process.argv[2];
if (!dir) throw new Error("No example directory specified");

const siteDiffs = compareDirectories(
  path.resolve(dir, "site-expect"),
  path.resolve(dir, "site")
);
if (siteDiffs.length > 0) {
  console.error(siteDiffs.join("\n"));
  process.exit(1);
}
