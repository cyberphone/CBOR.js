// JavaScript source code
const CBOR = require('../src/cbor.js');
const assertTrue = require('./assertions.js').assertTrue;
const assertFalse = require('./assertions.js').assertFalse;

function oneTurn(cborText) {
  let result = CBOR.diagnosticNotation(cborText);
  if (result.toString() != cborText) {
    console.log("input:\n" + cborText + "\nresult:\n" + result);
  }
}

oneTurn("2");
oneTurn("2.0");
oneTurn("123456789012345678901234567890");
oneTurn("Infinity");
oneTurn("-Infinity");
oneTurn("NaN");
oneTurn('{\n  4: "hi"\n}');
oneTurn('[4, true, false, null]');
oneTurn('4e+500');
