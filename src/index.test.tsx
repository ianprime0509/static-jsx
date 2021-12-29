// eslint-env jest
import "./test-helpers.js";

import { type Component, RawHtml } from "./index.js";

describe("basic HTML", () => {
  test("single HTML element", () => {
    expect(<div>Hello, world!</div>).toBeRawHtml("<div>Hello, world!</div>");
  });

  test("nested HTML elements", () => {
    expect(
      <main>
        <h1>Title</h1>
        <section>
          <h2>Section</h2>
          <p>Paragraph</p>
        </section>
      </main>
    ).toBeRawHtml(
      "<main><h1>Title</h1><section><h2>Section</h2><p>Paragraph</p></section></main>"
    );
  });

  test("void HTML elements", () => {
    expect(<br />).toBeRawHtml("<br/>");
    expect(<br></br>).toBeRawHtml("<br/>");
    expect(
      <link rel="stylesheet" href="https://example.com/index.css" />
    ).toBeRawHtml(
      '<link rel="stylesheet" href="https://example.com/index.css"/>'
    );
  });

  test("attribute values are escaped", () => {
    expect(<div data-strange="&lt;(){}&amp;'&quot;&gt;"></div>).toBeRawHtml(
      '<div data-strange="&lt;(){}&amp;&#39;&quot;&gt;"></div>'
    );
  });

  describe("children", () => {
    test("single string child", () => {
      expect(<div>Test</div>).toBeRawHtml("<div>Test</div>");
    });

    test("single number child", () => {
      expect(<div>{123}</div>).toBeRawHtml("<div>123</div>");
    });

    test("single undefined child", () => {
      expect(<div>{undefined}</div>).toBeRawHtml("<div></div>");
    });

    test("single null child", () => {
      expect(<div>{null}</div>).toBeRawHtml("<div></div>");
    });

    test("single empty string child", () => {
      expect(<div>{""}</div>).toBeRawHtml("<div></div>");
    });

    test("single raw HTML child", () => {
      expect(<div>{new RawHtml("Hello")}</div>).toBeRawHtml("<div>Hello</div>");
    });

    test("single array child", () => {
      expect(<div>{[1, 2, 3]}</div>).toBeRawHtml("<div>123</div>");
    });

    test("multiple string children", () => {
      expect(
        <div>
          {"one"} {"two"}
        </div>
      ).toBeRawHtml("<div>one two</div>");
    });

    test("multiple children of varying types", () => {
      expect(
        <div>
          {"one"}
          {undefined} {2}
        </div>
      ).toBeRawHtml("<div>one 2</div>");
    });

    test("textual children are escaped", () => {
      expect(<div>&quot;&lt;&amp;&gt;&quot;{"'<&>'"}""</div>).toBeRawHtml(
        '<div>"&lt;&amp;&gt;"\'&lt;&amp;&gt;\'""</div>'
      );
    });

    test("raw HTML is not escaped", () => {
      expect(
        <div>{new RawHtml("<span>Ampersand: &amp;</span>")}</div>
      ).toBeRawHtml("<div><span>Ampersand: &amp;</span></div>");
    });
  });
});

describe("components", () => {
  test("component with props", () => {
    const Title: Component<{ text: string }> = ({ text }) => <h1>{text}</h1>;

    expect(<Title text="Hello, world!" />).toBeRawHtml(
      "<h1>Hello, world!</h1>"
    );
  });

  test("component with children", () => {
    const Title: Component<{ children?: unknown }> = ({ children }) => (
      <h1>{children}</h1>
    );

    expect(<Title>Hello, world!</Title>).toBeRawHtml("<h1>Hello, world!</h1>");
  });

  test("component with props and children", () => {
    const Header: Component<{ level: number; children?: unknown }> = ({
      level,
      children,
    }) => {
      switch (level) {
        case 1:
          return <h1>{children}</h1>;
        case 2:
          return <h2>{children}</h2>;
        default:
          return <h3>{children}</h3>;
      }
    };

    expect(
      <div>
        <Header level={1}>H1</Header>
        <Header level={2}>H2</Header>
        <Header level={3}>H3</Header>
      </div>
    ).toBeRawHtml("<div><h1>H1</h1><h2>H2</h2><h3>H3</h3></div>");
  });

  test("nested components", () => {
    const MyDiv: Component<{ children?: unknown }> = ({ children }) => (
      <div class="custom">{children}</div>
    );

    expect(
      <MyDiv>
        <h1>Header</h1>
        <MyDiv>
          Some stuff: <span>stuff</span>
        </MyDiv>
      </MyDiv>
    ).toBeRawHtml(
      '<div class="custom"><h1>Header</h1><div class="custom">Some stuff: <span>stuff</span></div></div>'
    );
  });

  test("top-level fragment", () => {
    expect(
      <>
        <h1>Title</h1>
        <p>Some text</p>
      </>
    ).toBeRawHtml("<h1>Title</h1><p>Some text</p>");
  });

  test("nested fragments", () => {
    expect(
      <>
        <h1>Title</h1>
        <>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </>
      </>
    ).toBeRawHtml("<h1>Title</h1><p>Paragraph 1</p><p>Paragraph 2</p>");
  });
});
