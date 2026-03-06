// Testing exceptions
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success, checkException } from './assertions.js';

try {
    CBOR.decode(new Uint8Array([0xff]));
    fail("Should not")
} catch (e) {
    if (e instanceof CBOR.Exception) {
        checkException(e, "Unsupported tag: ff");
    } else fail("Unexpected exception");
}

success();