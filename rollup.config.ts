// See: https://rollupjs.org/introduction/

import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

const config = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js', // Output file
    format: 'es', // Output format (ES module)
    sourcemap: false, // Generate sourcemap
    esModule: true // Ensure ES module output
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false // Disable .d.ts file generation
    }),
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
    terser() // Minify output
  ]
}

export default config
