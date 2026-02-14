// Number overflow tests.
import CBOR from '../npm/mjs/index.mjs';
import { fail, assertTrue, assertFalse, success, checkException } from './assertions.js';

const TOO_BIG = Number.MAX_SAFE_INTEGER + 1;
const IN_RANGE =  Number.MAX_SAFE_INTEGER;

try {
  CBOR.Int(TOO_BIG);
  fail('Should not');
} catch (e) {
  checkException(e, 'Invalid integer');
}
let cbor = CBOR.Int(BigInt(TOO_BIG)).encode();
try {
  CBOR.decode(cbor).getInt53();
  fail('Should not');
} catch (e) {
  checkException(e, 'Value out of range');
}
assertTrue("big", BigInt(TOO_BIG) == CBOR.decode(cbor).getBigInt());

cbor = CBOR.Int(IN_RANGE).encode();
assertTrue("R0", CBOR.decode(cbor).getInt53() == IN_RANGE);
cbor = CBOR.Int(-IN_RANGE).encode();
assertTrue("R0", CBOR.decode(cbor).getInt53() == -IN_RANGE);

success();
