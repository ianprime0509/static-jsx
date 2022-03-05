import * as assert from "uvu/assert";

import { RawHtml } from "../index.js";

/**
 * @param {unknown} actual
 * @param {RawHtml} expects
 */
export function assertIsRawHtml(actual, expects) {
  assert.ok(actual instanceof RawHtml, `expected RawHtml`);
  assert.equal(actual.html, expects, "raw HTML does not match");
}
