// Testing "tag"
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

let object = CBOR.Array().add(CBOR.String("https://example.com/myobject")).add(CBOR.Int(6));
let cbor = CBOR.Tag(CBOR.Tag.TAG_COTX, object).encode();
let tag = CBOR.decode(cbor);
assertTrue("t3", tag.getTagNumber()== CBOR.Tag.TAG_COTX);
assertTrue("t3.1", object.equals(tag.get()));
tag = CBOR.decode(cbor); 
assertTrue("t3.2", object.equals(tag.get()));
cbor = CBOR.Tag(0xf0123456789abcden, object).encode();
assertTrue("t14", CBOR.decode(cbor).getTagNumber()== 0xf0123456789abcden);
assertTrue("t5", CBOR.toHex(cbor) == 
    "dbf0123456789abcde82781c68747470733a2f2f6578616d706c652e636f6d2f6d796f626a65637406");
tag = CBOR.Tag(5n, CBOR.String("hi"));
assertTrue("u1", tag.update(CBOR.Int(6)).getString() == "hi");
assertTrue("u2", tag.get().getInt32() == 6);

[-1n, 0x10000000000000000n].forEach(tagNumber => { 
  try {
    CBOR.Tag(tagNumber, CBOR.String("any"));
    throw Error("Should not");
  } catch (error) {
    if (!error.toString().includes("out of range")) {
      throw error;
    }
  }
});

[2n, 3n].forEach(tagNumber => { 
  try {
    CBOR.Tag(tagNumber, CBOR.String("any"));
    throw Error("Should not");
  } catch (error) {
    if (!error.toString().includes("'bigint'")) {
      throw error;
    }
  }
});

[0n, 1n].forEach(tagNumber => { 
  try {
    CBOR.Tag(tagNumber, CBOR.Boolean(true));
    throw Error("Should not");
  } catch (error) {
    if (!error.toString().includes("got: CBOR.Boolean")) {
      throw error;
    }
  }
});

success();
