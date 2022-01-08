/**
 * @template P
 * @typedef {import("../index.js").Component<P>} Component
 */

import { suite } from "uvu";

const components = suite("components");

import { assertIsRawHtml } from "./helpers.js";

components("component with props", () => {
  // No idea why ESLint thinks this is unused...
  // eslint-disable-next-line no-unused-vars
  /** @type Component<{ text: string }> */ const Title = ({ text }) => (
    <h1>{text}</h1>
  );

  assertIsRawHtml(<Title text="Hello, world!" />, "<h1>Hello, world!</h1>");
});

components("component with children", () => {
  // eslint-disable-next-line no-unused-vars
  /** @type Component<{ children?: unknown }> */ const Title = ({
    children,
  }) => <h1>{children}</h1>;

  assertIsRawHtml(<Title>Hello, world!</Title>, "<h1>Hello, world!</h1>");
});

components("component with props and children", () => {
  // eslint-disable-next-line no-unused-vars
  /** @type Component<{ level: number, children?: unknown }> */ const Header =
    ({ level, children }) => {
      switch (level) {
        case 1:
          return <h1>{children}</h1>;
        case 2:
          return <h2>{children}</h2>;
        default:
          return <h3>{children}</h3>;
      }
    };

  assertIsRawHtml(
    <div>
      <Header level={1}>H1</Header>
      <Header level={2}>H2</Header>
      <Header level={3}>H3</Header>
    </div>,
    "<div><h1>H1</h1><h2>H2</h2><h3>H3</h3></div>"
  );
});

components("nested components", () => {
  // eslint-disable-next-line no-unused-vars
  /** @type Component<{ children?: unknown }> */ const MyDiv = ({
    children,
  }) => <div class="custom">{children}</div>;

  assertIsRawHtml(
    <MyDiv>
      <h1>Header</h1>
      <MyDiv>
        Some stuff: <span>stuff</span>
      </MyDiv>
    </MyDiv>,
    '<div class="custom"><h1>Header</h1><div class="custom">Some stuff: <span>stuff</span></div></div>'
  );
});

components("top-level fragment", () => {
  assertIsRawHtml(
    <>
      <h1>Title</h1>
      <p>Some text</p>
    </>,
    "<h1>Title</h1><p>Some text</p>"
  );
});

components("nested fragments", () => {
  assertIsRawHtml(
    <>
      <h1>Title</h1>
      <>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
      </>
    </>,
    "<h1>Title</h1><p>Paragraph 1</p><p>Paragraph 2</p>"
  );
});

components.run();
