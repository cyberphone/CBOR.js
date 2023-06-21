// Test program for floating point "edge cases"
import CBOR from '../node-cbor.js';
import { assertTrue, assertFalse, success } from './assertions.js';

function oneTurn(value, expected) {
  let text = value.toString();
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
  if (CBOR.decode(cbor).getFloat() != value) {
    throw Error("Failed decoding: " + value);
  }
  while (expected.length < 20) {
    expected += ' ';
  }
  if (got.length) {
    throw Error(text + expected + got);
  }
}
oneTurn(6.10649585723877e-5, 'fa38801000');
oneTurn(10.559998512268066, 'fa4128f5c1');
oneTurn(65472.0, 'f97bfe');
oneTurn(65472.00390625, 'fa477fc001');
oneTurn(65503.0, 'fa477fdf00');
oneTurn(65504.0, 'f97bff');
oneTurn(65504.00390625, 'fa477fe001');
oneTurn(65504.5, 'fa477fe080');
oneTurn(65505.0, 'fa477fe100');
oneTurn(131008.0, 'fa47ffe000');
oneTurn(-5.9604644775390625e-8, 'f98001');
oneTurn(-5.960465188081798e-8, 'fab3800001');
oneTurn(-5.960465188081798e-8, 'fab3800001');
oneTurn(-5.963374860584736e-8, 'fab3801000');
oneTurn(-5.966285243630409e-8, 'fab3802000');
oneTurn(-8.940696716308594e-8, 'fab3c00000');
oneTurn(-0.00006097555160522461, 'f983ff');
oneTurn(-0.00006097555160522469, 'fbbf0ff8000000000c');
oneTurn(-0.000060975551605224615, 'fbbf0ff80000000001');
oneTurn(-0.0000609755516052246127, 'f983ff');
oneTurn(-0.0000609755516052246128, 'fbbf0ff80000000001');
oneTurn(0.00006103515625, 'f90400');
oneTurn(0.00006103515625005551, 'fb3f10000000001000');
oneTurn(1.401298464324817e-45, 'fa00000001');
oneTurn(1.1754942106924411e-38, 'fa007fffff');
oneTurn(0.00006109476089477539, 'f90401');
oneTurn(7.52316384526264e-37, 'fa03800000');
oneTurn(1.1754943508222875e-38, 'fa00800000');

success();
