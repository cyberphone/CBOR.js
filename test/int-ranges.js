// Testing range-constrained integers
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, fail, success } from './assertions.js';

function goodRun(type, value) {
  let bigFlag = type.indexOf("64") > 0;
  let wrapper = CBOR.decode(CBOR.BigInt(value).encode());
  let test = 'assertTrue("good", wrapper.get' + type + '() == ' + (bigFlag ? value + 'n' : Number(value)) + ')';
  eval(test);
  test = 'CBOR.Int.create' + type + '(' + value + 'n)';
  eval(test);
}

function badRun(type, value) {
  let bigFlag = type.indexOf("64") > 0;
  let wrapper = CBOR.decode(CBOR.BigInt(value).encode());
  let test = 'wrapper.get' + type + '()';
  try {
    eval(test);
    fail("Should fail");
  } catch (error) {
    if (!error.toString().includes('Argument is not') &&
        !(error.toString().includes('Expected CBOR.Int, got: CBOR.BigInt') &&
          type.indexOf("64"))) {
      throw error;
    }
  }
  if (bigFlag) return;
  test = 'CBOR.Int.create' + type + '(' + value + 'n)';
  try {
    eval(test);
    fail("Should fail");
  } catch (error) {
    if (!error.toString().includes('Argument is not')) {
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

success();
