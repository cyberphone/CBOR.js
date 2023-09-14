// Testing the COTX identifier
import CBOR from '../../npm/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

function oneTurn(hex, dn, ok) {
  try {
    CBOR.decode(CBOR.fromHex(hex));
    assertTrue("Should not execute", ok);
  } catch (error) {
    assertFalse("Must succeed", ok);
  }

  try {
    let decoder = CBOR.initExtended(CBOR.fromHex(hex), false, false);
    let object = CBOR.decodeExtended(decoder);
    assertTrue("Should not execute", ok);
    if (object.toString() != dn.toString() || !object.equals(CBOR.decode(object.encode()))) {
      throw Error("non match:" + dn + " " + object.toString());
    }
  } catch (error) {
    if (ok) console.log(error.toString());
    assertFalse("Must succeed", ok);
  }
}

oneTurn('d903f2623737', '1010("77")', false);
oneTurn('d903f281623737', '1010(["77"])', false);
oneTurn('d903f28206623737', '1010([6, "77"])', false);
oneTurn('d903f28262373707', '1010(["77", 7])', true);

success();
