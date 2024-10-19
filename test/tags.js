// Testing "tag"
import CBOR from '../../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

let object = CBOR.Array().add(CBOR.String("https://example.com/myobject")).add(CBOR.Int(6));
let cbor = CBOR.Tag(CBOR.Tag.RESERVED_TAG_COTX, object).encode();
let tag = CBOR.decode(cbor);
assertTrue("t3", tag.getTagNumber()== CBOR.Tag.RESERVED_TAG_COTX);
assertTrue("t3.1", object.equals(tag.getTaggedObject()));
tag = CBOR.decode(cbor); 
assertTrue("t3.2", object.equals(tag.getTaggedObject()));
cbor = CBOR.Tag(0xf0123456789abcden, object).encode();
assertTrue("t14", CBOR.decode(cbor).getTagNumber()== 0xf0123456789abcden);
assertTrue("t5", CBOR.toHex(cbor) == 
    "dbf0123456789abcde82781c68747470733a2f2f6578616d706c652e636f6d2f6d796f626a65637406");
try {
  CBOR.Tag(-1n, CBOR.String("minus"));
  throw Error("Should not");
} catch (error) {
  if (!error.toString().includes("out of range")) {
    throw error;
  }
}
try {
  CBOR.Tag(0x10000000000000000n, CBOR.String("too big"));
  throw Error("Should not");
} catch (error) {
  if (!error.toString().includes("out of range")) {
    throw error;
  }
}

try {
  // Z or -+local offset needed.
  CBOR.Tag(0n, CBOR.String("2023-06-22T00:01:43"));
  throw Error("Should not");
} catch (error) {
  if (!error.toString().includes("ISO")) {
    throw error;
  }
}

try {
  // 24 hour is incorrect.
  CBOR.Tag(0n, CBOR.String("2023-06-22T24:01:43Z"));
  throw Error("Should not");
} catch (error) {
  if (!error.toString().includes("ISO")) {
    throw error;
  }
}

success();
