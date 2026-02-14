// Testing "simple"
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success, checkException } from './assertions.js';

[-1, 256, 24, 31].forEach(value => { 
  try {
    CBOR.Simple(value);
    fail("Should not");
  } catch (e) {
    checkException(e,"out of range");
  }
});

function oneTurn(value, hex) {
  let s = CBOR.Simple(value);
  let s2 = CBOR.decode(s.encode());
  assertTrue("v", s.getSimple() == value);
  assertTrue("v2", s2.getSimple() == value);
  assertTrue("b", CBOR.toHex(s2.encode()) == hex);
}

oneTurn(0, "e0");
oneTurn(23, "f7");
oneTurn(32, "f820");
oneTurn(255, "f8ff");

success();
