// Testing the "checkForUnread()" feature
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

function oneTurn(create, access, errorString) {
  let res = eval(create);
  try {
    res.checkForUnread();
    if (errorString !== null) {
      throw Error("no way");      
    }
  } catch (error) {
    if (!error.toString().includes('never read')) {
      throw error;
    }
  }
  try {
    eval(access);
    res.checkForUnread();
    assertFalse("cfu1", errorString);
  } catch (error) {
    assertTrue("cfu2=" + error, errorString);
    if (!error.toString().includes(errorString)) {
      throw error;
    }
  }
  eval(create).scan().checkForUnread();
}

oneTurn("CBOR.Array().add(CBOR.Map().set(CBOR.Int(1), CBOR.String('hi')))",
        "res.get(0).get(CBOR.Int(1)).getString()");

oneTurn("CBOR.Array().add(CBOR.Map().set(CBOR.Int(1), CBOR.String('hi')))",
        "res",
        "Map key 1 with argument of type=CBOR.String with value=\"hi\" was never read");

oneTurn("CBOR.Array().add(CBOR.Map().set(CBOR.Int(1), CBOR.String('hi')))",
        "res.get(0).get(CBOR.Int(1))",
        "Map key 1 with argument of type=CBOR.String with value=\"hi\" was never read");

oneTurn("CBOR.Array().add(CBOR.Map())",
        "res",
        "Array element of type=CBOR.Map with value={} was never read");

// Empty Map => nothing to read
oneTurn("CBOR.Array().add(CBOR.Map())",
        "res.get(0)",
        null);

// Empty Array => nothing to read
oneTurn("CBOR.Array()",
        "res",
        null);

oneTurn("CBOR.Tag(8n, CBOR.Map().set(CBOR.Int(1), CBOR.String('hi')))",
        "res.get().get(CBOR.Int(1)).getString()");

oneTurn("CBOR.Tag(8n, CBOR.Map().set(CBOR.Int(1), CBOR.String('hi')))",
        "res.get()",
        "Map key 1 with argument of type=CBOR.String with value=\"hi\" was never read");

oneTurn("CBOR.Tag(8n, CBOR.Map())",
        "res.get()",
        null);

// Date time specials
oneTurn("CBOR.Tag(0n, CBOR.String(\"2025-02-20T14:09:08Z\"))",
        "res.get()",
        "Tagged object 0 of type=CBOR.String with value=\"2025-02-20T14:09:08Z\" was never read");

oneTurn("CBOR.Tag(0n, CBOR.String(\"2025-02-20T14:09:08Z\"))",
        "res.get().getString()",
        null);

oneTurn("CBOR.Tag(8n, CBOR.Int(2))",
        "res.get()",
        "Tagged object 8 of type=CBOR.Int with value=2 was never read");  

oneTurn("CBOR.Int(1)",
        "res.getInt()");
success();
