// Testing range-constrained integers
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

function goodRun(method, value) {
  let bigFlag = method.indexOf("64") > 0;
  let wrapper = CBOR.decode(CBOR.BigInt(value).encode());
  let test = 'assertTrue("good", wrapper.' + method + '() == ' + (bigFlag ? value + 'n' : Number(value)) + ')';
  eval(test);
}

function badRun(method, value) {
  let wrapper = CBOR.decode(CBOR.BigInt(value).encode());
  let test = 'wrapper.' + method + '()';
  try {
    eval(test);
    assertTrue("Should fail", false);
  } catch (error) {
    if (!error.toString().includes('Value out of range:')) {
      throw error;
    }
  }
}

function innerTurn(method, signed, size) {
  let min = signed ? -(1n << BigInt(size) - 1n) : 0n;
  let max = signed ? (1n << BigInt(size) - 1n) - 1n : (1n << BigInt(size)) - 1n;
  goodRun(method, min);
  goodRun(method, max);
  goodRun(method, 10n);
  badRun(method, max + 1n);
  badRun(method, min - 1n);
}

function oneTurn(size) {
  innerTurn("getInt" + size, true, size);
  innerTurn("getUint" + size, false, size);
}

oneTurn(8);
oneTurn(16);
oneTurn(32);
oneTurn(64);

success();
