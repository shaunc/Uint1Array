"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

{
  var TYPED_ARRAYS = new Set(["Uint1Array", "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "UInt32Array", "Float32Array", "Float64Array"]);
  var INTERNAL_FORMAT = Uint8Array;
  var $ = Symbol("[[Uint1ArrayInternal]]");

  // Uint1Array internals : toArray, getBit, setBit

  var Uint1ArrayPrivates = function () {
    function Uint1ArrayPrivates(publics) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref$length = _ref.length,
          length = _ref$length === undefined ? null : _ref$length,
          _ref$buffer = _ref.buffer,
          buffer = _ref$buffer === undefined ? null : _ref$buffer,
          _ref$byteOffset = _ref.byteOffset,
          byteOffset = _ref$byteOffset === undefined ? 0 : _ref$byteOffset,
          _ref$byteLength = _ref.byteLength,
          byteLength = _ref$byteLength === undefined ? null : _ref$byteLength;

      _classCallCheck(this, Uint1ArrayPrivates);

      var internal = void 0;

      if (!!buffer) {
        length = (byteLength || buffer.byteLength) * 8;
      } else if (!length) {
        length = 0;
      }

      var wordBytes = INTERNAL_FORMAT.BYTES_PER_ELEMENT;
      var wordSize = wordBytes * 8;
      var wordSizeMask = wordSize - 1;
      var wordSizeShift = msb_index(wordSize);
      var wordCount = Math.max(1, length + wordSizeMask >> wordSizeShift);
      if (!!buffer) {
        internal = new INTERNAL_FORMAT(buffer, byteOffset, wordCount);
      } else {
        buffer = new ArrayBuffer(wordBytes * wordCount);
        internal = new INTERNAL_FORMAT(buffer);
      }

      Object.assign(this, {
        buffer: buffer,
        byteOffset: byteOffset,
        length: length,
        wordSize: wordSize,
        wordCount: wordCount,
        wordSizeMask: wordSizeMask,
        wordSizeShift: wordSizeShift,
        internal: internal
      });
    }

    _createClass(Uint1ArrayPrivates, [{
      key: "toArray",
      value: function toArray() {
        var array = new Uint8Array(this.length);
        for (var j = 0; j < this.wordCount; j++) {
          var word = this.internal[j];
          for (var i = j * this.wordSize; i < (j + 1) * this.wordSize; i++) {
            array[i] = this.getBit(i, word);
          }
        }
        return array;
      }
    }, {
      key: "getBit",
      value: function getBit(i, word) {
        if (i >= this.length) {
          return;
        }
        var word_offset = i & this.wordSizeMask;
        if (word == undefined) {
          var word_number = i >> this.wordSizeShift;
          word = this.internal[word_number];
        }
        var bit = word >> word_offset & 1;
        return bit;
      }
    }, {
      key: "setBit",
      value: function setBit(i, bit) {
        if (i >= this.length) {
          return;
        }
        var word_number = i >> this.wordSizeShift;
        var word_offset = i & this.wordSizeMask;
        var word = this.internal[word_number];
        var new_word = word;
        new_word |= bit << word_offset; // make it 1 if 1, no change if 0
        new_word &= ~((~bit & 1) << word_offset); // make it 0 if 0, no change if 1
        if (word !== new_word) {
          this.internal[word_number] = new_word;
        }
        return bit;
      }
    }]);

    return Uint1ArrayPrivates;
  }();

  var Uint1Array = function () {
    // Uint1Array constructor

    function Uint1Array(arg) {
      var byteOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var byteLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      _classCallCheck(this, Uint1Array);

      var argType = resolveTypeName(arg);

      var length = void 0,
          privates = void 0,
          temp = void 0;

      switch (argType) {
        case "Number":
          arg = ~~arg; // integer part only
          length = arg;
          privates = new Uint1ArrayPrivates(this, { length: length });
          break;
        case "ArrayBuffer":
          var buffer = arg;
          privates = new Uint1ArrayPrivates(this, {
            buffer: buffer, byteOffset: byteOffset, byteLength: byteLength });
          break;
        case "Undefined":
        case "Null":
        case "RegExp":
        case "Infinity":
          length = 0;
          privates = new Uint1ArrayPrivates(this, { length: length });
          break;
        case "Array":
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Int32Array":
        case "UInt32Array":
        case "Float32Array":
        case "Float64Array":
        case "Uint1Array":
        case "Object":
        default:
          temp = create_from_iterable(arg);
          privates = new Uint1ArrayPrivates(this, { length: temp.length });
          temp.forEach(function (val, i) {
            return privates.setBit(i, toBit(val));
          });
          break;
      }

      // for private access to internal properties

      Object.defineProperty(this, $, { get: function get() {
          return privates;
        } });

      // proxy for array-like bracket-accessor via index

      var accessorProxy = new BracketAccessorProxy(this);

      return accessorProxy;
    }

    // Static property slots on the constructor

    _createClass(Uint1Array, [{
      key: "copyWithin",


      // Method slots on the instance ( STANDARD as per the TypedArray Spec )

      value: function copyWithin(targetStart) {
        var sourceStart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var sourceEnd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.length;

        if (!Number.isInteger(targetStart)) {
          return this;
        }
        var temp = new Uint8Array(sourceEnd - sourceStart);
        for (var i = sourceStart; i < sourceEnd; i++) {
          temp[i - sourceStart] = this[i];
        }
        this.set(temp, targetStart);
        return this;
      }
    }, {
      key: "entries",
      value: function entries() {
        return this[$].toArray().entries();
      }
    }, {
      key: "every",
      value: function every() {
        var _$$toArray;

        return (_$$toArray = this[$].toArray()).every.apply(_$$toArray, arguments);
      }
    }, {
      key: "fill",
      value: function fill(value) {
        var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.length;

        for (var i = start; i < end; i++) {
          this[i] = value;
        }
        return this;
      }
    }, {
      key: "filter",
      value: function filter() {
        var _$$toArray2;

        return new Uint1Array((_$$toArray2 = this[$].toArray()).filter.apply(_$$toArray2, arguments));
      }
    }, {
      key: "find",
      value: function find() {
        var _$$toArray3;

        return (_$$toArray3 = this[$].toArray()).find.apply(_$$toArray3, arguments);
      }
    }, {
      key: "findIndex",
      value: function findIndex() {
        var _$$toArray4;

        return (_$$toArray4 = this[$].toArray()).findIndex.apply(_$$toArray4, arguments);
      }
    }, {
      key: "forEach",
      value: function forEach() {
        var _$$toArray5;

        (_$$toArray5 = this[$].toArray()).forEach.apply(_$$toArray5, arguments);
      }
    }, {
      key: "includes",
      value: function includes() {
        var _$$toArray6;

        return (_$$toArray6 = this[$].toArray()).includes.apply(_$$toArray6, arguments);
      }
    }, {
      key: "indexOf",
      value: function indexOf() {
        var _$$toArray7;

        return (_$$toArray7 = this[$].toArray()).indexOf.apply(_$$toArray7, arguments);
      }
    }, {
      key: "join",
      value: function join() {
        var _$$toArray8;

        return (_$$toArray8 = this[$].toArray()).join.apply(_$$toArray8, arguments);
      }
    }, {
      key: "keys",
      value: function keys() {
        var _$$toArray9;

        return (_$$toArray9 = this[$].toArray()).keys.apply(_$$toArray9, arguments);
      }
    }, {
      key: "lastIndexOf",
      value: function lastIndexOf() {
        var _$$toArray10;

        return (_$$toArray10 = this[$].toArray()).lastIndexOf.apply(_$$toArray10, arguments);
      }
    }, {
      key: "map",
      value: function map() {
        var _$$toArray11;

        return new Uint1Array((_$$toArray11 = this[$].toArray()).map.apply(_$$toArray11, arguments));
      }
    }, {
      key: "reduce",
      value: function reduce() {
        var _$$toArray12;

        return (_$$toArray12 = this[$].toArray()).reduce.apply(_$$toArray12, arguments);
      }
    }, {
      key: "reduceRight",
      value: function reduceRight() {
        var _$$toArray13;

        return (_$$toArray13 = this[$].toArray()).reduceRight.apply(_$$toArray13, arguments);
      }
    }, {
      key: "reverse",
      value: function reverse() {
        var temp = this[$].toArray().reverse();
        this.set(temp);
        return this;
      }
    }, {
      key: "set",
      value: function set(arr) {
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        if (!Number.isInteger(offset)) {
          return;
        }

        var typeName = resolveTypeName(arr);

        // returning without doing nothing if the argument is
        // neither an array nor a typedarray seems to be the
        // implemented behaviour in the browser for <TypedArray>.set
        // and we do not differ here
        if (typeName !== "Array" && !TYPED_ARRAYS.has(typeName)) {
          return;
        }
        var last = Math.min(arr.length + offset, this.length);
        arr = arr.map(function (v) {
          return toBit(v);
        });
        for (var i = offset; i < last; i++) {
          this[i] = arr[i - offset];
        }
      }
    }, {
      key: "slice",
      value: function slice() {
        var _$$toArray14;

        return new Uint1Array((_$$toArray14 = this[$].toArray()).slice.apply(_$$toArray14, arguments));
      }
    }, {
      key: "sort",
      value: function sort() {
        var _$$toArray15;

        var sorting = (_$$toArray15 = this[$].toArray()).sort.apply(_$$toArray15, arguments);
        this.set(sorting);
        return this;
      }
    }, {
      key: "subarray",
      value: function subarray() {
        var _$$toArray16;

        return new Uint1Array((_$$toArray16 = this[$].toArray()).subarray.apply(_$$toArray16, arguments));
      }
    }, {
      key: "values",
      value: function values() {
        var _$$toArray17;

        return (_$$toArray17 = this[$].toArray()).values.apply(_$$toArray17, arguments);
      }
    }, {
      key: "toLocaleString",
      value: function toLocaleString() {
        return this.toString().toLocaleString();
      }
    }, {
      key: "toString",
      value: function toString() {
        return "Uint1Array [ " + this[$].toArray().join(', ') + " ]";
      }
    }, {
      key: Symbol.iterator,
      value: function value() {
        return this[$].toArray()[Symbol.iterator]();
      }

      // Method slots on the instances ( NON STANDARD )

      // This behaviour is chosen ( to return an Array for JSON stringification )
      // because I decided that the behaviour of TypedArrays to return an object
      // with numeric properties such as {0: 0, 1:0, 2:1} didn't work and was crap.

    }, {
      key: "toJSON",
      value: function toJSON() {
        return Array.from(this);
      }
    }, {
      key: "buffer",


      // Property slots on the instances

      get: function get() {
        return this[$].buffer;
      }
    }, {
      key: "byteLength",
      get: function get() {
        return this.length + 7 >> 3;
      }
    }, {
      key: "byteOffset",
      get: function get() {
        return this[$].byteOffset;
      }
    }, {
      key: "length",
      get: function get() {
        return this[$].length;
      }
    }], [{
      key: "from",


      // Static method slots on the constructor

      value: function from(iterable) {
        var temp = create_from_iterable(iterable);
        return new Uint1Array(temp);
      }
    }, {
      key: "of",
      value: function of() {
        for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
          items[_key] = arguments[_key];
        }

        return Uint1Array.from(items);
      }
    }, {
      key: "BYTES_PER_ELEMENT",
      get: function get() {
        return 0.125;
      }
    }, {
      key: "name",
      get: function get() {
        return "Uint1Array";
      }
    }, {
      key: "length",
      get: function get() {
        return 0;
      }
    }, {
      key: Symbol.species,
      get: function get() {
        return this;
      }
    }]);

    return Uint1Array;
  }();

  // array bracket-accessor proxy

  function BracketAccessorProxy(typed_array_api) {
    var privates = typed_array_api[$];
    var array_accessor_handler = {
      get: function get(_, slot, surface) {
        var i = typeof slot == "string" ? parseInt(slot) : slot;
        if (Number.isInteger(i)) {
          return privates.getBit(i);
        } else {
          return Reflect.get(typed_array_api, slot);
        }
      },
      set: function set(_, slot, value, surface) {
        var i = typeof slot == "string" ? parseInt(slot) : slot;
        if (Number.isInteger(i)) {
          privates.setBit(i, toBit(value));
          return true;
        } else {
          return Reflect.set(typed_array_api, slot, value);
        }
      }
    };
    return new Proxy(typed_array_api, array_accessor_handler);
  }

  // helpers

  var typeNameMatcher = /\[object (\w+)]/;

  function create_from_iterable(iterable) {
    var temp = [];
    var length = 0;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = iterable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;

        var bit = toBit(item);
        temp.push(bit);
        length++;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return temp;
  }

  function format(u1) {
    var connector = ', ';
    if (u1.length > 10) {
      connector = ',\n\t';
    }
    return "Uint1Array [ " + u1[$].toArray().join(connector) + " ]";
  }

  function msb_index(number) {
    var i = 0;
    while (number >>= 1) {
      i++;
    }
    return i;
  }

  function toBit(thing) {
    return !!thing ? 1 : 0;
  }

  function resolveTypeName(thing) {
    var cname = thing.constructor ? thing.constructor.name : null;
    var tname = typeNameMatcher.exec(Object.prototype.toString.call(thing))[1];
    if (tname !== cname && !!cname) return cname;
    return tname;
  }

  // Node or browser, either is fine

  try {
    module.exports = Uint1Array;
  } catch (e) {
    Object.assign(self, { Uint1Array: Uint1Array });
  }
}