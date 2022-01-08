import { suite } from "uvu";

import { RawHtml } from "../index.js";
import { assertIsRawHtml } from "./helpers.js";

const html = suite("html");

html("single HTML element", () => {
  assertIsRawHtml(<div>Hello, world!</div>, "<div>Hello, world!</div>");
});

html("nested HTML elements", () => {
  assertIsRawHtml(
    <main>
      <h1>Title</h1>
      <section>
        <h2>Section</h2>
        <p>Paragraph</p>
      </section>
    </main>,
    "<main><h1>Title</h1><section><h2>Section</h2><p>Paragraph</p></section></main>"
  );
});

html("void HTML elements", () => {
  assertIsRawHtml(<br />, "<br/>");
  assertIsRawHtml(<br></br>, "<br/>");
  assertIsRawHtml(
    <link rel="stylesheet" href="https://example.com/index.css" />,
    '<link rel="stylesheet" href="https://example.com/index.css"/>'
  );
});

html("attribute values are escaped", () => {
  assertIsRawHtml(
    <div data-strange="&lt;(){}&amp;'&quot;&gt;"></div>,
    '<div data-strange="&lt;(){}&amp;&#39;&quot;&gt;"></div>'
  );
});

html("single string child", () => {
  assertIsRawHtml(<div>Test</div>, "<div>Test</div>");
});

html("single number child", () => {
  assertIsRawHtml(<div>{123}</div>, "<div>123</div>");
});

html("single undefined child", () => {
  assertIsRawHtml(<div>{undefined}</div>, "<div></div>");
});

html("single null child", () => {
  assertIsRawHtml(<div>{null}</div>, "<div></div>");
});

html("single empty string child", () => {
  assertIsRawHtml(<div>{""}</div>, "<div></div>");
});

html("single raw HTML child", () => {
  assertIsRawHtml(<div>{new RawHtml("Hello")}</div>, "<div>Hello</div>");
});

html("single array child", () => {
  assertIsRawHtml(<div>{[1, 2, 3]}</div>, "<div>123</div>");
});

html("multiple string children", () => {
  assertIsRawHtml(
    <div>
      {"one"} {"two"}
    </div>,
    "<div>one two</div>"
  );
});

html("multiple children of varying types", () => {
  assertIsRawHtml(
    <div>
      {"one"}
      {undefined} {2}
    </div>,
    "<div>one 2</div>"
  );
});

html("textual children are escaped", () => {
  assertIsRawHtml(
    <div>&quot;&lt;&amp;&gt;&quot;{"'<&>'"}""</div>,
    '<div>"&lt;&amp;&gt;"\'&lt;&amp;&gt;\'""</div>'
  );
});

html("raw HTML is not escaped", () => {
  assertIsRawHtml(
    <div>{new RawHtml("<span>Ampersand: &amp;</span>")}</div>,
    "<div><span>Ampersand: &amp;</span></div>"
  );
});

html.run();
