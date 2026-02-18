## cbor-core
Core Description: https://github.com/cyberphone/CBOR.js#cborjs

### Nodejs Installation
```code
npm install cbor-core
```

If `cbor-core` is to be installed as a **global** package, perform the following:
```code
npm install cbor-core -g
cd "to local work directory"
npm link cbor-core
```
### Usage in Node.js
The above works for both CJS and MJS (ESM) applications.  MJS example:
```cbor
// test.mjs
import CBOR from 'cbor-core';

let cbor = CBOR.Map()
               .set(CBOR.Int(1), CBOR.Float(45.7))
               .set(CBOR.Int(2), CBOR.String("Hi there!")).encode();

console.log(CBOR.toHex(cbor));
```
### Usage in Browsers
Copy the file https://github.com/cyberphone/CBOR.js/blob/main/src/cbor.js to your application and include it in HTML with the `<script src='...'></script>` tag.

### Release Notes
See file https://cyberphone.github.io/CBOR.js/doc/release-notes.txt

