/* eslint-env node */
// Based on https://nodejs.org/api/esm.html#transpiler-loader

import { cwd } from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

import { transformAsync } from "@babel/core";

const baseURL = pathToFileURL(`${cwd()}/`).href;
const extensionsRegex = /\.jsx$/;

/**
 * @typedef {"builtin" | "commonjs" | "json" | "module" | "wasm"} ModuleFormat
 */

/**
 * @typedef {{
 *   conditions: string[],
 *   importAssertions?: {},
 *   parentURL?: string,
 * }} ResolveContext
 * @typedef {{
 *   format?: ModuleFormat | null,
 *   url: string,
 * }} ResolvedModule
 * @typedef {(
 *   specifier: string,
 *   context: ResolveContext,
 *   defaultResolve: ResolveFunction
 * ) => Promise<ResolvedModule>} ResolveFunction
 * @type {ResolveFunction}
 */
export async function resolve(specifier, context, defaultResolve) {
  const { parentURL = baseURL } = context;

  if (specifier === "static-jsx/jsx-runtime") {
    return {
      url: new URL("index.js", baseURL).href,
    };
  }

  if (extensionsRegex.test(specifier)) {
    return {
      url: new URL(specifier, parentURL).href,
    };
  }

  return defaultResolve(specifier, context, defaultResolve);
}

/**
 * @typedef {{
 *   format?: string | null,
 *   importAssertions?: {},
 * }} LoadContext
 * @typedef {{
 *   format: ModuleFormat,
 *   source: string | ArrayBuffer | Uint8Array,
 * }} LoadedModule
 * @typedef {(
 *   url: string,
 *   context: LoadContext,
 *   defaultLoad: LoadFunction,
 * ) => Promise<LoadedModule>} LoadFunction
 * @type {LoadFunction}
 */
export async function load(url, context, defaultLoad) {
  if (extensionsRegex.test(url)) {
    const { source: rawSource } = await defaultLoad(
      url,
      { format: "module" },
      defaultLoad
    );
    const rawSourceString =
      typeof rawSource === "string"
        ? rawSource
        : new TextDecoder().decode(rawSource);
    const transformed = await transformAsync(rawSourceString, {
      babelrc: false,
      filename: fileURLToPath(url),
      presets: [
        [
          "@babel/preset-react",
          { runtime: "automatic", importSource: "static-jsx" },
        ],
      ],
    });
    const code = transformed?.code;
    if (code === undefined || code === null) {
      throw new Error(`Failed to transform code from ${url}`);
    }
    return {
      format: "module",
      source: code,
    };
  }

  return defaultLoad(url, context, defaultLoad);
}
