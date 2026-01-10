// Testing range-constrained integers
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, fail, success } from './assertions.js';

function goodRun(type, value) {
  let bigFlag = type.indexOf("64") > 0 || type.indexOf("128") > 0;
  let wrapper = CBOR.decode(CBOR.Int(value).encode());
  let test = 'assertTrue("good", wrapper.get' + type + '() == ' + (bigFlag ? value + 'n' : Number(value)) + ')';
  eval(test);
  test = 'CBOR.Int.create' + type + '(' + value + 'n)';
  eval(test);
  if (value == 10n) {
    test = 'CBOR.Int.create' + type + '(Number(' + value +'))';
    eval(test);
  }
}

function badRun(type, value) {
  let wrapper = CBOR.decode(CBOR.Int(value).encode());
  let test = 'wrapper.get' + type + '()';
  try {
    eval(test);
    fail("Should fail");
  } catch (error) {
    if (!error.toString().includes('Value out of range for ')) {
      throw error;
    }
  }
  test = 'CBOR.Int.create' + type + '(' + value + 'n)';
  try {
    eval(test);
    fail("Should fail");
  } catch (error) {
    if (!error.toString().includes('Value out of range for ')) {
      throw error;
    }
  }
}

function innerTurn(type, signed, size) {
  let min = signed ? -(1n << BigInt(size) - 1n) : 0n;
  let max = signed ? (1n << BigInt(size) - 1n) - 1n : (1n << BigInt(size)) - 1n;
  if (size == 53) {
    max = BigInt(Number.MAX_SAFE_INTEGER);
    min = -max;
  }
  goodRun(type, min);
  goodRun(type, max);
  goodRun(type, 10n);
  badRun(type, max + 1n);
  badRun(type, min - 1n);
}

function oneTurn(size) {
  innerTurn("Int" + size, true, size);
  if (size != 53) {
    innerTurn("Uint" + size, false, size);
  }
}

oneTurn(8);
oneTurn(16);
oneTurn(32);
oneTurn(53);
oneTurn(64);
oneTurn(128);

success();
