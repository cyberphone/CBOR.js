// Test of "hex" utility methods
import CBOR from '../npm/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

const hex = '0123456789abcdefABCDEF';

let bin = CBOR.fromHex(hex);
let cnv = CBOR.toHex(bin);
assertFalse("hex", CBOR.compareArrays(bin, CBOR.fromHex(cnv)));
let ref = new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0xab, 0xcd, 0xef]);
assertFalse("bin", CBOR.compareArrays(bin, ref));
try {
  CBOR.fromHex("AAA");
  throw Error("should not");
} catch (error) {
  if (!error.toString().includes("Unev")) {
    console.log(error);
  }
}

try {
  CBOR.fromHex("Ag");
  throw Error("should not");
} catch (error) {
  if (!error.toString().includes("Bad hex")) {
    console.log(error);
  }
}
// Zero hex is accepted as well...
assertFalse("zero", CBOR.compareArrays(CBOR.fromHex(''), new Uint8Array()));
success();
