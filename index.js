/**
 * @template {Record<string, unknown>} [P=Record<string, unknown>]
 * @typedef {(props: P) => RawHtml} Component
 */

/**
 * A wrapper around a string to indicate that it contains raw HTML, to be
 * treated literally (not escaped) when rendered.
 */
export class RawHtml {
  /**
   * The raw HTML as a string.
   *
   * @type {string}
   */
  html;

  /**
   * Constructs a new instance using the given raw HTML.
   *
   * @param {string} html raw HTML
   */
  constructor(html) {
    this.html = html;
  }

  toString() {
    return this.html;
  }
}

/** @type {Component<{ children?: unknown }>} */
export const Fragment = ({ children }) => render(children);

// https://html.spec.whatwg.org/multipage/syntax.html#void-elements
const voidElements = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

/**
 * Renders a component to raw HTML (classic JSX runtime).
 *
 * @template {Record<string, unknown>} P
 * @param {string | Component<P>} type the type of the component to render
 * @param {Omit<P, "children"> | null | undefined} props the component's props
 * @param {unknown[]} children the component's children
 * @returns {RawHtml} the rendered component as raw HTML
 */
export function h(type, props, ...children) {
  if (typeof type !== "string") {
    // @ts-expect-error not guaranteed to be assignable to P due to added children
    return type({ ...props, children });
  } else if (voidElements.has(type)) {
    return new RawHtml(`<${type}${toAttributes(props ?? {})}/>`);
  } else {
    return new RawHtml(
      `<${type}${toAttributes(props ?? {})}>${render(children).html}</${type}>`
    );
  }
}

/**
 * Renders a component to raw HTML (automatic JSX runtime).
 *
 * @template {{}} P
 * @param {string | Component<P>} type the type of the
 * component to render
 * @param {P & { children?: unknown }} props the component's props, including
 * children
 * @returns {RawHtml} the rendered component as raw HTML
 */
export function jsx(type, props) {
  const { children, ...rest } = props;
  const childrenArray = Array.isArray(children) ? children : [children];
  return h(type, rest, ...childrenArray);
}

export { jsx as jsxs, jsx as jsxDev };

/**
 * Renders some value to raw HTML.
 *
 * The conversion rules are as follows:
 *
 * - `undefined` or `null` become empty HTML
 * - `RawHtml` instances are returned as-is
 * - arrays are converted recursively and then concatenated
 * - anything else is converted to a string and escaped
 *
 * @param {unknown} value the value to render to raw HTML
 * @returns {RawHtml} the rendered raw HTML
 */
function render(value) {
  if (value === undefined || value === null) {
    return new RawHtml("");
  } else if (value instanceof RawHtml) {
    return value;
  } else if (Array.isArray(value)) {
    return new RawHtml(value.map((e) => render(e).html).join(""));
  } else {
    return new RawHtml(escapeHtml(String(value)));
  }
}

/**
 * Escapes text by replacing characters (`&`, `<`, and `>`) which cannot be used
 * literally in HTML text.
 *
 * @param {string} text the text to escape
 * @returns the escaped text
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Escapes text by replacing characters (`&`, `<`, `>`, `'`, and `"`) which
 * cannot be used literally in HTML attribute values.
 *
 * @param {string} text the text to escape
 * @returns the escaped text
 */
function escapeAttribute(text) {
  return escapeHtml(text).replace(/'/g, "&#39;").replace(/"/g, "&quot;");
}

/**
 * Converts a props object into HTML attributes.
 *
 * @param {Record<string, unknown>} props the props to convert to attributes
 * @returns {string}
 */
function toAttributes(props) {
  return Object.entries(props)
    .map(([name, value]) => ` ${name}="${escapeAttribute(String(value))}"`)
    .join("");
}
