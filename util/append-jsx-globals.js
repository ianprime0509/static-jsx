// Not sure how else to handle this; there's no syntax for declare global in
// JSDoc
import { appendFile } from "node:fs/promises";
import { argv } from "node:process";

const globals = `
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: unknown;
    }

    type Element = RawHtml;

    interface ElementChildrenAttribute {
      children: unknown;
    }
  }
}
`;

await appendFile(argv[2], globals, { encoding: "utf-8" });
