var babel = require('broccoli-babel-transpiler');

// grab the source and transpile in 1 step
fruits = babel('src', {
  presets: [
    ['env', {
      'targets': {
        'browsers': ["> 2%", "ie 11"]
      }
    }]
  ]
}); // src/*.js

module.exports = fruits;
