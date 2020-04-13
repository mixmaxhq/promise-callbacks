import babel from 'rollup-plugin-babel';
import pkg from './package.json';
import { version as runtimeVersion } from '@babel/runtime/package.json';

const deps = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]);

export default {
  external: (id) => deps.has(id) || id.startsWith('@babel/runtime/'),
  input: './src/index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs',
  },
  plugins: [
    babel({
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            // Explicitly specifying this version lets the plugin be more liberal with the helpers
            // that it imports instead of inlining.
            version: runtimeVersion,
          },
        ],
      ],
      presets: [
        [
          '@babel/preset-env',
          {
            exclude: ['@babel/plugin-transform-classes', '@babel/plugin-transform-block-scoping'],
            targets: { node: '4.0' },
          },
        ],
      ],
      runtimeHelpers: true,
    }),
  ],
};
