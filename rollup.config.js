import babel from 'rollup-plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import { version as runtimeVersion } from '@babel/runtime/package.json';

const deps = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]);

export default {
  external: (id) => deps.has(id) || id.startsWith('@babel/runtime/'),
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'cjs',
  },
  plugins: [
    nodeResolve({
      extensions: ['.js', '.ts'],
    }),
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
        '@babel/preset-typescript',
        [
          '@babel/preset-env',
          {
            exclude: ['@babel/plugin-transform-classes'],
            targets: { node: '4.0' },
          },
        ],
      ],
      extensions: ['.js', '.ts'],
      runtimeHelpers: true,
    }),
  ],
};
