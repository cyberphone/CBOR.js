// JavaScript source code
import CBOR from '../node-cbor.js';
import { assertTrue, assertFalse } from './assertions.js';

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
