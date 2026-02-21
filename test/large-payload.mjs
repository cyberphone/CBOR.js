// Test program for integer "edge cases"
import CBOR from '../npm/mjs/index.mjs';
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
    //////////////////////////////////////////////////////
    // The code for writing to a file would reside here //
    ////////////////////////////////////////////////////// 
  }

  return reader.read(new Uint8Array(value.buffer))
               .then(processBytes);
});