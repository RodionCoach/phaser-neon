import serve from "rollup-plugin-serve";
import copy from "rollup-plugin-copy";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import livereload from "rollup-plugin-livereload";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

export default {
  input: ["./src/index.ts"],

  output: {
    file: "./build/index.js",
    name: "planets",
    format: "es",
    sourcemap: !isProduction,
    intro: "var global = window;",
  },

  plugins: [
    typescript(),

    nodeResolve({
      extensions: [".js", ".ts"],
    }),

    commonjs({
      include: ["node_modules/eventemitter3/**", "node_modules/phaser/**", "node_modules/**"],
      exclude: ["node_modules/phaser/src/polyfills/requestAnimationFrame.js"],
      sourceMap: true,
      ignoreGlobal: true,
    }),

    copy({
      targets: [
        {
          src: "src/assets",
          dest: "build",
        },
        {
          src: "src/index.html",
          dest: "build",
        },
      ],
      copyOnce: true,
    }),

    !isProduction &&
      serve({
        open: true,
        contentBase: "build",
        host: "localhost",
        port: 10001,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }),

    !isProduction &&
      livereload({
        watch: path.resolve(__dirname, "build"),
        exts: ["html", "js"],
      }),

    isProduction && terser(),
  ],
};
