// Test of "hex" utility methods
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success,checkException } from './assertions.js';

const hex = '0123456789abcdefABCDEF';

let bin = CBOR.fromHex(hex);
let cnv = CBOR.toHex(bin);
assertFalse("hex", CBOR.compareArrays(bin, CBOR.fromHex(cnv)));
let ref = new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0xab, 0xcd, 0xef]);
assertFalse("bin", CBOR.compareArrays(bin, ref));
try {
  CBOR.fromHex("AAA");
  throw Error("should not");
} catch (e) {
  checkException(e, "Unev");
}

try {
  CBOR.fromHex("Ag");
  throw Error("should not");
} catch (e) {
  checkException(e, "Bad hex");
}
// Zero hex is accepted as well...
assertFalse("zero", CBOR.compareArrays(CBOR.fromHex(''), new Uint8Array()));
success();
