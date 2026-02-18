# Application note: Combining CBOR and Large Files
This note shows how you can combine CBOR with large files without embedding the files in CBOR.  The primary goal is to use as little RAM as possible.

The sample builds on using a CBOR sequence permitting succeeding data to be non-CBOR as outlined in 
[CBOR::Core](https://www.ietf.org/archive/id/draft-rundgren-cbor-core-25.html).

CBOR file in diagnostic notation:
```cbor
# Minimalist document metadata
{
  "file": "shanty-the-cat.jpg",
  "sha256": h'08d1440f4bf1e12b6e6815eaa636a573f1cac6d046a8bd517c32e22b6df0ec96'
}
```
Encoded, this is furnished in the file `metadata.cbor`

The concatnation of `metadata.cbor` and `shanty-the-cat.jpg` is subsequently stored in a file called `payload.bin`:
```
|--------------------|
|   CBOR meta-data   |
|--------------------|
|   attached file    |
|--------------------|
```

The sample code below shows how `payload.bin` could be processed by a receiver:
```javascript
// largefile.mjs

import CBOR from 'cbor-core';
const crypto = await import('node:crypto');

const FILE_KEY = CBOR.String("file");
const SHA256_KEY = CBOR.String("sha256");
const BYOB_LENGTH = 1000;
const CBOR_MAX_LENGTH = 500;
const hashFunction = crypto.createHash('sha256');

const response = await fetch('https://cyberphone.github.io/CBOR.js/doc/app-notes/large-payloads/payload.bin');
if (!response.ok) {
  throw new Error("Failed request, status=" + response.status);
}
const reader = response.body.getReader({ mode: "byob" });

// read the response
let byobBuffer = new ArrayBuffer(BYOB_LENGTH);
let metaData = null;
let cborBuffer;
let fileSze = 0;
let outputBuffer = null;

reader.read(new Uint8Array(byobBuffer))
      .then(function processBytes({ done, value }) {

  if (done) {
    let sha256 = hashFunction.digest();
    if (CBOR.compareArrays(metaData.get(SHA256_KEY).getBytes(), sha256)) {
      throw new Error("Failed on SHA256");
    }
    console.log(`Successfully received: ${metaData.get(FILE_KEY).getString()} (${fileSze})`);
    return;
  }

  // Have we already processed CBOR?
  if (metaData) {
    outputBuffer = Buffer.from(value);
  } else {
    // No, but we may still lack some needed input.
    if (cborBuffer) {
      cborBuffer = Buffer.concat([cborBuffer, Buffer.from(value)]);
    } else {
      cborBuffer = Buffer.from(value);
    }
    if (cborBuffer.length > CBOR_MAX_LENGTH) {
      // The buffer is now sufficient for our meta-data.
      let decoder = CBOR.initDecoder(cborBuffer, CBOR.SEQUENCE_MODE);
      metaData = decoder.decodeWithOptions();
      let bc = decoder.getByteCount();

      // The part of the buffer that is not CBOR holds the beginning of the attached file.
      outputBuffer = Buffer.copyBytesFrom(cborBuffer, bc, cborBuffer.length - bc);
    }
  }
  if (outputBuffer) {
    fileSze += outputBuffer.length;
    hashFunction.update(outputBuffer);
    /////////////////////////////////////////////////////
    // Store the chunk in an application-specific way. //
    /////////////////////////////////////////////////////
  }

  return reader.read(new Uint8Array(value.buffer))
               .then(processBytes);
});
```
If all is good the result should be:
```
Successfully received: shanty-the-cat.jpg (2239423)
```

## Other solutions
Server-based attachments may also be provided as URLs.
