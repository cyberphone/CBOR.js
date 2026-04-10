// Demo for documentation purposes
import CBOR from '../npm/mjs/index.mjs';

//////////////////////////////
//        Encoding          //
//////////////////////////////
const TEMPERATURE_KEY = CBOR.Int(1);
const GREETINGS_KEY = CBOR.Int(2);

let cbor = CBOR.Map()
               .set(TEMPERATURE_KEY, CBOR.Float(45.7))
               .set(GREETINGS_KEY, CBOR.String("Hi there!")).encode();

console.log((cbor.toHex());

//////////////////////////////
//        Decoding          //
//////////////////////////////
let map = CBOR.decode(cbor);  // cbor: from the encoding example
console.log(map.toString());  // Diagnostic notation

console.log('Value=' + map.get(TEMPERATURE_KEY).getFloat64());

/////////////////////////////////
//  Using Diagnostic Notation  //
/////////////////////////////////
cbor = CBOR.fromDiagnostic(`{
# Comments are also permitted
  1: 45.7,
  2: "Hi there!"
}`).encode();

console.log((cbor.toHex());

