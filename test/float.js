// Test program for floating-point "edge cases"
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, fail, success } from './assertions.js';

function overflow(cborObject, length) {
  let test = 'cborObject.getFloat' + length + '()';
  try {
    eval(test);
    assertTrue("Should fail", false);
  } catch (error) {
    if (!error.toString().includes('Value out of range:')) {
      throw error;
    }
  }  
}

function oneTurn(valueText, expected) {
  let decoder = CBOR.initDecoder(CBOR.fromHex(expected), CBOR.REJECT_NON_FINITE_FLOATS);
  let value = Number(valueText);
  let invalidFloats = !Number.isFinite(value);
  let text = valueText;
  while (text.length < 25) {
    text += ' ';
  }
  let cbor = CBOR.Float(value).encode();
  let got = CBOR.toHex(cbor);
  if (got != expected) {
    got = '***=' + got;
  } else {
    got = '';
  }
  let decodedValue = CBOR.decode(cbor);
  if (valueText == 'NaN') {
    decodedValue.getFloat16();
    if (decodedValue.length > 2) {
      throw Error("Failed decoding: " + value);      
    }
  } else if (expected.length == 6) {
    if (decodedValue.getFloat16() != value ||
        decodedValue.getFloat32() != value || decodedValue.getFloat64() != value) {
      throw Error("Failed decoding: " + value);
    }
  } else if (expected.length <= 10) {
    if (decodedValue.getFloat32() != value || decodedValue.getFloat64() != value) {
      throw Error("Failed decoding: " + value);
    }
    overflow(decodedValue, "16");
  } else {
    overflow(decodedValue, "16");
    overflow(decodedValue, "32");
  }
  if (decodedValue.toString() != valueText) {
    throw Error("Failed encoding: " + valueText + " " + decodedValue.toString());
  }
  while (expected.length < 20) {
    expected += ' ';
  }
  if (got.length) {
    throw Error(text + expected + got);
  }
  try {
    decoder.decodeWithOptions();
    assertFalse('Should not execute', invalidFloats);
  } catch (error) {
    assertTrue("Decode ME1", error.toString().includes('"NaN" and "Infinity"'));
  }
  CBOR.nonFiniteFloatsMode(true);
  try {
    CBOR.decode(cbor);
    assertFalse('Should not execute', invalidFloats);
  } catch (error) {
    assertTrue("Decode ME2", error.toString().includes('"NaN" and "Infinity"'));
  }
  CBOR.nonFiniteFloatsMode(false);
  CBOR.decode(cbor);
}

const inNanWithPayload = new Uint8Array([0x7f, 0xf8, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00]);

let value = new DataView(inNanWithPayload.buffer, 0, 8).getFloat64(0, false);
    
let outNanWithPayload = new Uint8Array(8);
new DataView(outNanWithPayload.buffer, 0, 8).setFloat64(0, value, false);

let supportNanWithPayloads = true;
for (let q = 0; q < 8; q++) {
  if (inNanWithPayload[q] != outNanWithPayload[q]) {
  //  console.log(outNanWithPayload.toString());
    console.log('This implementation does not support NaN with payloads');
    supportNanWithPayloads = false;
    break;
  }
}

function oneNanWithPayloadTurn(nanInHex) {
  let ieee754 = CBOR.fromHex(nanInHex);
  let length = ieee754.length;
  let significand = 0n;
  for (let q = 0; q < length; q++) {
    significand <<= 8n;
    significand += BigInt(ieee754[q]);
  }
  let precision;
  let value;
  let f64b;
  let quietNan;
  try {
    switch (length) {
      case 2:
        precision = 10n; 
        break;
      case 4:
        precision = 23n; 
        break;
      default:
        precision = 52n; 
    }
    significand &= (1n << precision) - 1n;
    let f64bin = 0x7ff0000000000000n | significand << (52n - precision);
    if (ieee754[0] >= 128) {
      f64bin |= 0x8000000000000000n;
    }
    quietNan = f64bin == 0x7ff8000000000000n;
    f64b = new Uint8Array(8);
    for (let q = 8; --q >= 0;) {
      f64b[q] = Number(f64bin & 0xffn);
      f64bin >>= 8n;
    }
    value = new DataView(f64b.buffer, 0, 8).getFloat64(0, false);
 //   console.log("q=" + quietNan + " v=" + value + " h=" + CBOR.toHex(f64b) + " x=" + CBOR.toHex(ieee754));
    CBOR.Float(value);
    assertTrue("OK1", quietNan || !supportNanWithPayloads);
  } catch (error) {
//    console.log("dec1=" + error.toString());
    assertTrue("PL1", !quietNan && error.toString().includes('payloads'));
  }
  let cbor = CBOR.addArrays(new Uint8Array([0xf9 + (length >> 2)]), ieee754);
  // console.log("cbor=" + CBOR.toHex(cbor));
  try {
    let floatObject = CBOR.decode(cbor);
    assertTrue("OK2", (quietNan && length == 2) || !supportNanWithPayloads);
  } catch (error) {
  //  console.log("dec2=" + error.toString());
    if (!quietNan && supportNanWithPayloads) {
      assertTrue("PL2", error.toString().includes('payloads'));
    } else {
      assertTrue("PL3", error.toString().includes('Non-deterministic'));
    }
  }
  let readFloat = CBOR.initDecoder(cbor, CBOR.LENIENT_NUMBER_DECODING).decodeWithOptions();
  let f64b2 = new Uint8Array(8);
  new DataView(f64b2.buffer, 0, 8).setFloat64(0, readFloat.getFloat64(), false);
//  console.log("f64b=" + CBOR.toHex(f64b) + " f64b2=" + CBOR.toHex(f64b2));
  assertTrue("V", !CBOR.compareArrays(f64b2, f64b) || !supportNanWithPayloads);
}

oneTurn('0.0',                      'f90000');
oneTurn('-0.0',                     'f98000');
oneTurn('NaN',                      'f97e00');
oneTurn('Infinity',                 'f97c00');
oneTurn('-Infinity',                'f9fc00');
oneTurn('0.0000610649585723877',    'fa38801000');
oneTurn('10.559998512268066',       'fa4128f5c1');
oneTurn('65472.0',                  'f97bfe');
oneTurn('65472.00390625',           'fa477fc001');
oneTurn('65503.0',                  'fa477fdf00');
oneTurn('65504.0',                  'f97bff');
oneTurn('65504.00000000001',        'fb40effc0000000001');
oneTurn('65504.00390625',           'fa477fe001');
oneTurn('65504.5',                  'fa477fe080');
oneTurn('65505.0',                  'fa477fe100');
oneTurn('131008.0',                 'fa47ffe000');
oneTurn('-5.960464477539062e-8',    'fbbe6fffffffffffff');
oneTurn('-5.960464477539063e-8',    'f98001');
oneTurn('-5.960464477539064e-8',    'fbbe70000000000001');
oneTurn('-5.960465188081798e-8',    'fab3800001');
oneTurn('-5.963374860584736e-8',    'fab3801000');
oneTurn('-5.966285243630409e-8',    'fab3802000');
oneTurn('-8.940696716308594e-8',    'fab3c00000');
oneTurn('-0.00006097555160522461',  'f983ff');
oneTurn('-0.000060975551605224616', 'fbbf0ff80000000001');
oneTurn('-0.000060975555243203416', 'fab87fc001');
oneTurn('0.00006103515625',         'f90400');
oneTurn('0.00006103515625005551',   'fb3f10000000001000');
oneTurn('1.4012984643248169e-45',   'fb369fffffffffffff');
oneTurn('1.401298464324817e-45',    'fa00000001');
oneTurn('1.4012984643248174e-45',   'fb36a0000000000001');
oneTurn('1.4012986313726115e-45',   'fb36a0000020000000');
oneTurn('1.1754942106924411e-38',   'fa007fffff');
oneTurn('3.4028234663852886e+38',   'fa7f7fffff');
oneTurn('3.402823466385289e+38',    'fb47efffffe0000001');
oneTurn('0.00006109476089477539',   'f90401');
oneTurn('7.52316384526264e-37',     'fa03800000');
oneTurn('1.1754943508222875e-38',   'fa00800000');
oneTurn('5.0e-324',                 'fb0000000000000001');
oneTurn('-1.7976931348623157e+308', 'fbffefffffffffffff');

oneNanWithPayloadTurn("7e00");
oneNanWithPayloadTurn("7c01");
oneNanWithPayloadTurn("fc01");
oneNanWithPayloadTurn("7fff");
oneNanWithPayloadTurn("fe00");

oneNanWithPayloadTurn("7fc00000");
oneNanWithPayloadTurn("7f800001");
oneNanWithPayloadTurn("ff800001");
oneNanWithPayloadTurn("7fffffff");
oneNanWithPayloadTurn("ffc00000");

oneNanWithPayloadTurn("7ff8000000000000");
oneNanWithPayloadTurn("7ff0000000000001");
oneNanWithPayloadTurn("fff0000000000001");
oneNanWithPayloadTurn("7fffffffffffffff");
oneNanWithPayloadTurn("fff8000000000000");

success();
