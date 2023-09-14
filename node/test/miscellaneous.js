// miscellaneous tests
import CBOR from '../../npm/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

let bin = new Uint8Array([0xa5, 0x01, 0xd9, 0x01, 0xf4, 0x81, 0x18, 0x2d, 0x02, 0xf9, 0x80, 0x10,
                          0x04, 0x64, 0x53, 0x75, 0x72, 0x65, 0x05, 0xa2, 0x08, 0x69, 0x59, 0x65,
                          0x0a, 0x01, 0x61, 0x68, 0xe2, 0x82, 0xac, 0x09, 0x85, 0x66, 0x42, 0x79,
                          0x74, 0x65, 0x73, 0x21, 0x45, 0x01, 0x02, 0x03, 0x04, 0x05, 0xf5, 0xf4,
                          0xf6, 0x06, 0xc2, 0x4b, 0x66, 0x1e, 0xfd, 0xf2, 0xe3, 0xb1, 0x9f, 0x7c, 
                          0x04, 0x5f, 0x15]);

let cbor = CBOR.Map()
               .set(CBOR.Int(5),
                    CBOR.Map()
                        .set(CBOR.Int(8), CBOR.String("Ye\n\u0001ah€"))
                        .set(CBOR.Int(9),
                             CBOR.Array()
                                 .add(CBOR.String("Bytes!"))
                                 .add(CBOR.Bytes(new Uint8Array([1,2,3,4,5])))
                                 .add(CBOR.Boolean(true))
                                 .add(CBOR.Boolean(false))
                                 .add(CBOR.Null())))
               .set(CBOR.Int(4), CBOR.String("Sure"))
               .set(CBOR.Int(2), CBOR.Float(-9.5367431640625e-7))
               .set(CBOR.Int(6), CBOR.BigInt(123456789123456789123456789n))
               .set(CBOR.Int(1), CBOR.Tag(500n, CBOR.Array().add(CBOR.Int(45)))).encode();
assertFalse("cmp1", CBOR.compareArrays(bin, cbor));
let array = CBOR.decode(cbor).get(CBOR.Int(5)).get(CBOR.Int(9));
assertTrue("bool1", array.get(2).getBoolean());
assertFalse("bool1", array.get(3).getBoolean());
assertFalse("null1", array.get(3).isNull());
assertTrue("null2", array.get(4).isNull());
assertFalse("cmp2", CBOR.compareArrays(CBOR.diagDecode(CBOR.decode(cbor).toString()).encode(), bin));

success();
