// Testing the "checkForUnread()" feature
import CBOR from '../npm/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

function oneTurn(create, access, ok) {
  let res = eval(create);
  try {
    res.checkForUnread();
    throw Error("no way");
  } catch (error) {
    if (!error.toString().includes('never read')) {
      throw error;
    }
  }
  try {
    eval(access);
    res.checkForUnread();
    assertTrue("cfu1", ok);
  } catch (error) {
    if (!error.toString().includes('never read')) {
      throw error;
    }
    assertFalse("cfu2", ok);
  }
  res.scan().checkForUnread();
  res = CBOR.decode(res.encode());
  try {
    eval(access);
    res.checkForUnread();
    assertTrue("cfu3", ok);
  } catch (error) {
    if (!error.toString().includes('never read')) {
      throw error;
    }
    assertFalse("cfu4", ok);
  }
  res.scan().checkForUnread();
}

oneTurn("CBOR.Array().add(CBOR.Map().set(CBOR.Int(1), CBOR.String('hi')))",
        "res",
        false);

oneTurn("CBOR.Array().add(CBOR.Map().set(CBOR.Int(1), CBOR.String('hi')))",
        // Missing getArray()
        "res.get(0).getMap().get(CBOR.Int(1)).getString()",
        false);

oneTurn("CBOR.Array().add(CBOR.Map().set(CBOR.Int(1), CBOR.String('hi')))",
        // Missing getMap()
        "res.getArray().get(0).get(CBOR.Int(1)).getString()",
        false);

oneTurn("CBOR.Array().add(CBOR.Map().set(CBOR.Int(1), CBOR.String('hi')))",
        "res.getArray().get(0).getMap().get(CBOR.Int(1)).getString()",
        true);

oneTurn("CBOR.Tag(8n, CBOR.Map().set(CBOR.Int(1), CBOR.String('hi')))",
        "res.getTag().getTaggedObject().getMap().get(CBOR.Int(1)).getString()",
        true);

oneTurn("CBOR.Tag(8n, CBOR.Map().set(CBOR.Int(1), CBOR.String('hi')))",
        // Missing getTag()
        "res.getTaggedObject().getMap().get(CBOR.Int(1)).getString()",
        false);

oneTurn("CBOR.Int(1)",
        "res.getInt()",
        true);
success();
