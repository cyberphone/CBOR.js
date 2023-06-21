// Testing the "constrained key" option
import CBOR from '../node-cbor.js';
import { assertTrue, assertFalse, success } from './assertions.js';

function oneTurn(cbor, ok) {
  try {
    CBOR.decode(cbor.encode());
  } catch (error) {
    throw error;
  }
  try {
    let decoder = CBOR.initExtended(cbor.encode(), false, false, true);
    let object = CBOR.decodeExtended(decoder);
    if (!ok) throw Error("Should not:");
  } catch (error) {
    if (ok || !error.toString().includes('Constrained')) {
      throw Error("Err=" + error + " ok=" + ok);
    }
  }
}

oneTurn(CBOR.Map().set(CBOR.Bool(true), CBOR.String("1")), false);
oneTurn(CBOR.Map()
    .set(CBOR.Int(0), CBOR.String("0"))
    .set(CBOR.Int(1), CBOR.String("1")), true);
oneTurn(CBOR.Map()
    .set(CBOR.String("mix"), CBOR.String("0"))
    .set(CBOR.Int(1), CBOR.String("1")), false);
success();
