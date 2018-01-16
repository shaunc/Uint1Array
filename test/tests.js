/**
  * @module test/tests
  */
const Uint1Array = require('../src/index.js');
const chai = require('chai')
const expect = chai.expect

const TESTS = [
  [ 'sort', '0001111111' ],
  [ 'reverse', '0111111010' ],
  [ 'map', '1111111111', x => x + 1 ],
  [ 'map', '1010000001', x => x ^ 1 ]
];

describe('Uint1Array', () => {

  it('display', () => {
    const bits = new Uint1Array(128);
    expect(bits.toString()).to.equal(
      `Uint1Array [ ${bits.map(b => b + '').join(', ')} ]`)
  })
  it('methods', () => {
    const source = [0,1,0,1,1,1,1,1,1,0];
    let score = 0;
    TESTS.forEach( ([method, expected, ...args]) => {
      const subject = new Uint1Array( Array.from( source ) );
      const result = subject[method](...args).join('')
      expect(result).to.equal(expected, `test ${method}`)
    })
  })
  it('bitfield', () => {
    const source = new Uint32Array([ 2378462, 324578634, 3458743 ]);
    const bits = new Uint1Array( source );
    expect([...bits]).to.eql([1, 1, 1])
    const bitfield = new Uint1Array( source.buffer );
    expect([...bitfield].map(b => ''+b).join('')).to.eql(
      '011110110101001000100100000000000101001010110101000' +
      '110101100100011101101011000110010110000000000')
  })

  it('coerce ints', () => {
    const coerced_bits = new Uint1Array( [1,2,3,0] );
    expect([...coerced_bits]).to.eql([1, 1, 1, 0])
  })
  it('coerce string', () => {
    const message = "JAVASCRIPT ROCKS";
    const byte_values = message.split('').map( c => c.charCodeAt(0) );

    const bytes = new Uint8Array( byte_values );
    const bitfield = new Uint1Array( bytes.buffer );
    expect(conc(bitfield)).to.equal(
      '0101001010000010011010101000001011001010110000100100101010010010'
    + '0000101000101010000001000100101011110010110000101101001011001010'
    )
  })
  it('from length', () => {
    // From a length
    var uint8 = new Uint1Array(2);
    uint8.setBit(0, 42);
    expect(uint8.getBit(0)).to.equal(1)
    expect(uint8.length).to.equal(2)
    expect(Uint1Array.BYTES_PER_ELEMENT).to.equal(0.125)
  })
  it('from array', () => {
    var arr = new Uint1Array([21,31]);
    expect(arr.getBit(1)).to.equal(1)
  })
  it('from another typed array\'s buffer', () => {
    // From another TypedArray's buffer
    var x = new Uint8Array([21, 31]);
    var y = new Uint1Array(x.buffer);
    expect(conc(y)).to.eql('1010100011111000')
  })
  it('from array buffer', () => {
    // From an ArrayBuffer
    var buffer = new ArrayBuffer(8);
    var z = new Uint1Array(buffer, 1, 4);

    // From an iterable
    var iterable = function*(){ yield* [1,0,1]; }();
    var uint8 = new Uint1Array(iterable);
    expect(conc(uint8)).to.eql('101')
  })
})
function conc(a) {
  return a.map(a => '' + a).join('')
}
