// eslint-env jest

import { RawHtml } from "./index.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeRawHtml(content: string): R;
    }
  }
}

expect.extend({
  toBeRawHtml(received: unknown, content: string) {
    const pass = received instanceof RawHtml && received.html === content;
    if (pass) {
      return {
        message: () =>
          `expected ${String(
            received
          )} not to be raw HTML with content ${content}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${String(received)} to be raw HTML with content ${content}`,
        pass: false,
      };
    }
  },
});
