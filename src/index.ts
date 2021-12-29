declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
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

export class RawHtml {
  constructor(public html: string) {}

  toString(): string {
    return this.html;
  }
}

function toRawHtml(element: unknown): RawHtml {
  if (element === undefined || element === null) {
    return new RawHtml("");
  } else if (element instanceof RawHtml) {
    return element;
  } else if (Array.isArray(element)) {
    return new RawHtml(element.map((e) => toRawHtml(e).html).join(""));
  } else {
    return new RawHtml(escapeHtml(String(element)));
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(text: string): string {
  return escapeHtml(text).replace(/'/g, "&#39;").replace(/"/g, "&quot;");
}

export type Component<P extends Record<string, unknown> = {}> = (
  props: P
) => RawHtml;

function toAttributes(props: Record<string, unknown>): string {
  return Object.entries(props)
    .map(([name, value]) => ` ${name}="${escapeAttribute(String(value))}"`)
    .join("");
}

export const Fragment: Component<{ children?: unknown }> = ({ children }) =>
  toRawHtml(children);

// https://html.spec.whatwg.org/multipage/syntax.html#void-elements
const voidElements = new Set<string>([
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

export function h<P extends Record<string, unknown>>(
  type: string | Component<P>,
  props: Omit<P, "children">,
  ...children: unknown[]
): RawHtml {
  if (typeof type !== "string") {
    return type({ ...props, children } as unknown as P);
  } else if (voidElements.has(type)) {
    return new RawHtml(`<${type}${toAttributes(props)}/>`);
  } else {
    return new RawHtml(
      `<${type}${toAttributes(props)}>${toRawHtml(children).html}</${type}>`
    );
  }
}
