// Testing unread elements operations
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, fail, assertFalse, success, checkException } from './assertions.js';

function oneTurn(statement, access, message) {
    // console.log(":" + statement);
    let shouldFail = message !== undefined;
    let error = "";
    let res = eval(statement);
    try {
        res.checkForUnread();
        assertTrue(statement, !access && !shouldFail);
    } catch (e) {
        error = e.toString();
        // console.log(statement + " " + error);
        assertTrue(statement, access || shouldFail);
        checkException(e, "never read");
    }
    if (access) {
        try {
            eval("res." + access);
            res.checkForUnread();
            assertFalse(statement, shouldFail);
        } catch (e) {
            error = e.toString();
            // console.log(statement + " " + error);
            assertTrue(statement, shouldFail);
            checkException(e, "never read");
        }
    }
    if (shouldFail && !error.includes(message)) {
        fail("not" + message + error);
    }
}

const MAP_KEY_1 = CBOR.Int(1);
const MAP_KEY_2 = CBOR.Int(2);

oneTurn("CBOR.Array()", null);
oneTurn("CBOR.Map()", null);
oneTurn("CBOR.Tag(45, CBOR.Map())", "get()");

oneTurn("CBOR.Tag(45, CBOR.Map().set(MAP_KEY_1, CBOR.Int(6)))", "get().get(MAP_KEY_1)",
    "Map key 1 with argument Int with value=6 was never read");

oneTurn("CBOR.Tag(45, CBOR.Map().set(MAP_KEY_1, CBOR.Int(6)))", "get().get(MAP_KEY_1).getInt64()");
oneTurn("CBOR.Array().add(CBOR.Tag(45, CBOR.Map()))", "get(0)",
    "Tag object 45 of type Map with value={} was never read");

oneTurn("CBOR.Array().add(CBOR.Tag(45, CBOR.Map()))", "get(0).get()");

oneTurn("CBOR.Array().add(CBOR.Tag(45, CBOR.Int(6)))", "get(0).get()",
    "Tag object 45 of type Int with value=6 was never read");

oneTurn("CBOR.Array().add(CBOR.Tag(45, CBOR.Int(6)))", "get(0).get().getInt64()");

oneTurn("CBOR.Array().add(CBOR.String('Hi!'))", "get(0)",
    "Array element of type String with value=\"Hi!\" was never read");

oneTurn("CBOR.Array().add(CBOR.Int(6))", "get(0).getInt64()");

oneTurn("CBOR.Map().set(MAP_KEY_1, CBOR.Array())", null,
    "Map key 1 with argument Array with value=[] was never read");

oneTurn("CBOR.Map().set(MAP_KEY_1, CBOR.Array())", "get(MAP_KEY_1)");

oneTurn("CBOR.Tag(45, CBOR.Map().set(MAP_KEY_1, CBOR.Int(6)))", "get().get(MAP_KEY_1).getInt64()");

oneTurn("CBOR.Array().add(CBOR.Array())", "get(0)");

oneTurn("CBOR.Array().add(CBOR.Array())", null,
    "Array element of type Array with value=[] was never read");

oneTurn("CBOR.Array().add(CBOR.Array())", "scan()");

oneTurn("CBOR.Int(6)", "getInt64()");

oneTurn("CBOR.Simple(8)", "getSimple()");

// Date time specials
oneTurn("CBOR.Tag(0, CBOR.String(\"2025-02-20T14:09:08Z\"))",
        "get()",
        "Tag object 0 of type String with value=\"2025-02-20T14:09:08Z\" was never read");

oneTurn("CBOR.Tag(0, CBOR.String(\"2025-02-20T14:09:08Z\"))",
        "getDateTime()");

// COTX
oneTurn("CBOR.Tag(1010, CBOR.Array().add(CBOR.String(\"uri\")).add(CBOR.Map()))", "get()",
        "Array element of type Map with value={} was never read");

let res = CBOR.Tag(1010, CBOR.Array().add(CBOR.String("uri")).add(CBOR.Boolean(true)));
assertTrue("String problems", res.cotxId == "uri");
assertTrue("Object problems", res.cotxObject.getBoolean() == true);
res.checkForUnread();

res = CBOR.Tag(1010, CBOR.Array().add(CBOR.String("uri")).add(CBOR.Map()));
assertTrue("String problems", res.cotxId == "uri");
assertTrue("Map problems", res.cotxObject.toDiagnostic(false) == "{}");
res.checkForUnread();

oneTurn("CBOR.Array().add(CBOR.Array())", "scan()");

// a slightly more elaborate example
res = CBOR.Map().set(MAP_KEY_2, CBOR.Array()).set(MAP_KEY_1, CBOR.String("Hi!"));
res.get(MAP_KEY_2).add(CBOR.Int(700));
assertTrue("integer problems", res.get(MAP_KEY_2).get(0).getInt64() == 700);
assertTrue("String problems", res.get(MAP_KEY_1).getString() == "Hi!");
res.checkForUnread(); // all is 

const MAP_KEY_3 = CBOR.Array().add(CBOR.Int(5)).add(CBOR.Map())
oneTurn("CBOR.Map().set(MAP_KEY_3, CBOR.String('Hi!'))", null,
    "Map key [5,{}] with argument String with value=\"Hi!\" was never read")

oneTurn("CBOR.Map().set(MAP_KEY_3, CBOR.String('Hi!'))", "get(MAP_KEY_3).getString()")


success();
