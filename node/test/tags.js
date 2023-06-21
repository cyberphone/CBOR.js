// Testing "tag"
import CBOR from '../node-cbor.js';
import { assertTrue, assertFalse, success } from './assertions.js';

const TOO_BIG = Number.MAX_SAFE_INTEGER + 1;
const IN_RANGE =  Number.MAX_SAFE_INTEGER;

let cbor = CBOR.Tag(IN_RANGE, CBOR.Map()).encode();
assertTrue("t1", CBOR.decode(cbor).getTagNumber()== BigInt(IN_RANGE));
cbor = CBOR.Tag(BigInt(TOO_BIG), CBOR.Map()).encode();
assertTrue("t2", CBOR.decode(cbor).getTagNumber()== BigInt(TOO_BIG));
let object = CBOR.Array().add(CBOR.String("https://example.com/myobject")).add(CBOR.Int(6));
cbor = CBOR.Tag(CBOR.Tag.RESERVED_TAG_COTX, object).encode();
let tag = CBOR.decode(cbor);
assertTrue("t3", tag.getTagNumber()== CBOR.Tag.RESERVED_TAG_COTX);
assertTrue("t3.1", object.equals(tag.getTaggedObject()));
tag = CBOR.decode(cbor).getTag();  // Redundant in JavaScript
assertTrue("t3.2", object.equals(tag.getTaggedObject()));
cbor = CBOR.Tag(0xf0123456789abcden, object).encode();
assertTrue("t14", CBOR.decode(cbor).getTagNumber()== 0xf0123456789abcden);
assertTrue("t5", CBOR.toHex(cbor) == 
    "dbf0123456789abcde82781c68747470733a2f2f6578616d706c652e636f6d2f6d796f626a65637406");
try {
  CBOR.Tag(-1, CBOR.String("minus"));
  throw Error("Should not");
} catch (error) {
  if (!error.toString().includes("out of range")) {
    console.log(error);
  }
}
try {
  CBOR.Tag(0x10000000000000000n, CBOR.String("minus"));
  throw Error("Should not");
} catch (error) {
  if (!error.toString().includes("out of range")) {
    console.log(error);
  }
}

try {
  let tag = CBOR.Int(5).getTag();
  throw Error("Should not");
} catch (error) {
  if (!error.toString().includes("CBOR.Int")) {
    console.log(error);
  }
}

success();
