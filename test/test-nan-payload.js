// Test program for verifying NaN with payload support

const nanWithPayload = new Uint8Array([0x7f, 0xf8, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00]);

let value = new DataView(nanWithPayload.buffer, 0, 8).getFloat64(0, false);
    
let u8 = new Uint8Array(8);
new DataView(u8.buffer, 0, 8).setFloat64(0, value, false);

for (let q = 0; q < 8; q++) {
  if (nanWithPayload[q] != u8[q]) {
    console.log(u8.toString());
    throw "Did not work";
  }
}