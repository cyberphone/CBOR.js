// Test program for floating point "edge cases"
const CBOR = require('../src/cbor.js');
const assertTrue = require('./assertions.js').assertTrue;
const assertFalse = require('./assertions.js').assertFalse;


function utf8EncoderTest(string, ok) {
  try {
    let cbor = CBOR.String(string).encode();
    console.log("S=" + string);
/*
    encodedString = CBORDiagnosticNotation.decode(
            "\"" + string + "\"").getString();
    assertTrue("OK", ok);
    assertTrue("Conv", string.equals(encodedString));
    byte[] encodedBytes = CBORDiagnosticNotation.decode(
            "'" + string + "'").getBytes();
    assertTrue("OK", ok);
    assertTrue("Conv2", Arrays.equals(encodedBytes, string.getBytes("utf-8")));
*/
  } catch (error) {
    assertFalse("No good", ok);
  }

}

function utf8DecoderTest(hex, ok) {
  let cbor = CBOR.fromHex(hex);
  let roundTrip;
  try {
    roundTrip = CBOR.decode(cbor).encode();
  } catch (error) {
    assertFalse("No good", ok);
    return;
  }
  assertTrue("OK", ok);
  assertFalse("Conv", CBOR.compareArrays(cbor, roundTrip));
}

utf8DecoderTest("62c328", false);
utf8DecoderTest("64f0288cbc", false);
utf8DecoderTest("64f0908cbc", true);
utf8EncoderTest("Hi", true)
utf8EncoderTest("\uD83D", false);
utf8EncoderTest("\uD83D\uDE2D", true);
