# static-jsx

static-jsx is a simple, dependency-free JSX runtime which renders JSX directly
to raw HTML strings. It is intended to be used to power a static HTML template
engine, closer to something like [Handlebars](https://handlebarsjs.com/),
[Nunjucks](https://mozilla.github.io/nunjucks/), etc. than
[React](https://reactjs.org/); it is not a replacement for most use-cases of
React or similar libraries such as [Preact](https://preactjs.com/) and
[Nano JSX](https://nanojsx.github.io/).

## Usage

The preface to this section gives a general overview of the API surface and
supported functionality. For more targeted guidance for particular frameworks,
see the subsections below.

This library supports both the "classic" and "automatic" JSX transforms:

- Using the "classic" transform, you must manually import the `h` and `Fragment`
  members of the main `static-jsx` module and instruct your JSX transpiler to
  use these names for the corresponding functionality. It is usually possible to
  do this using the following pattern:

  ```jsx
  /** @jsx h */
  /** @jsxFrag Fragment */
  import { Fragment, h } from "static-jsx";

  // Your JSX code here
  ```

- Using the "automatic" transform, you don't need to import anything manually;
  the appropriate runtime imports will be added automatically by your
  transpiler. You still must instruct your transpiler to use the static-jsx
  runtime library, however, which is available as `static-jsx/jsx-runtime`. It
  is usually possible to do this using the following pattern:

  ```jsx
  /** @jsxImportSource static-jsx */

  // Your JSX code here
  ```

JSX elements may be normal HTML elements (including
[custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)),
which are spelled with a lowercase first letter (e.g. `div`, `h1`, etc.), or
components, which are spelled with an uppercase first letter (e.g. `Fragment`,
`SiteHeader`, etc.). Only function components are supported: the component may
accept a single props object, containing the attributes passed to the component
(including the special `children` prop, containing the component's children, if
any), and must return an instance of `RawHtml` (which can be satisfied by
returning any JSX expression).

Here is an example of how components can be used to abstract common page
elements:

```jsx
const Navigation = ({ navItems }) => (
  <nav>
    <ul>
      {navItems.map((item) => (
        <li>
          <a href={item.url}>{item.title}</a>
        </li>
      ))}
    </ul>
  </nav>
);

const PageContent = ({ children, title }) => (
  <main>
    <heading>
      <h1>{title}</h1>
    </heading>

    {children}
  </main>
);

const Footer = () => <footer>Copyright 2021 Ian Johnson</footer>;

const Page = ({ children, navItems, title }) => (
  <>
    <Navigation navItems={navItems} />
    <PageContent title={title}>{children}</PageContent>
    <Footer />
  </>
);
```

The return type of every JSX expression is an instance of `RawHtml`. `RawHtml`
is simply a wrapper around a string containing raw HTML data, to distinguish it
from normal strings, which are assumed to require escaping before interpolating
into HTML. The raw HTML can be obtained using the `html` property; in the
opposite direction, instances of `RawHtml` can be constructed directly from
strings to mark them as safe for direct insertion into HTML.

Here is a simple example to illustrate how JSX and `RawHtml` work:

```jsx
const body = "<p>Paragraph</p>";

const element1 = <div>{body}</div>;
// element1 is an instance of RawHtml
console.log(element1.html);
// Prints <div>&lt;p&gt;Paragraph&lt;/p&gt;</div>

const element2 = <div>{new RawHtml(body)}</div>;
// element2 is also an instance of RawHtml
console.log(element2.html);
// Prints <div><p>Paragraph</p></div>
```

When using static-jsx to produce a complete HTML page, `RawHtml` is also useful
for adding the doctype, which is not supported by JSX natively:

```jsx
import { RawHtml } from "static-jsx";

const page = (
  <>
    {new RawHtml("<!DOCTYPE html>")}
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Example page</title>
      </head>
      <body>Hello, world!</body>
    </html>
  </>
);
```

### Node.js

You can install static-jsx using any package manager using the NPM registry,
such as NPM itself:

```shell
npm install static-jsx
```

From here, you will need to set up your transpiler. The automatic JSX transform
is recommended, since it avoids manual imports, but either the classic or
automatic JSX transform may be used.

#### Babel

You can use
[`@babel/preset-react`](https://babeljs.io/docs/en/babel-preset-react). Sample
`.babelrc.json`:

```json
{
  "presets": [
    [
      "@babel/preset-react",
      {
        "runtime": "automatic",
        "importSource": "static-jsx"
      }
    ]
  ]
}
```

#### TypeScript

You can configure JSX in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "static-jsx"
  }
}
```

### Deno

static-jsx supports TypeScript natively, allowing it to work well in Deno
projects. There are several ways to configure JSX in Deno: for more details,
refer to the [manual section on JSX](https://deno.land/manual/jsx_dom/jsx). A
Deno-compatible CDN, such as [esm.sh](https://esm.sh), can be used to consume
the library.

One way is to configure the TypeScript compiler options in your configuration
file (e.g. `deno.json`):

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "https://esm.sh/static-jsx"
  }
}
```

Note that, at the time of writing (Deno version 1.17), you will need to provide
an additional command-line argument to `deno run` and similar commands:
`--config deno.json`.

Another way is to use the `jsxImportSource` pragma comment in each JSX file in
your project:

```jsx
/** @jsxImportSource https://esm.sh/static-jsx */

// Your JSX/TSX here
```

## License

This is free software, released under the
[MIT license](https://opensource.org/licenses/MIT).
