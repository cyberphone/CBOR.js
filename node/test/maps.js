// Testing map operations
import CBOR from '../npm/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

let map = CBOR.Map()
              .set(CBOR.Int(3), CBOR.String("three"))
              .set(CBOR.Int(4), CBOR.String("four"));
assertTrue("size-0", map.length == 2);
let keys = map.getKeys();
assertTrue("size-1", keys.length == 2);
assertTrue("get-0", map.get(keys[0]).getString() == "three");
assertTrue("get-1", map.get(keys[1]).getString() == "four");

assertTrue("rem-0", map.remove(CBOR.Int(4)).getString() == "four");
assertTrue("size-2", map.length == 1);
assertTrue("avail-0", map.containsKey(CBOR.Int(3)));
assertFalse("avail-1", map.containsKey(CBOR.Int(4)));
assertTrue("cond-0", map.getConditionally(CBOR.Int(3), CBOR.String("k3")).getString() == "three");
assertTrue("cond-1", map.getConditionally(CBOR.Int(4), CBOR.String("k4")).getString() == "k4");

success();
