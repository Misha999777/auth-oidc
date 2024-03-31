const pkg = require('./package.json')
const copy = require('rollup-plugin-copy')

module.exports = {
  input: './src/index.js',
  output: [{
    file: pkg.exports,
    format: 'es',
    exports: 'named'
  }],
  plugins: [
    copy({
      targets: [{
        src: './src/index.d.ts',
        dest: './dist'
      }]
    })
  ]
}
