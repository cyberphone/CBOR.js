// Testing the COTX identifier
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

function oneTurn(hex, dn, ok) {
  try {
    let object = CBOR.decode(CBOR.fromHex(hex));
    assertTrue("Should not execute", ok);
    if (object.toString() != dn.toString() || !object.equals(CBOR.decode(object.encode()))) {
      throw Error("non match:" + dn + " " + object.toString());
    }
  } catch (e) {
    if (ok) console.log(e.toString());
    assertFalse("Must succeed", ok);
  }
}

oneTurn('d903f2623737', '1010("77")', false);
oneTurn('d903f281623737', '1010(["77"])', false);
oneTurn('d903f28206623737', '1010([6, "77"])', false);
oneTurn('d903f28262373707', '1010(["77", 7])', true);

success();
