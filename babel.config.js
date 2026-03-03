const presetTypescriptModule = require('@babel/preset-typescript');
const transformModulesCommonjsModule = require('@babel/plugin-transform-modules-commonjs');
const presetTypescript = presetTypescriptModule.default || presetTypescriptModule;
const transformModulesCommonjs =
  transformModulesCommonjsModule.default || transformModulesCommonjsModule;

module.exports = (api) => ({
  presets: [presetTypescript],
  // The idiom for transpiling import/export syntax for use under jest without interfering with
  // rollup's module bundling process. The test will yield true under jest, and false under rollup.
  plugins: api.env('test') ? [transformModulesCommonjs] : [],
});
