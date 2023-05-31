// JavaScript source code
const CBOR = require('../src/cbor.js');
'use strict';

function print(array) {
  let f64bytes = new Uint8Array(array);
  const f64buffer = new ArrayBuffer(8);
  new Uint8Array(f64buffer).set(f64bytes);
  console.log(new DataView(f64buffer).getFloat64(0, false));
}

function process(f64Number) {
  console.log("\nINIT=" + f64Number);
  let cbor = CBOR.Float(f64Number).encode();
  let f64 = CBOR.decode(cbor);
  console.log('Value=' + f64.toString());
}

print([0x47, 0xef, 0xff, 0xff, 0xe0, 0x00, 0x00, 0x01]);
print([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
print([0xff, 0xf0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
print([0x7f, 0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
/*
process(3.402823466385289e+38);
process(0.0);
process(Number.NaN);
process(Number.NEGATIVE_INFINITY);
process(Number.POSITIVE_INFINITY);
*/
process(0.5);
process(-5.9604644775390625e-8);
process(6.103515625e-5);
process(10.559998512268066);
process(5.960465188081798e-8);
process(10.559998512268068);
process(3.4028234663852886e+38);
process(5.0e-324);
