// JavaScript source code
const CBOR = require('../src/cbor.js');
const assertTrue = require('./assertions.js').assertTrue;
const assertFalse = require('./assertions.js').assertFalse;

let object = CBOR.Map()
                 .set(CBOR.Int(2), CBOR.Array()
                                       .add(CBOR.Bool(false)));
assertTrue("clone+equals", object.equals(object.clone()));
let copy = object.clone().set(CBOR.Int(1), CBOR.String("Hi"));
assertFalse("copy+equals+clone", copy.equals(object));
