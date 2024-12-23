// Testing array operations
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

let array = CBOR.Array()
              .add(CBOR.String("three"))
              .add(CBOR.String("four"));
assertTrue("size-0", array.length == 2);
assertTrue("get-0", array.get(0).getString() == "three");
assertTrue("get-1", array.get(1).getString() == "four");
let arrayElements = array.toArray();
assertTrue("size-1", arrayElements.length == 2);
assertTrue("arr-0", arrayElements[0].getString() == "three");
assertTrue("arr-1", arrayElements[1].getString() == "four");
assertTrue("upd-1", array.update(1, CBOR.Int(1)).getString() == "four");
assertTrue("upd-2", array.get(1).getInt8() == 1);
assertTrue("size-1", array.length == 2);
assertTrue("upd-3", array.get(0).getString() == "three");

/*
assertTrue("rem-0", map.remove(CBOR.Int(4)).getString() == "four");
assertTrue("size-2", map.length == 1);
assertTrue("avail-0", map.containsKey(CBOR.Int(3)));
assertFalse("avail-1", map.containsKey(CBOR.Int(4)));
assertTrue("cond-0", map.getConditionally(CBOR.Int(3), CBOR.String("k3")).getString() == "three");
assertTrue("cond-1", map.getConditionally(CBOR.Int(4), CBOR.String("k4")).getString() == "k4");
*/

success();
