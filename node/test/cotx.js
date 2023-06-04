// JavaScript source code
const CBOR = require('../src/cbor.js');

oneTurn = function(hex, dn) {
  try {
    CBOR.decode(CBOR.fromHex(hex));
    throw Error("Should not fail on: " + dn);
  } catch (error) {
    if (!error.toString().includes("Non-d")) {
      throw error;
    }
  }
  let decoder = CBOR.initExtended(CBOR.fromHex(hex), false, true, false);
  let object = CBOR.decodeExtended(decoder);
  if (object.toString() != dn.toString() || !object.equals(CBOR.decode(object.encode()))) {
    throw Error("non match:" + dn);
  }
  console.log(hex);
}

oneTurn('d903f2623737', '1010("77")');
oneTurn('d903f281623737', '1010(["77"])');
oneTurn('d903f28206623737', '1010([6,"77"])');
oneTurn('d903f28262373707', '1010(["77",7])');


// This one is actually deterministic...
try {
  oneTurn('fa7f7fffff', '3.4028234663852886e+38');
} catch (error) {
  if (!error.toString().includes('Should not')) {
    throw error;
  }
}