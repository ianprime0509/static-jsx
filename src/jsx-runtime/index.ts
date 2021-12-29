import { Component, RawHtml, h } from "../index.js";

export { Fragment } from "../index.js";

export function jsx<P extends {}>(
  type: string | Component<P>,
  props: P & { children?: unknown }
): RawHtml {
  const { children, ...rest } = props;
  const childrenArray: unknown[] = Array.isArray(children)
    ? children
    : [children];
  return h(type, rest, ...childrenArray);
}

export { jsx as jsxs, jsx as jsxDev };
