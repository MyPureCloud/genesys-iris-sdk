import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    dts: { tsgo: true },
    exports: true,
    fixedExtension: true,
    copy: [
      {
        from: 'src/iris-awp/iris-sdk-wasm/iris-sdk-wasm.wasm',
        to: 'dist',
      },
    ],
  },
  {
    entry: ['src/iris-awp/iris-awp.js'],
    outDir: 'dist',
    format: 'esm',
    dts: false,
    platform: 'browser',
    clean: false,
  },
]);
