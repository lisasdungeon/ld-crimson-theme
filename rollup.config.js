import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/ld-crimson-theme.js',
  output: {
    file: 'dist/ld-crimson-theme.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    terser()
  ]
};