/**
  * @module Brocfile
  */
const babel = require('broccoli-babel-transpiler')
const funnel = require('broccoli-funnel')
const mergeTrees = require('broccoli-merge-trees')
const watchify = require('broccoli-watchify');

var src = funnel('src')
var test = funnel('test')
var code = mergeTrees([src, test])

// grab the source and transpile in 1 step
const codeOut = babel(code, {
  presets: [
    ['env', {
      'targets': {
        'browsers': ["> 2%", "ie 11"]
      }
    }]
  ],
  browserPolyfill: true
});
const testOut = watchify(codeOut, {
  browserify: {
    entries: [require.resolve('babel-polyfill'), 'tests.js'],
    debug: true
  },
  outputFile: 'browser-tests.js',
  // init: (b) => {
  //   b.add()
  // }
})

module.exports = mergeTrees([codeOut, testOut]);
