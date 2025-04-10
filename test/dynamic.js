// dynamic tests
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, success } from './assertions.js';

assertTrue("dyn", CBOR.Map().setDynamic(wr => 
    wr.set(CBOR.Int(1), CBOR.Boolean(true))).get(CBOR.Int(1)).getBoolean());

let option = "on";
assertTrue("dyn", CBOR.Map().setDynamic(wr => {
    if (option) {
        wr.set(CBOR.Int(1), CBOR.String(option));
    }
    return wr;
}).get(CBOR.Int(1)).getString() == option);

function lambda(wr) {
    wr.set(CBOR.Int(1), CBOR.Boolean(true));
    return wr;
}
assertTrue("dyn", CBOR.Map().setDynamic(lambda).get(CBOR.Int(1)).getBoolean());

success();
