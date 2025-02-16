// Testing "deterministic" code checks
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

function oneTurn(hex, dn) {
  try {
    CBOR.decode(CBOR.fromHex(hex));
    throw Error("Should not fail on: " + dn);
  } catch (error) {
    if (!error.toString().includes("Non-d")) {
      throw error;
    }
  }
  let object = CBOR.initDecoder(CBOR.fromHex(hex), 
      dn.includes("{") ? CBOR.LENIENT_MAP_DECODING : CBOR.LENIENT_NUMBER_DECODING).decodeWithOptions();
  if (object.toString() != dn || !object.equals(CBOR.decode(object.encode()))) {
    throw Error("non match:" + dn);
  }
}

oneTurn('1900ff', '255');
oneTurn('1817', '23');
oneTurn('A2026374776F01636F6E65', '{\n  1: "one",\n  2: "two"\n}');
oneTurn('FB7FF8000000000000', 'NaN');
oneTurn('FA7FC00000', 'NaN');
oneTurn('FB3ff0000000000000', '1.0');
oneTurn('c2480100000000000000', '72057594037927936');
oneTurn('c24900ffffffffffffffff', '18446744073709551615');
oneTurn('c240', '0');
oneTurn('f97e01', 'NaN');
oneTurn('c240', '0');

// This one is actually deterministic...
try {
  oneTurn('fa7f7fffff', '3.4028234663852886e+38');
} catch (error) {
  if (!error.toString().includes('Should not')) {
    throw error;
  }
}

success();
