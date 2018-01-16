/**
  * @module Brocfile
  */
const babel = require('broccoli-babel-transpiler')
const funnel = require('broccoli-funnel')
const mergeTrees = require('broccoli-merge-trees')
const watchify = require('broccoli-watchify');

var src = funnel('.', {srcDir: 'src', destDir: 'src'})
var test = funnel('.', {srcDir: 'test', destDir: 'test'})
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

module.exports = codeOut
