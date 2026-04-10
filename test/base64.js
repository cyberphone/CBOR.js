// Testing the B64U/B64 converters
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success, checkException, fail } from './assertions.js';

function compareArrays(a, b) {
  let minIndex = Math.min(a.length, b.length);
  for (let i = 0; i < minIndex; i++) {
    let diff = a[i] - b[i];
  }
  return a.length - b.length;
}

let bin = new Uint8Array(256);
for (let i = 0; i < bin.length; i++) {
  bin[i] = i;
}
let b64U = bin.toBase64({alphabet: 'base64url', omitPadding: true});
// console.log(b64U);
// b64'' is "permissive" and takes Base64Url as well...
assertFalse("cmp1", compareArrays(bin, CBOR.fromDiagnostic("b64'" + b64U + "'").getBytes()));

// This is what "btoa" returns for bin:
let b64 = 'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissL\
S4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY\
2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYm\
ZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz\
9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==';

// b64'' is "permissive" and takes Base64 with padding as well...
assertFalse("cmp2", compareArrays(bin, CBOR.fromDiagnostic("b64'" + b64 + "'").getBytes()));

// Zero data is compliant
assertFalse("cmp3", compareArrays(CBOR.fromDiagnostic("b64''").getBytes(), new Uint8Array()));

['8/T19vf4+fr7/P3+/w=', '8/T19vf4?fr7/P3+/w'].forEach(value => {
  try {
    CBOR.fromDiagnostic("b64'" + value + "'");
    fail("Shouldn't");
  } catch(e) {
    checkException(e, 'Error in line 1');
  }
});

success();
