'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/**
  * @module test/tests
  */
var Uint1Array = require('../src/index.js');
var chai = require('chai');
var expect = chai.expect;

var TESTS = [['sort', '0001111111'], ['reverse', '0111111010'], ['map', '1111111111', function (x) {
  return x + 1;
}], ['map', '1010000001', function (x) {
  return x ^ 1;
}]];

describe('Uint1Array', function () {

  it('display', function () {
    var bits = new Uint1Array(128);
    expect(bits.toString()).to.equal('Uint1Array [ ' + bits.map(function (b) {
      return b + '';
    }).join(', ') + ' ]');
  });
  it('methods', function () {
    var source = [0, 1, 0, 1, 1, 1, 1, 1, 1, 0];
    var score = 0;
    TESTS.forEach(function (_ref) {
      var _ref2 = _toArray(_ref),
          method = _ref2[0],
          expected = _ref2[1],
          args = _ref2.slice(2);

      var subject = new Uint1Array(Array.from(source));
      var result = subject[method].apply(subject, _toConsumableArray(args)).join('');
      expect(result).to.equal(expected, 'test ' + method);
    });
  });
  it('bitfield', function () {
    var source = new Uint32Array([2378462, 324578634, 3458743]);
    var bits = new Uint1Array(source);
    expect([].concat(_toConsumableArray(bits))).to.eql([1, 1, 1]);
    var bitfield = new Uint1Array(source.buffer);
    expect([].concat(_toConsumableArray(bitfield)).map(function (b) {
      return '' + b;
    }).join('')).to.eql('011110110101001000100100000000000101001010110101000' + '110101100100011101101011000110010110000000000');
  });

  it('coerce ints', function () {
    var coerced_bits = new Uint1Array([1, 2, 3, 0]);
    expect([].concat(_toConsumableArray(coerced_bits))).to.eql([1, 1, 1, 0]);
  });
  it('coerce string', function () {
    var message = "JAVASCRIPT ROCKS";
    var byte_values = message.split('').map(function (c) {
      return c.charCodeAt(0);
    });

    var bytes = new Uint8Array(byte_values);
    var bitfield = new Uint1Array(bytes.buffer);
    expect(conc(bitfield)).to.equal('0101001010000010011010101000001011001010110000100100101010010010' + '0000101000101010000001000100101011110010110000101101001011001010');
  });
  it('from length', function () {
    // From a length
    var uint8 = new Uint1Array(2);
    uint8.setBit(0, 42);
    expect(uint8.getBit(0)).to.equal(1);
    expect(uint8.length).to.equal(2);
    expect(Uint1Array.BYTES_PER_ELEMENT).to.equal(0.125);
  });
  it('from array', function () {
    var arr = new Uint1Array([21, 31]);
    expect(arr.getBit(1)).to.equal(1);
  });
  it('from another typed array\'s buffer', function () {
    // From another TypedArray's buffer
    var x = new Uint8Array([21, 31]);
    var y = new Uint1Array(x.buffer);
    expect(conc(y)).to.eql('1010100011111000');
  });
  it('from array buffer', function () {
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
    expect(conc(uint8)).to.eql('101');
  });
});
function conc(a) {
  return a.map(function (a) {
    return '' + a;
  }).join('');
}