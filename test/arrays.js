// Testing array operations
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success, fail } from './assertions.js';

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
assertTrue("upd-4", array.insert(array.length, CBOR.Int(-8)) == array);
assertTrue("upd-5", array.get(array.length - 1).equals(CBOR.Int(-8)));
assertTrue("upd-4", array.insert(0, CBOR.Int(-9)) == array);
assertTrue("upd-5", array.get(0).equals(CBOR.Int(-9)));
let l = array.length;
assertTrue("upd-6", array.remove(0).equals(CBOR.Int(-9)));
assertTrue("upd-7", l == array.length + 1);
assertTrue("upd-8", array.get(0).getString() == "three");
assertTrue("upd-9", array.toDiagnostic(false) == '["three",1,-8]');

function aBadOne(expression) {
  try {
    eval("array." + expression);
    fail("Should not pass");
  } catch (Error) {
  }
}

aBadOne("get('string')")
aBadOne("get(array.length)");
aBadOne("get(-1)");
aBadOne("insert(array.length + 1, CBOR.Int(6))");
aBadOne("insert(array.length)");
aBadOne("remove(array.length)");
aBadOne("remove(array.length - 1, 'hi')");
aBadOne("get(0, 6)");

success();
