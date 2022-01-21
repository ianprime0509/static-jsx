/* eslint-env node */
// Based on https://nodejs.org/api/esm.html#transpiler-loader

import { cwd } from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

import { transformAsync } from "@babel/core";

const baseURL = pathToFileURL(`${cwd()}/`).href;
const extensionsRegex = /\.jsx$/;

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

export async function load(url, context, defaultLoad) {
  if (extensionsRegex.test(url)) {
    const { source } = await defaultLoad(url, { format: "module" });
    const transformed = await transformAsync(source, {
      babelrc: false,
      filename: fileURLToPath(url),
      presets: [
        [
          "@babel/preset-react",
          { runtime: "automatic", importSource: "static-jsx" },
        ],
      ],
    });
    return {
      format: "module",
      source: transformed.code,
    };
  }

  return defaultLoad(url, context, defaultLoad);
}
