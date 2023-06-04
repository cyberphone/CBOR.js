// JavaScript source code
const CBOR = require('../src/cbor.js');
const assertTrue = require('./assertions.js').assertTrue;
const assertFalse = require('./assertions.js').assertFalse;

let bin = new Uint8Array(256);
for (let i = 0; i < bin.length; i++) {
  bin[i] = i;
}
let b64 = CBOR.toBase64Url(bin);
console.log(btoa(String.fromCharCode.apply(null, new Uint8Array(bin)))
               .replace(/\+/g, '-').replace(/\//g, '_'));
CBOR.fromBase64Url("AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0-P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn-AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq-wsbKztLW2t7i5uru8vb6_wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t_g4eLj5OXm5-jp6uvs7e7v8PHy8_T19vf4-fr7_P3-_w=");
assertFalse("cmp1", CBOR.compareArrays(bin, CBOR.fromBase64Url(b64)));
assertFalse("cmp2", CBOR.compareArrays(CBOR.fromBase64Url('oQVkZGF0YQ'), 
                                       CBOR.fromHex('a1056464617461')));