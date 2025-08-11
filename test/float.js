// Test program for floating-point "edge cases"
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, fail, success } from './assertions.js';

function overflow(decodedValue, length) {
  let test = 'decodedValue.getFloat' + length + '()';
  try {
    eval(test);
    assertTrue("Should fail", false);
  } catch (error) {
    if (!error.toString().includes('Value out of range:')) {
      throw error;
    }
  }  
}

function shouldpass(decodedValue, value, length, valueText) {
  assertTrue("p1", decodedValue.toString() == valueText);
  let test = 'decodedValue.getFloat' + length + '()';
  let float = eval(test);
  assertTrue("p2", float == value);
}

function oneTurn(valueText, expected) {
  let value = Number(valueText);
  if (Number.isFinite(value)) {
    try {
      CBOR.NonFinite(value);
      fail("f1")
    } catch (error) {
      assertTrue("f2", error.toString().includes("bigint"));
    }
    let cbor = CBOR.Float(value).encode();
    assertTrue("f3", CBOR.toHex(cbor) == expected);
    let decodedValue = CBOR.decode(cbor);
    switch (cbor.length) {
      case 3:
        shouldpass(decodedValue, value, "16", valueText);
        shouldpass(decodedValue, value, "32", valueText);
        shouldpass(decodedValue, value, "64", valueText);
        break;

      case 5:
        shouldpass(decodedValue, value, "32", valueText);
        shouldpass(decodedValue, value, "64", valueText);
        overflow(decodedValue, "16");
        break;

      case 9:
        shouldpass(decodedValue, value, "64", valueText);
        overflow(decodedValue, "16");
        overflow(decodedValue, "32");
        break;

      default:
        fail("No such length");
    }
  } else {
    try {
      CBOR.Float(value);
      fail('Should not execute');
    } catch (error) {
        assertTrue("nf1", error.toString().includes('CBOR.NonFinite'));
    }
    let decodedValue = CBOR.createCombinedFloat(value);
    assertTrue("nf2", decodedValue.getCombinedFloat64().toString() == value.toString());
    assertTrue("nf3", decodedValue.toString() == value.toString());
    let cbor = decodedValue.encode();
    assertTrue("nf4", CBOR.toHex(cbor) == expected);
    assertTrue("nf5", CBOR.decode(cbor).equals(decodedValue));
    let buf = new Uint8Array(8);
    new DataView(buf.buffer, 0, 8).setFloat64(0, value, false);
    assertTrue("nf6", decodedValue.getNonFinite64() == CBOR.toBigInt(buf));
  }
  assertTrue("d10", CBOR.toHex(CBOR.createCombinedFloat(value).encode()) == expected);
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

function oneNonFiniteTurn(value, binexpect, textexpect) {
  let nonfinite = CBOR.NonFinite(value);
  let text = nonfinite.toString();
  let returnValue = nonfinite.getNonFinite();
  let returnValue64 = nonfinite.getNonFinite64();
  let textdecode = CBOR.diagDecode(textexpect);
  let cbor = nonfinite.encode();
  let refcbor = CBOR.fromHex(binexpect);
  let hexbin = CBOR.toHex(cbor);
  assertTrue("eq1", text == textexpect);
  assertTrue("eq2", hexbin == binexpect);
  assertTrue("eq3", returnValue == CBOR.decode(cbor).getNonFinite());
  assertTrue("eq4", returnValue == textdecode.getNonFinite());
  assertTrue("eq5", CBOR.fromBigInt(returnValue).length == nonfinite.length);
  assertTrue("eq7", CBOR.fromBigInt(returnValue64).length == 8);
  assertTrue("eq8", nonfinite.equals(CBOR.decode(cbor)));
  let rawcbor = CBOR.fromBigInt(value);
  rawcbor = CBOR.addArrays(new Uint8Array([0xf9 + (rawcbor.length >> 2)]), rawcbor);
  if (rawcbor.length > refcbor.length) {
    try {
      CBOR.decode(rawcbor);
      fail("d1");
    } catch(error) {
      assertTrue("d2", error.toString().includes("Non-deterministic"));
    }
  } else {
    CBOR.decode(rawcbor);
  }
  assertTrue("d3", CBOR.initDecoder(rawcbor, CBOR.LENIENT_NUMBER_DECODING)
    .decodeWithOptions().equals(nonfinite));
  let object = CBOR.decode(refcbor);
  if (textexpect.includes("NaN") || textexpect.includes("Infinity")) {
    assertTrue("d4", object.getCombinedFloat64().toString() == textexpect);
    assertTrue("d5", object.isBasic(true));
    assertTrue("d6", textexpect.includes("Infinity") ^ object.isBasic(false));
  } else {
    try {
      object.getCombinedFloat64();
      fail("d7");
    } catch (error) {
      assertTrue("d8", error.toString().includes("7e00"));
    }
    assertFalse("d9", object.isBasic(true));
  }
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

oneNonFiniteTurn(0x7e00n,             "f97e00",             "NaN");
oneNonFiniteTurn(0x7c01n,             "f97c01",             "float'7c01'");
oneNonFiniteTurn(0xfc01n,             "f9fc01",             "float'fc01'");
oneNonFiniteTurn(0x7fffn,             "f97fff",             "float'7fff'");
oneNonFiniteTurn(0xfe00n,             "f9fe00",             "float'fe00'");
oneNonFiniteTurn(0x7c00n,             "f97c00",             "Infinity");
oneNonFiniteTurn(0xfc00n,             "f9fc00",             "-Infinity");

oneNonFiniteTurn(0x7fc00000n,         "f97e00",             "NaN");
oneNonFiniteTurn(0x7f800001n,         "fa7f800001",         "float'7f800001'");
oneNonFiniteTurn(0xff800001n,         "faff800001",         "float'ff800001'");
oneNonFiniteTurn(0x7fffffffn,         "fa7fffffff",         "float'7fffffff'");
oneNonFiniteTurn(0xffc00000n,         "f9fe00",             "float'fe00'");
oneNonFiniteTurn(0x7f800000n,         "f97c00",             "Infinity");
oneNonFiniteTurn(0xff800000n,         "f9fc00",             "-Infinity");

oneNonFiniteTurn(0x7ff8000000000000n, "f97e00", "NaN");
oneNonFiniteTurn(0x7ff0000000000001n, "fb7ff0000000000001", "float'7ff0000000000001'");
oneNonFiniteTurn(0xfff0000000000001n, "fbfff0000000000001", "float'fff0000000000001'");
oneNonFiniteTurn(0x7fffffffffffffffn, "fb7fffffffffffffff", "float'7fffffffffffffff'");
oneNonFiniteTurn(0x7ff0000020000000n, "fa7f800001",         "float'7f800001'");
oneNonFiniteTurn(0xfff0000020000000n, "faff800001",         "float'ff800001'");
oneNonFiniteTurn(0xfff8000000000000n, "f9fe00",             "float'fe00'");
oneNonFiniteTurn(0x7ff0040000000000n, "f97c01",             "float'7c01'");
oneNonFiniteTurn(0x7ff0000000000000n, "f97c00",             "Infinity");
oneNonFiniteTurn(0xfff0000000000000n, "f9fc00",             "-Infinity");

success();
