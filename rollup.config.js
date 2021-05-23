// @ts-checker
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "build/cjs/index.js",
      format: "cjs",
    },
    {
      file: "build/esm/index.js",
      format: "esm",
    },
  ],
  plugins: [
    //
    typescript({ lib: ["es2019", "dom"], target: "es2019", module: "ESNext" }),
    terser({
      compress: {},
      mangle: {},
      ecma: 2019,
      keep_classnames: false,
      keep_fnames: false,
      ie8: false,
      safari10: false,
      toplevel: false,
    }),
  ],
};
