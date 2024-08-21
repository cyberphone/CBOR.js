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
let decoder = CBOR.initDecoder(cbor).setSequenceMode(true);
let total = new Uint8Array();
let object;
while (object = decoder.decodeWithOptions()) {
  total = CBOR.addArrays(total, object.encode());
}
assertFalse("Comp", CBOR.compareArrays(total, cbor));
assertTrue("Comp2", total.length == decoder.getByteCount());
decoder = CBOR.initDecoder(new Uint8Array()).setSequenceMode(true);
assertFalse("Comp3", decoder.decodeWithOptions());
assertTrue("Comp4", decoder.getByteCount() == 0);

success();
