// Test of "utf8" converters
import CBOR from '../node-cbor.js';
import { assertTrue, assertFalse, success } from './assertions.js';

function utf8EncoderTest(string, ok) {
  try {
    CBOR.String(string).encode();
    assertTrue("enc", ok);
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

success();
