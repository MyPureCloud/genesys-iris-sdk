import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    dts: { tsgo: true },
    fixedExtension: true,
    exports: {
      customExports(exports) {
        exports['.'] = {
          types: './dist/index.d.mts',
          import: './dist/index.mjs',
        };
        exports['./iris-awp.js'] = './dist/iris-awp.js';
        exports['./iris-sdk-wasm.wasm'] = './dist/iris-sdk-wasm.wasm';
        return exports;
      },
    },
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
