// transforms.js 
import CBOR from '../node-cbor.js';
import { assertTrue, assertFalse } from './assertions.js';

const THREE = "three";

let map = CBOR.Map()
              .set(CBOR.Int(3), CBOR.String("three"))
              .set(CBOR.Int(4), CBOR.String("four"));
map.getKeys().forEach(element => console.log(element.toString()));
console.log(map.get(CBOR.Int(4)).toString());
console.log("size=" + map.line);
console.log(map.remove(CBOR.Int(4)).toString());
console.log(map.containsKey(CBOR.Int(3)));
console.log(map.containsKey(CBOR.Int(4)));
console.log(map.getConditionally(CBOR.Int(3), CBOR.String("k3")).getString());
console.log(map.getConditionally(CBOR.Int(4), CBOR.String("k4")).getString());
console.log(map.toString());
let array = CBOR.Array().add(CBOR.Int(3)).add(CBOR.String("stringo"));
console.log(array.get(1).toString());
console.log(array.toArray().length);
console.log(map.get(CBOR.Int(3)).equals(CBOR.Int(5)));
console.log(map.get(CBOR.Int(3)).equals(CBOR.String("three")));
console.log(map.get(CBOR.Int(3)).equals(null));
console.log(map.get(CBOR.Int(3)).equals("three"));
console.log("size=" + map.length);