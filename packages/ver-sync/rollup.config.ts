import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import * as fs from 'node:fs';
import { join, resolve } from 'node:path';
import { dts } from 'rollup-plugin-dts';
import swc from 'rollup-plugin-swc3';

const outputDir = resolve(process.cwd(), './dist');
const srcDir = resolve(process.cwd(), 'src');

const rmdir = (dir: string) =>
  dir &&
  fs.existsSync(dir) &&
  fs.statSync(dir).isDirectory() &&
  fs.rmSync(dir, { recursive: true });

const external = ['ansi-colors', 'filesize', 'glob', 'semver'];

const fmtCurry = (dir: string, jsExt: string, dtsExt: string) => ({
  js: (path: string) => join(outputDir, dir, `${path}${jsExt}`),
  dts: (path: string) => join(outputDir, dir, `${path}${dtsExt}`),
});

const esm = fmtCurry('esm', '.js', '.d.ts');
const cjs = fmtCurry('cjs', '.cjs', '.d.cts');

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: cjs.js('index'),
        format: 'cjs',
      },
      {
        file: esm.js('index'),
        format: 'es',
        exports: 'named',
      },
    ],
    plugins: [
      rmdir(outputDir),
      swc({
        include: /\.[mc]?[jt]sx?$/,
        exclude: /node_modules/,
        tsconfig: 'tsconfig.json',
        jsc: {
          target: 'es2021',
        },
      }),
      nodeResolve({}),
      commonjs({
        extensions: ['.node', '.cjs', '.js', '.mjs'],
      }),
    ],
    external,
  },
  {
    input: 'src/index.ts',
    output: {
      file: cjs.dts('index'),
      format: 'es',
    },
    plugins: [dts()],
  },
  {
    input: 'src/index.ts',
    output: {
      file: esm.dts('index'),
      format: 'es',
    },
    plugins: [dts()],
  },
];
