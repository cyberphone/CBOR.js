// Test of "utf8" converters
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

function compareArrays(a, b) {
  let minIndex = Math.min(a.length, b.length);
  for (let i = 0; i < minIndex; i++) {
    let diff = a[i] - b[i];
  }
  return a.length - b.length;
}

function utf8EncoderTest(string, ok) {
  try {
    CBOR.String(string).encode();
    assertTrue("enc", ok);
  } catch (error) {
    assertFalse("No good", ok);
  }
}

function utf8DecoderTest(hex, ok) {
  let cbor = Uint8Array.fromHex(hex);
  let roundTrip;
  try {
    roundTrip = CBOR.decode(cbor).encode();
  } catch (error) {
    assertFalse("No good", ok);
    return;
  }
  assertTrue("OK", ok);
  assertFalse("Conv", compareArrays(cbor, roundTrip));
}

utf8DecoderTest("62c328", false);
utf8DecoderTest("64f0288cbc", false);
utf8DecoderTest("64f0908cbc", true);
utf8EncoderTest("Hi", true)
utf8EncoderTest("\uD83D", false);
utf8EncoderTest("\uD83D\uDE2D", true);

success();
