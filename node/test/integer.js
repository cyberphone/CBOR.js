// Test program for integer "edge cases"
import CBOR from '../../npm/index.mjs';
import { assertTrue, assertFalse, fail, success } from './assertions.js';

function oneTurn(value, expected) {
  let text = value.toString();
  while (text.length < 25) {
    text += ' ';
  }
  let cbor = CBOR.BigInt(value).encode();
  let got = CBOR.toHex(cbor);
  if (got != expected) {
    got = '***=' + got;
  } else {
    got = '';
  }
  assertTrue("Failed decoding: " + value, CBOR.decode(cbor).getBigInt() == value);
  while (expected.length < 20) {
    expected += ' ';
  }
  if (got.length) {
    fail(text + expected + got);
  }
}
oneTurn(0n, '00');
oneTurn(-1n, '20');
oneTurn(255n, '18ff');
oneTurn(256n, '190100');
oneTurn(-256n, '38ff');
oneTurn(-257n, '390100');
oneTurn(1099511627775n, '1b000000ffffffffff');
oneTurn(18446744073709551615n, '1bffffffffffffffff');
oneTurn(18446744073709551616n, 'c249010000000000000000');
oneTurn(-18446744073709551616n, '3bffffffffffffffff');
oneTurn(-18446744073709551617n, 'c349010000000000000000');

try {
  CBOR.Int(1.1);
  fail("Should not");
} catch (error) {
  assertTrue("msg1", error.toString().includes("Argument is not an integer"));
}
try {
  CBOR.Int(-0);
  fail("Should not");
} catch (error) {
  assertTrue("msg1", error.toString().includes("Argument is not an integer"));
}
try {
  CBOR.Int("10");
  fail("Should not");
} catch (error) {
  assertTrue("msg2", error.toString().includes("Argument is not a 'Number'"));
}
try {
  CBOR.BigInt("10");
  fail("Should not");
} catch (error) {
  assertTrue("msg3", error.toString().includes("Argument is not a 'BigInt'"));
}
try {
  CBOR.BigInt(1n, 7);
  fail("Should not");
} catch (error) {
  assertTrue("msg4", error.toString().includes("CBOR.BigInt expects 1 argument(s)"));
}
try {
  CBOR.Int(1, 7);
  fail("Should not");
} catch (error) {
  assertTrue("msg4", error.toString().includes("CBOR.Int expects 1 argument(s)"));
}

success();
