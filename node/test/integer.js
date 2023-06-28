// Test program for integer "edge cases"
import CBOR from '../node-cbor.js';
import { assertTrue, assertFalse, success } from './assertions.js';

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
  if (CBOR.decode(cbor).getBigInt() != value) {
    throw Error("Failed decoding: " + value);
  }
  while (expected.length < 20) {
    expected += ' ';
  }
  if (got.length) {
    throw Error(text + expected + got);
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

success();
