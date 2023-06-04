// JavaScript source code
import CBOR from '../node-cbor.js';
import { assertTrue, assertFalse } from './assertions.js';

const hex = '0123456789abcdefABCDEF';

let bin = CBOR.fromHex(hex);
let cnv = CBOR.toHex(bin);
assertFalse("hex", CBOR.compareArrays(bin, CBOR.fromHex(cnv)));
let ref = new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0xAB, 0xCD, 0xEF]);
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