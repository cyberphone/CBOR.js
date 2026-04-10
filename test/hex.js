// Test of "hex" utility methods
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success,checkException } from './assertions.js';

function compareArrays(a, b) {
  let minIndex = Math.min(a.length, b.length);
  for (let i = 0; i < minIndex; i++) {
    let diff = a[i] - b[i];
    if (diff != 0) {
      return diff;
    }
  }
  return a.length - b.length;
}

const hex = '0123456789abcdefABCDEF';

let bin = Uint8Array.fromHex(hex);
let cnv = bin.toHex();
assertFalse("hex", compareArrays(bin, Uint8Array.fromHex(cnv)));
let ref = new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0xab, 0xcd, 0xef]);
assertFalse("bin", compareArrays(bin, ref));
try {
  Uint8Array.fromHex("AAA");
  throw Error("should not");
} catch (e) {
  checkException(e, "SyntaxError");
}

try {
  Uint8Array.fromHex("Ag");
  throw Error("should not");
} catch (e) {
  checkException(e, "SyntaxError");
}
// Zero hex is accepted as well...
assertFalse("zero", compareArrays(Uint8Array.fromHex(''), new Uint8Array()));
success();
