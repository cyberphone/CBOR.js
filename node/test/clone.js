// Testing the "clone()" and "equals() methods
import CBOR from '../node-cbor.js';
import { assertTrue, assertFalse, success } from './assertions.js';

let object = CBOR.Map()
                 .set(CBOR.Int(2), CBOR.Array()
                                       .add(CBOR.Bool(false)));
assertTrue("clone+equals", object.equals(object.clone()));
let copy = object.clone().set(CBOR.Int(1), CBOR.String("Hi"));
assertFalse("copy+equals+clone", copy.equals(object));

success();
