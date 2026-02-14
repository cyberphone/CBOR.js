// Testing the "sequence" option
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success, checkException } from './assertions.js';

let cbor = new Uint8Array([0x05, 0xa1, 0x05, 0x42, 0x6a, 0x6a])
try {
  CBOR.decode(cbor);
  throw Error("Should not");
} catch (e) {
  checkException(e, 'Unexpected');
}
let decoder = CBOR.initDecoder(cbor, CBOR.SEQUENCE_MODE);
let total = new Uint8Array();
let object;
while (object = decoder.decodeWithOptions()) {
  total = CBOR.addArrays(total, object.encode());
}
assertFalse("Comp", CBOR.compareArrays(total, cbor));
assertTrue("Comp2", total.length == decoder.getByteCount());
decoder = CBOR.initDecoder(new Uint8Array(), CBOR.SEQUENCE_MODE);
assertFalse("Comp3", decoder.decodeWithOptions());
assertTrue("Comp4", decoder.getByteCount() == 0);
let arraySequence = CBOR.Array();
decoder = CBOR.initDecoder(cbor, CBOR.SEQUENCE_MODE);
while (object = decoder.decodeWithOptions()) {
  arraySequence.add(object);
}
assertFalse("Comp5", CBOR.compareArrays(arraySequence.encodeAsSequence(), cbor));

success();
