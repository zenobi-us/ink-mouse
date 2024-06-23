import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  return {
    name: '<PACKAGE NAME>',

    shims: true,

    entry: ['src/<EXPORT NAME>.ts'],

    minify: !options.watch,
    splitting: false,
    sourcemap: true,
    clean: true,
  };
});
