// Testing "diagnostic notation"
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

function oneTurn(cborText, ok, compareWithOrNull) {
  try {
    let compareText = compareWithOrNull ? compareWithOrNull : cborText;
    let result = CBOR.diagDecode(cborText);
    assertTrue("Should not", ok);
    let sequence = CBOR.diagDecodeSequence(cborText);
    if (result.toString() != compareText) {
      throw Error("input:\n" + cborText + "\nresult:\n" + result);
    }
    assertTrue("seq", sequence.length == 1);
    if (sequence[0].toString() != compareText) {
      throw Error("input:\n" + cborText + "\nresult:\n" + result);
    }
  } catch (error) {
    assertFalse("Err: " + error, ok);
  }
}

function oneBinaryTurn(diag, hex) {
  assertTrue("bin", CBOR.toHex(CBOR.diagDecode(diag).encode()) == hex);
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
oneTurn('"next\nline\r\\\ncont\r\nk"', true, '"next\\nline\\ncont\\nk"');
oneTurn('{1:<<  5   ,   7   >>}', true, "{\n  1: h'0507'\n}");
oneTurn('<<[3.0]>>', true, "h'81f94200'");
oneTurn('0b100_000000001', true, "2049");
oneTurn('4.0e+500', false, null);
oneTurn('4.0e+5', true, "400000.0");
oneTurn('"missing', false, null);
oneTurn('simple(21)', true, 'true');
oneTurn('simple(59)', true, 'simple(59)');
oneBinaryTurn('"\\ud800\\udd51"', "64f0908591");
oneBinaryTurn("'\\u20ac'", "43e282ac");
oneBinaryTurn('"\\"\\\\\\b\\f\\n\\r\\t"', "67225c080c0a0d09");

let cborObject = CBOR.decode(CBOR.fromHex('a20169746578740a6e6578740284fa3380000147a10564646\
17461a1f5f4c074323032332d30362d30325430373a35333a31395a'));

let cborText = '{\n  1: "text\\nnext",\n  2: [5.960465188081798e-8, h\'a1056464617461\', {\n\
    true: false\n  }, 0("2023-06-02T07:53:19Z")]\n}';

assertTrue("pretty", cborObject.toDiag(true) == cborText);
assertTrue("oneline", cborObject.toDiag(false) == 
                   cborText.replaceAll('\n', '').replaceAll(' ',''));
assertTrue("parse", CBOR.diagDecode(cborText).equals(cborObject));
let sequence = CBOR.diagDecodeSequence('45,{4:7}');
assertTrue("seq2", sequence.length == 2);
assertTrue("seq3", sequence[0].getInt32() == 45);
assertTrue("seq4", sequence[1].equals(CBOR.Map().set(CBOR.Int(4),CBOR.Int(7))));

try {
  CBOR.diagDecode("float'000000'");
  fail("bugf");
} catch (error) {
  assertTrue("fp", error.toString().includes('floating-point'));
}

success();
