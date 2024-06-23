import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    name: 'reactink-mouse',

    shims: true,

    entry: ['src/package_name/@/.ts'],

    minify: !options.watch,
    splitting: false,
    sourcemap: true,
    clean: true,
  };
});
