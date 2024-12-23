// Testing map operations
import CBOR from '../npm/mjs/index.mjs';
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
map = map.merge(
    CBOR.Map().set(CBOR.Int(1), CBOR.String("hi")).set(CBOR.Int(5), CBOR.String("yeah")));
assertTrue("size-3", map.length == 3);
assertTrue("merge-0", map.get(CBOR.Int(1)).getString() == "hi");
assertTrue("upd-0", map.update(CBOR.Int(1), CBOR.BigInt(-8n), true).getString() == "hi");
assertTrue("upd-1", map.get(CBOR.Int(1)).getBigInt() == -8n);
assertTrue("upd-2", map.update(CBOR.Int(10), CBOR.BigInt(-8n), false) == null);
assertTrue("upd-3", map.get(CBOR.Int(10)).getBigInt() == -8n);

success();
