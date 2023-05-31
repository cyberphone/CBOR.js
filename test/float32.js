// JavaScript source code
const CBOR = require('../src/cbor.js');
 
float32 = 0;
float16 = 0;
runs = 0;
    
function convert(i) {
  try {
    let f32bytes = new Uint8Array(4);
    for (let q = 3; q >= 0; q--) {
      f32bytes[q] = i;
      i = (i / 256).toFixed();
    }
    const f32buffer = new ArrayBuffer(4);
    new Uint8Array(f32buffer).set(f32bytes);
    let d = new DataView(f32buffer).getFloat32(0, false);
    let cbor = CBOR.Float(d).encode();
    switch (cbor.length) {
        case 3:
            float16++;
            break;
        case 5:
            float32++;
            break;
        default:
            throw Error("BUG");
    }
    let v = CBOR.decode(cbor).getFloat();
    let status = false;
    if (Number.isNaN(d)) {
      status = !Number.isNaN(v);
    } else if (!Number.isFinite(d)) {
      status = Number.isFinite(v);
    } else if (Math.abs(d) == 0) {
      status = Object.is(d,-0) != Object.is(v,-0);
    } else {
      status = d != v;
    }
    if (status) {
        throw Error("Fail" + v + " " + d);
    }
    if ((++runs % 1000000) == 0) {
        console.log(" 16=" + float16 + " 32=" + float32);
    }
  } catch (error) {
    console.log("**********=" + i + " e=" + error);
   }

}
    
let f = 0;
while (f < 0x800000) {
  let e = 0;
  while (e < 0x100) {
    convert((e * 0x800000) + f);
    e++;
  }
  f++;
}
System.out.println("Runs=" + Long.toString(runs));
