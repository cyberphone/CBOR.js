// JavaScript source code
import CBOR from '../npm/mjs/index.mjs';
 
let float32 = 0;
let float16 = 0;
let runs = 0;

function getF32(f32) {
  let b32 = CBOR.fromBigInt(f32);
  while (b32.length < 4) b32 = CBOR.addArrays(new Uint8Array([0]), b32);
  return new DataView(b32.buffer, 0, 4).getFloat32(0, false);
}
    
function convert(f32) {
  let genuine = true;
  let simple = true;
  let cbor = null;
  let nf = null;
  try {
    if ((f32 & 0x7f800000n) == 0x7f800000n) {
        nf = CBOR.NonFinite(f32);
        genuine = false;
        simple = nf.isSimple();
        cbor = nf.encode();
    }
    console.log(CBOR.toHex(CBOR.fromBigInt(f32)) + " V=" + (genuine ? "G" : simple ? "S" : "X"));
    if (simple) {
        cbor = CBOR.Float.createExtendedFloat(getF32(f32)).encode();
    }
    switch (cbor.length) {
        case 3:
            float16++;
            break;
        case 5:
            float32++;
            break;
        default:
            throw new Error("BUG");
    }
    let object = CBOR.decode(cbor);
//    console.log((object instanceof CBOR.Float) + " " + object.toString());
    if (simple) {
      let d = getF32(f32);
      let v = object.getExtendedFloat64();
      if (v.toString() != d.toString()) {
          throw new Error ("Fail");
      }
      if (genuine) {
          v = object.getFloat64();
          if (v.toString() != d.toString()) {
              throw new Error ("Fail2");
          }
      }
    } else {
        if ((((nf.getNonFinite64() >> 29n) ^ f32) & 0x7fffffn) != 0n) {
            throw new Error ("Fail3");
        }
    }
    ++runs;

  } catch (error) {
    console.log("**********=" + f32 + " e=" + error.toString());
    throw error;
  }

}
    
let f = 0n;
while (f < 0x800000) {
  let e = 0n;
  while (e < 0x100000000n) {
//    console.log(CBOR.toHex(CBOR.fromBigInt(f)));
    convert(e + f);
    e += 0x800000n;
  }
  f = f ? f + f : 1n
}
console.log("Runs=" + runs);
