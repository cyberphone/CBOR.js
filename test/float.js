// Test program for floating point "edge cases"
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, fail, success } from './assertions.js';

function oneTurn(valueText, expected, invalidFloats) {
  let decoder = CBOR.initExtended(CBOR.fromHex(expected)).setNaNSupport(false);
  let value = Number(valueText);
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
  if (valueText != 'NaN' &&
      ((decodedValue.length <= 4 && decodedValue.getFloat32() != value) || 
       (decodedValue.getFloat64() != value))) {
    throw Error("Failed decoding: " + value);
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
    decoder.decodeExtended();
    assertFalse('Should not execute', invalidFloats);
  } catch (error) {
    assertTrue("Decode ME1", error.toString().includes('"NaN" and "Infinity"'));
  }
}
oneTurn('0.0',                      'f90000');
oneTurn('-0.0',                     'f98000');
oneTurn('NaN',                      'f97e00', true);
oneTurn('Infinity',                 'f97c00', true);
oneTurn('-Infinity',                'f9fc00', true);
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
success();
