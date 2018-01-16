"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

{
  var Uint1Array = require('./index.js');
  var TESTS = [['sort', '0001111111'], ['reverse', '0111111010'], ['map', '1111111111', function (x) {
    return x + 1;
  }], ['map', '1010000001', function (x) {
    return x ^ 1;
  }]];

  test();

  function test() {
    test_display();
    test_methods();
    test_bitfield();
    test_readme_1();
    test_readme_2();
    test_readme_3();
  }

  function test_display() {
    var bits = new Uint1Array(128);
    console.log("Bits", bits);
  }

  function test_methods() {
    var source = [0, 1, 0, 1, 1, 1, 1, 1, 1, 0];
    var score = 0;
    TESTS.forEach(function (_ref) {
      var _ref2 = _toArray(_ref),
          method = _ref2[0],
          expected = _ref2[1],
          args = _ref2.slice(2);

      var subject = new Uint1Array(Array.from(source));
      var result = exec.apply(undefined, [subject, method].concat(_toConsumableArray(args)));
      var score_1 = result == expected ? "PASS" : "FAIL";
      if (score_1 == "PASS") score += 1;
      console.log('Test ' + method + ' expected ' + expected + ', got ' + result + ', OK? ' + score_1);
    });
    console.log('Tests: ' + TESTS.length + ', PASSED: ' + score + ', FAILED : ' + (TESTS.length - score));
  }

  function test_bitfield() {
    var source = new Uint32Array([2378462, 324578634, 3458743]);
    var bits = new Uint1Array(source);
    console.log(source, bits + '');
    var bitfield = new Uint1Array(source.buffer);
    console.log(source, bitfield + '');
  }

  function test_readme_1() {
    var coerced_bits = new Uint1Array([1, 2, 3, 0]);
    console.log('' + coerced_bits); // Uint1Array [ 1, 1, 1, 0 ]
  }

  function test_readme_2() {
    var message = "JAVASCRIPT ROCKS";
    var byte_values = message.split('').map(function (c) {
      return c.charCodeAt(0);
    });

    var bytes = new Uint8Array(byte_values);
    var bit_field = new Uint1Array(bytes.buffer);

    console.log('' + bit_field); // Uint1Array [ ]
  }

  function test_readme_3() {
    // From a length
    var uint8 = new Uint1Array(2);
    uint8[0] = 42;
    console.log(uint8[0]); // 1
    console.log(uint8.length); // 2
    console.log(Uint1Array.BYTES_PER_ELEMENT); // 0.125

    // From an array
    var arr = new Uint1Array([21, 31]);
    console.log(arr[1]); // 1

    // From another TypedArray's buffer
    var x = new Uint8Array([21, 31]);
    var y = new Uint1Array(x.buffer);
    console.log("" + y); //

    // From an ArrayBuffer
    var buffer = new ArrayBuffer(8);
    var z = new Uint1Array(buffer, 1, 4);

    // From an iterable
    var iterable = /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.delegateYield([1, 0, 1], 't0', 1);

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })();
    var uint8 = new Uint1Array(iterable);
    console.log("" + uint8);
    // Uint1Array[1, 0, 1]
  }

  function exec(target, method) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var result = target[method].apply(target, args);
    return result.join('');
  }
}