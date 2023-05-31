// JavaScript source code
const CBOR = require('../src/cbor.js');
let cbor = new Uint8Array([0x05, 0xa1, 0x05, 0x42, 0x6a, 0x6a])
try {
  console.log(CBOR.decode(cbor).toString());
  throw Error("API error");
} catch (error) {
  if (!error.toString().includes('Unexpected')) console.log(error);
}
let decoder = CBOR.initExtended(cbor, true, false, false);
let object;
while (object = CBOR.decodeExtended(decoder)) {
  console.log("SO=" + object.toString());
}