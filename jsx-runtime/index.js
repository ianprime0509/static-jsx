import { h } from "../index.js";

export { Fragment } from "../index.js";

/**
 * Renders a component to raw HTML (automatic JSX runtime).
 *
 * @template {{}} P
 * @param {string | import("../index.js").Component<P>} type the type of the
 * component to render
 * @param {P & { children?: unknown }} props the component's props, including
 * children
 * @returns {import("../index.js").RawHtml} the rendered component as raw HTML
 */
export function jsx(type, props) {
  const { children, ...rest } = props;
  const childrenArray = Array.isArray(children) ? children : [children];
  return h(type, rest, ...childrenArray);
}

export { jsx as jsxs, jsx as jsxDev };
