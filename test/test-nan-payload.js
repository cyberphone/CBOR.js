// Test program for verifying NaN with payload support

function oneNanWithPayloadTurn(hex) {
  let bin = BigInt("0x" + hex);

  let buffer = new Uint8Array(8);
  for (let q = 8; --q >= 0;) {
    buffer[q] = Number(bin & 0xffn);
    bin >>= 8n;
  }
  let value = new DataView(buffer.buffer, 0, 8).getFloat64(0, false);
  let u8 = new Uint8Array(8);
  new DataView(u8.buffer, 0, 8).setFloat64(0, value, false);

  let ok = true;
  for (let q = 0; q < 8; q++) {
    if (buffer[q] != u8[q]) {
      ok = false;
    }
  }
  console.log("ok=" + ok + " hex=" + hex + " read=" + u8);
}

oneNanWithPayloadTurn("7ff8000000000000");
oneNanWithPayloadTurn("7ff0000000000001");
oneNanWithPayloadTurn("fff0000000000001");
oneNanWithPayloadTurn("7fffffffffffffff");
oneNanWithPayloadTurn("fff8000000000000");