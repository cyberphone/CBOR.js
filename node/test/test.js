// JavaScript source code
import CBOR from '../node-cbor.js';
//console.log (CBOR.hex(CBOR.Array().add(CBOR.String("hi")).encode()));
 console.log (CBOR.Float(4.4).toString());
 console.log (CBOR.toHex(CBOR.BigInt(-0x800000001n).encode()));
 console.log (CBOR.toHex(CBOR.Float(1.401298464324817e-45).encode()));
 console.log (CBOR.toHex(CBOR.Float(3.5).encode()));
 console.log (CBOR.toHex(CBOR.Float(-0.0).encode()));
 console.log (CBOR.toHex(CBOR.Float(-5.9604644775390625e-8).encode()));
 console.log (CBOR.toHex(CBOR.Float(-9.5367431640625e-7).encode()));
 console.log (CBOR.toHex(CBOR.Float(65504.0).encode()));
// console.log (CBOR.Map().toString());
// console.log (CBOR.Map().set(CBOR.Int(4), CBOR.String("Yeah")).toString());
let cbor = CBOR.Map()
               .set(CBOR.Int(5),
                    CBOR.Map()
                        .set(CBOR.Int(8), CBOR.String("Ye\n\u0001ah€"))
                        .set(CBOR.Int(9),
                             CBOR.Array()
                                 .add(CBOR.String("Bytes!"))
                                 .add(CBOR.Bytes(new Uint8Array([1,2,3,4,5])))
                                 .add(CBOR.Bool(true))
                                 .add(CBOR.Bool(false))
                                 .add(CBOR.Null())))
               .set(CBOR.Int(4), CBOR.String("Sure"))
               .set(CBOR.Int(2), CBOR.Float(-9.5367431640625e-7))
               .set(CBOR.Int(6), CBOR.BigInt(123456789123456789123456789n))
               .set(CBOR.Int(1), CBOR.Tag(500, CBOR.Array().add(CBOR.Int(45))));
console.log(cbor.toString());
console.log(CBOR.toHex(cbor.encode()));
