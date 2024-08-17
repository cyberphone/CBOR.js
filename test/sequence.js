// Testing the "sequence" option
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

let cbor = new Uint8Array([0x05, 0xa1, 0x05, 0x42, 0x6a, 0x6a])
try {
  CBOR.decode(cbor);
  throw Error("Should not");
} catch (error) {
  if (!error.toString().includes('Unexpected')) console.log(error);
}
let decoder = CBOR.initExtended(cbor, true, false, false);
let total = new Uint8Array();
let object;
while (object = decoder.decodeExtended()) {
  total = CBOR.addArrays(total, object.encode());
}
assertFalse("Comp", CBOR.compareArrays(total, cbor));

success();
