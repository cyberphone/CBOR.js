// Testing the B64U/B64 converters
import CBOR from '../node-cbor.js';
import { assertTrue, assertFalse } from './assertions.js';

let bin = new Uint8Array(256);
for (let i = 0; i < bin.length; i++) {
  bin[i] = i;
}
let b64U = CBOR.toBase64Url(bin);

// This is what "btoa" return for bin:
let b64 = 'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissL\
S4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY\
2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYm\
ZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz\
9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==';
assertFalse("cmp1", CBOR.compareArrays(bin, CBOR.fromBase64Url(b64U)));

// fromBase64Url is "lenient" and takes Base64 as well...
assertFalse("cmp2", CBOR.compareArrays(bin, CBOR.fromBase64Url(b64)));
assertFalse("cmp3", CBOR.compareArrays(CBOR.fromBase64Url('oQVkZGF0YQ'), 
                                       CBOR.fromHex('a1056464617461')));
console.log("SUCCESSFUL");