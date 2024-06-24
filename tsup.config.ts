import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    name: 'ink-mouse',

    shims: true,

    entry: ['src/ink-mouse.ts'],

    external: ['react', 'ink'],

    minify: !options.watch,
    splitting: false,
    sourcemap: true,
    clean: true,
  };
});
