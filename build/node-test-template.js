// Testing CBOR.js API
import CBOR from '../npm/index.mjs';

let failures = 0;
let test = 0;
let name = '';

function assertTrue(text, bool) {
  if (!bool) throw Error("Assertion: " + text);
}

function assertFalse(text, bool) {
  if (bool) throw Error("Assertion: " + text);
}

function success() {
  console.log('Test ' + name + ' was successful');
}

let TESTS=[

];

function runTest() {
  test = 0;
  failures = 0;
  for (let test = 0; test < TESTS.length; test++) {
    name = TESTS[test].name;
    try {
      eval(TESTS[test].file);
    } catch (error) {
      failures++;
      console.log(name + " FAILED: " + error);
    }
  }
  if (failures) {
    console.log('There were ' + failures + ' errors');
  } else {
    console.log('PASSED');
  }
}

runTest();
