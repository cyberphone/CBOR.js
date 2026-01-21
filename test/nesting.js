// Testing nesting checking
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success, fail } from './assertions.js';

function nest(setMax, level, ok) {
  let cborArray = CBOR.Array();
  let lastArray = cborArray;
  while (--level > 0) {
    lastArray.add(lastArray = CBOR.Array());
  }
  try {
    let cborDecoder = CBOR.initDecoder(cborArray.encode(), 0);
    if (setMax) {
      cborDecoder.setMaxNestingLevel(setMax);
    }
    cborDecoder.decodeWithOptions();
    assertTrue("mustnot", ok);
  } catch (error) {
//    console.log(error.toString());
    assertFalse("bad", ok);
  }
}

nest(null, 100, true);
nest(null, 101, false);
nest(2, 2, true);
nest(2, 3, false);

success();
