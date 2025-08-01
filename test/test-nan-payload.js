// Test program for verifying NaN with payload support

const nanWithPayload = new Uint8Array([0x7f, 0xf8, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00]);

let f64buffer = new ArrayBuffer(8);
new Uint8Array(f64buffer).set(nanWithPayload);
let value = new DataView(f64buffer).getFloat64(0, false);
    
f64buffer = new ArrayBuffer(8);
new DataView(f64buffer).setFloat64(0, value, false);
const u8 = new Uint8Array(f64buffer);

for (let q = 0; q < 8; q++) {
  if (nanWithPayload[q] != u8[q]) {
    console.log(u8.toString());
    throw "Did not work";
  }
}