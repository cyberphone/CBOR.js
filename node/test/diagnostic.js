// Testing "diagnostic notation"
import CBOR from '../node-cbor.js';
import { assertTrue, assertFalse, success } from './assertions.js';

function oneTurn(cborText, ok, compareWithOrNull) {
  try {
    let compareText = compareWithOrNull ? compareWithOrNull : cborText;
    let result = CBOR.diagnosticNotation(cborText);
    assertTrue("Should not", ok);
    if (result.toString() != compareText) {
      throw Error("input:\n" + cborText + "\nresult:\n" + result);
    }
  } catch (error) {
    assertFalse("Err", ok);
  }
}

oneTurn("2", true, null);
oneTurn("2.0", true, null);
oneTurn("123456789012345678901234567890", true, null);
oneTurn("Infinity", true, null);
oneTurn("-Infinity", true, null);
oneTurn("NaN", true, null);
oneTurn("0.0", true, null);
oneTurn("-0.0", true, null);
oneTurn('{\n  4: "hi"\n}', true, null);
oneTurn('[4, true, false, null]', true, null);
oneTurn('"next\\nline"', true, null);
oneTurn('0b100_000000001', true, "2049");
oneTurn('0b100_000000001', true, "2049");
oneTurn('4.0e+500', false, null);
oneTurn('4.0e+5', false, "400000.0");
oneTurn('"missing', false, null);

let cborObject = CBOR.decode(CBOR.fromHex('a20169746578740a6e6578740284fa3380000147a10564646\
17461a1f5f4c074323032332d30362d30325430373a35333a31395a'));

let cborText = '{\n  1: "text\\nnext",\n  2: [5.960465188081798e-8, h\'a1056464617461\', {\n' +
    '    true: false\n  }, 0("2023-06-02T07:53:19Z")]\n}';

assertTrue("pretty", cborObject.toDiagnosticNotation(true) == cborText);
assertTrue("ugly", cborObject.toDiagnosticNotation(false) == 
                   cborText.replaceAll('\n', '').replaceAll(' ',''));
success();