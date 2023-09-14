// Number overflow tests.
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

const TOO_BIG = Number.MAX_SAFE_INTEGER + 1;
const IN_RANGE =  Number.MAX_SAFE_INTEGER;

try {
  CBOR.Int(TOO_BIG);
  throw Error('Should not');
} catch (error) {
  if (error.toString().includes('Should not')) {
    throw error;
  }
}
let cbor = CBOR.BigInt(BigInt(TOO_BIG)).encode();
try {
  CBOR.decode(cbor).getInt();
  throw Error('Should not');
} catch (error) {
  if (error.toString().includes('Should not')) {
    throw error;
  }
}
assertTrue("big", BigInt(TOO_BIG) == CBOR.decode(cbor).getBigInt());

cbor = CBOR.Int(IN_RANGE).encode();
assertTrue("R0", CBOR.decode(cbor).getInt() == IN_RANGE);
cbor = CBOR.Int(-IN_RANGE).encode();
assertTrue("R0", CBOR.decode(cbor).getInt() == -IN_RANGE);

success();
