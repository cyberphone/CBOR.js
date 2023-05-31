/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
//                             CBOR JavaScript API                             //
//                                                                             //
// Defines a single global object CBOR to (in some way) mimic the JSON object. //
// Determinisic encoding aligned with Appendix A and 4.2.2 Rule 2 of RFC 8949. //
// Author: Anders Rundgren (https://github.com/cyberphone)                     //
/////////////////////////////////////////////////////////////////////////////////

class CBOR {

  // Super class for all CBOR types.
  static #CBORObject = class {

    // Overridden getter in derived classes.
    _get = function() {};

    constructor() {}

    getInt = function() {
      if (this instanceof CBOR.BigInt) {
        // During decoding, integers outside of Number.MAX_SAFE_INTEGER
        // automatically get "BigInt" representation. 
        throw Error("Integer is outside of Number.MAX_SAFE_INTEGER, use getBigInt()");
      }
      return this.#checkTypeAndGetValue(CBOR.Int);
    }

    getString = function() {
      return this.#checkTypeAndGetValue(CBOR.String);
    }

    getBytes = function() {
      return this.#checkTypeAndGetValue(CBOR.Bytes);
    }

    getFloat = function() {
      return this.#checkTypeAndGetValue(CBOR.Float);
    }

    getBool = function() {
      return this.#checkTypeAndGetValue(CBOR.Bool);
    }

    getNull = function() {
      return this instanceof CBOR.Null;
    }

    getBigInt = function() {
      if (this instanceof CBOR.Int) {
        return BigInt(this._get());
      }
      return this.#checkTypeAndGetValue(CBOR.BigInt);
    }

    getArray = function() {
      return this.#checkTypeAndGetValue(CBOR.Array);
    }
 
    getMap = function() {
      return this.#checkTypeAndGetValue(CBOR.Map);
    }
 
    getTag = function() {
      return this.#checkTypeAndGetValue(CBOR.Tag);
    }
 
    #checkTypeAndGetValue = function(className) {
      if (!(this instanceof className)) {
        throw Error("Invalid object for this method: CBOR." + this.constructor.name);
      }
      return this._get();
    }
  }

  static #MT_UNSIGNED     = 0x00;
  static #MT_NEGATIVE     = 0x20;
  static #MT_BYTES        = 0x40;
  static #MT_STRING       = 0x60;
  static #MT_ARRAY        = 0x80;
  static #MT_MAP          = 0xa0;
  static #MT_TAG          = 0xc0;
  static #MT_BIG_UNSIGNED = 0xc2;
  static #MT_BIG_NEGATIVE = 0xc3;
  static #MT_FALSE        = 0xf4;
  static #MT_TRUE         = 0xf5;
  static #MT_NULL         = 0xf6;
  static #MT_FLOAT16      = 0xf9;
  static #MT_FLOAT32      = 0xfa;
  static #MT_FLOAT64      = 0xfb;

  static #RANGES = [0xff, 0xffff, 0xffffffff];

  static #SPECIAL_CHARACTERS = [
 //   0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F
      1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 , 'b', 't', 'n',  1 , 'f', 'r',  1 ,  1 ,
      1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,
      0 ,  0 , '"',  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,
      0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,
      0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,
      0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 , '\\'];

  constructor() {
    throw Error("CBOR cannot be instantiated");
  }

///////////////////////////
//       CBOR.Int        //
///////////////////////////
 
  static Int = class extends CBOR.#CBORObject {

    #int;

    // Note that for integers with a magnitude above 2^53 - 1, "BigInt" must be used. 
    constructor(int) {
      super();
      this.#int = CBOR.#intCheck(int);
    }
    
    encode = function() {
      let tag;
      let n = this.#int;
      if (n < 0) {
        tag = CBOR.#MT_NEGATIVE;
        n = -n - 1;
      } else {
        tag = CBOR.#MT_UNSIGNED;
      }
      return CBOR.#encodeTagAndN(tag, n);
    }

    toString = function() {
      return this.#int.toString();
    }

    _get = function() {
      return this.#int;
    }
  }

///////////////////////////
//     CBOR.BigInt       //
///////////////////////////
 
  static BigInt = class extends CBOR.#CBORObject {

    #bigInt;

    constructor(bigInt) {
      super();
      this.#bigInt = CBOR.#typeCheck(bigInt, 'bigint');
    }
    
    encode = function() {
      let tag;
      let value = this.#bigInt
      if (value < 0) {
        tag = CBOR.#MT_NEGATIVE;
        value = ~value;
      } else {
        tag = CBOR.#MT_UNSIGNED;
      }

      // Somewhat awkward code for converting BigInt to Uint8Array.
      let array = [];
      let temp = BigInt(value);
      do {
        array.push(Number(temp & 255n));
        temp /= 256n;
      } while (temp != 0n);
      let length = array.length;
      // Prepare for "Int" encoding (1, 2, 4, 8).  Only 3, 5, 6, and 7 need an action.
      while (length < 8 && length > 2 && length != 4) {
        array.push(0);
        length++;
      }
      let byteArray = new Uint8Array(array.reverse());

      // Does this value qualify as a "BigInt"?
      if (length <= 8) {
        // Apparently not, encode it as "Int".
        if (length == 1 && byteArray[0] < 24) {
          return new Uint8Array([tag | byteArray[0]]);
        }
        let modifier = 24;
        while (length >>= 1) {
           modifier++;
        }
        return CBOR.#addArrays(new Uint8Array([tag | modifier]), byteArray);
      }
      // True "BigInt".
      return CBOR.#addArrays(new Uint8Array([tag == CBOR.#MT_NEGATIVE ?
                                                CBOR.#MT_BIG_NEGATIVE : CBOR.#MT_BIG_UNSIGNED]), 
                                            new CBOR.Bytes(byteArray).encode());
    }

    toString = function() {
      return this.#bigInt.toString();
    }
 
    _get = function() {
      return this.#bigInt;
    }
  }


///////////////////////////
//      CBOR.Float       //
///////////////////////////
 
  static Float = class extends CBOR.#CBORObject {

    #float;
    #encoded;
    #tag;

    constructor(float) {
      super();
      this.#float = CBOR.#typeCheck(float, 'number');
      // Begin catching the F16 edge cases.
      this.#tag = CBOR.#MT_FLOAT16;
      if (Number.isNaN(float)) {
        this.#encoded = this.#f16Encoding(0x7e00);
      } else if (!Number.isFinite(float)) {
        this.#encoded = this.#f16Encoding(float < 0 ? 0xfc00 : 0x7c00);
      } else if (Math.abs(float) == 0) {
        this.#encoded = this.#f16Encoding(Object.is(float,-0) ? 0x8000 : 0x0000);
      } else {
        // It is apparently a genuine number.
        // The following code depends on that Math.fround works as expected.
        let f32 = Math.fround(float);
        let u8;
        let f32exp;
        let f32signif;
        while (true) {  // "goto" surely beats quirky loop/break/return/flag constructs...
          if (f32 == float) {
            // Nothing was lost during the conversion, F32 or F16 is on the menu.
            this.#tag = CBOR.#MT_FLOAT32;
            u8 = this.#f64Encoding(f32);
            f32exp = ((u8[0] & 0x7f) << 4) + ((u8[1] & 0xf0) >> 4) - 1023 + 127;
            if (u8[4] & 0x1f || u8[5] || u8[6] || u8[7]) {
              console.log(u8.toString());
              throw Error("unexpected fraction: " + f32);
            }
            f32signif = ((u8[1] & 0x0f) << 19) + (u8[2] << 11) + (u8[3] << 3) + (u8[4] >> 5)
  //          if (Math.abs(f32) == 5.960465188081798e-8) console.log("b=" + toBin(u8) + " e=" + (((u8[0] & 0x7f) << 4) + ((u8[1] & 0xf0) >> 4)) + " ec=" + f32exp + " f32signif=" + f32signif + " s=" + ((u8[0] & 0x80) * 16777216));
            if (f32exp <= 0) {
              // The implicit "1" becomes explicit using subnormal representation.
              f32signif += 1 << 23;
              // Always perform at least one turn.
              f32exp--;
              do {
                if ((f32signif & 1) != 0) {
                  throw Error("unexpected offscale: " + f32);
                }
                f32signif >>= 1;
              } while (++f32exp < 0);   
            }
            // If it is a subnormal F32 or if F16 would lose precision, stick to F32.
            if (f32exp == 0 || f32signif & 0x1fff) {
              console.log('@@@ skip ' + (f32exp ? "f32prec" : "f32denorm"));
              break;
            }
            // Arrange for F16.
            let f16exp = f32exp - 127 + 15;
            let f16signif = f32signif >> 13;
            // If too large for F16, stick to F32.
            if (f16exp > 30) {
              console.log("@@@ skip above f16exp=" + f16exp);
              break;
            }
            // Finally, is this value too small for F16?
            if (f16exp <= 0) {
              // The implicit "1" becomes explicit using subnormal representation.
              f16signif += 1 << 10;
              // Always perform at least one turn.
              f16exp--;
              do {
                // Losing bits is not an option.
                if ((f16signif & 1) != 0) {
                  f16signif = 0;
                  console.log("@@@ skip under f16");
                  break;
                }
                f16signif >>= 1;
              } while (++f16exp < 0);
              // If too small for F16, stick to F32.
              if (f16signif == 0) {
                break;
              }
              console.log("@@@ succeeded f16 denorm");
            }
            // 16 bits is all you need.
            this.#tag = CBOR.#MT_FLOAT16;
            let f16bin = 
                // Put sign bit in position.
                ((u8[0] & 0x80) << 8) +
                // Exponent.  Put it in front of significand.
                (f16exp << 10) +
                // Significand.
                f16signif;
                this.#encoded = this.#f16Encoding(f16bin);
          } else {
            // Converting to F32 returned a truncated result. Full 64-bit float is required.
            this.#tag = CBOR.#MT_FLOAT64;
            this.#encoded = this.#f64Encoding(float);
          }
          // Common F16 and F64 return point.
          return;
        }
        // break: 32 bits are apparently needed for maintaining magnitude and precision.
        let f32bin = 
            // Put sign bit in position. Why not << 24?  JS shift doesn't work above 2^31...
            ((u8[0] & 0x80) * 0x1000000) +
            // Exponent.  Put it in front of significand.
            (f32exp << 23) +
            // Significand.
            f32signif;
            this.#encoded = CBOR.#addArrays(this.#f16Encoding(f32bin / 0x10000), 
                                            this.#f16Encoding(f32bin & 0xffff));
      }
    }
    
    encode = function() {
      return CBOR.#addArrays(new Uint8Array([this.#tag]), this.#encoded);
    }

    toString = function() {
      return this.#float.toString();
    }

    _get = function() {
      return this.#float;
    }

    #f16Encoding = function(int16) {
      return new Uint8Array([int16 / 256, int16 % 256]);
    }

    #f64Encoding = function(number) {
      const buffer = new ArrayBuffer(8);
      new DataView(buffer).setFloat64(0, number, false);
      return [].slice.call(new Uint8Array(buffer))
    }
  }

///////////////////////////
//     CBOR.String       //
///////////////////////////
 
  static String = class extends CBOR.#CBORObject {

    #string;

    constructor(string) {
      super();
      this.#string = CBOR.#typeCheck(string, 'string');
    }
    
    encode = function() {
      let utf8 = new TextEncoder().encode(this.#string);
      return CBOR.#addArrays(CBOR.#encodeTagAndN(CBOR.#MT_STRING, utf8.length), utf8);
    }

    toString = function() {
      let buffer = '"';
      for (let q = 0; q < this.#string.length; q++) {
        let c = this.#string.charCodeAt(q);
        if (c <= 0x5c) {
          let convertedCharacter;
          if ((convertedCharacter = CBOR.#SPECIAL_CHARACTERS[c]) != 0) {
            buffer += '\\';
            if (convertedCharacter == 1) {
              buffer += 'u00' + CBOR.#twoHex(c);
            } else {
              buffer += convertedCharacter;
            }
            continue;
          }
        }
        buffer += String.fromCharCode(c);
      }
      return buffer + '"';
    }

    _get = function() {
      return this.#string;
    }
  }

///////////////////////////
//      CBOR.Bytes       //
///////////////////////////
 
  static Bytes = class extends CBOR.#CBORObject {

    #bytes;

    constructor(bytes) {
      super();
      this.#bytes = CBOR.#bytesCheck(bytes);
    }
    
    encode = function() {
      return CBOR.#addArrays(CBOR.#encodeTagAndN(CBOR.#MT_BYTES, this.#bytes.length), this.#bytes);
    }

    toString = function() {
      return "h'" + CBOR.toHex(this.#bytes) + "'";
    }

    _get = function() {
      return this.#bytes;
    }
  }

///////////////////////////
//       CBOR.Bool       //
///////////////////////////
 
  static Bool = class extends CBOR.#CBORObject {

    #bool;

    constructor(bool) {
      super();
      this.#bool = CBOR.#typeCheck(bool, 'boolean');
    }
    
    encode = function() {
      return new Uint8Array([this.#bool ? CBOR.#MT_TRUE : CBOR.#MT_FALSE]);
    }

    toString = function() {
      return this.#bool.toString();
    }

    _get = function() {
      return this.#bool;
    }
  }

///////////////////////////
//      CBOR.Null        //
///////////////////////////
 
  static Null = class extends CBOR.#CBORObject {
    
    encode = function() {
      return new Uint8Array([CBOR.#MT_NULL]);
    }

    toString = function() {
      return 'null';
    }
  }

///////////////////////////
//      CBOR.Array       //
///////////////////////////

  static Array = class extends CBOR.#CBORObject {

    #array = [];

    add = function(value) {
      this.#array.push(CBOR.#cborArguentCheck(value));
      return this;
    }

    get = function(index) {
      index = CBOR.#intCheck(index);
      if (index < 0 || index >= this.#array.length) {
        throw Error("Array index out of range: " + index);
      }
      return this.#array[index];
    }

    toArray = function() {
      let array = [];
      this.#array.forEach(element => array.push(element));
      return array;
    }

    encode = function() {
      let encoded = CBOR.#encodeTagAndN(CBOR.#MT_ARRAY, this.#array.length);
      this.#array.forEach(value => {
        encoded = CBOR.#addArrays(encoded, value.encode());
      });
      return encoded;
    }

    toString = function(cborPrinter) {
      let buffer = '[';
      let notFirst = false;
      this.#array.forEach(value => {
        if (notFirst) {
          buffer += ', ';
        }
        notFirst = true;
        buffer += value.toString(cborPrinter);
      });
      return buffer + ']';
    }

    size = function() {
      return this.#array.length;
    }

    _get = function() {
      return this;
    }
  }

///////////////////////////
//       CBOR.Map        //
///////////////////////////

  static Map = class extends CBOR.#CBORObject {

    #root;
    #lastEntry;
    #deterministicMode = false;

    set = function(key, value) {
      let newEntry = {};
      newEntry.key = this.#getKey(key);
      newEntry.value = CBOR.#cborArguentCheck(value);
      newEntry.encodedKey = key.encode();
      newEntry.next = null;
      if (this.#root) {
        // Second key etc.
        if (this.#deterministicMode) {
          // Normal case for parsing.
          let diff = CBOR.#compare(this.#lastEntry, newEntry.encodedKey);
          if (diff >= 0) {
            throw Error((diff == 0 ? 
              "Duplicate: " : "Non-deterministic order: ") + key.toString());
          }
          this.#lastEntry.next = newEntry;
        } else {
          // Programmatically created key or the result of unconstrained parsing.
          // Then we need to test and sort (always produce deterministic CBOR).
          let precedingEntry = null;
          let diff = 0;
          for (let entry = this.#root; entry; entry = entry.next) {
            diff = CBOR.#compare(entry, newEntry.encodedKey);
            if (diff == 0) {
              throw Error("Duplicate: " + key);                      
            }
            if (diff > 0) {
              // New key is less than a current entry.
              if (precedingEntry == null) {
                  // Less than root, means the root must be redefined.
                  newEntry.next = this.#root;
                  this.#root = newEntry;
              } else {
                  // Somewhere above root. Insert after preceding entry.
                  newEntry.next = entry;
                  precedingEntry.next = newEntry;
              }
              // Done, break out of the loop.
              break;
            }
            // No luck in this round, continue searching.
            precedingEntry = entry;
          }
          // Biggest key so far, insert at the end.
          if (diff < 0) {
            precedingEntry.next = newEntry;
          }
        }
      } else {
        // First key, take it as is.
        this.#root = newEntry;
      }
      this.#lastEntry = newEntry;
      return this;
    }

    #getKey = function(key) {
      return CBOR.#cborArguentCheck(key);
    }

    #missingKey = function(key) {
      throw Error("Missing key: " + key);
    }

    #lookup(key, mustExist) {
      let encodedKey = this.#getKey(key).encode();
      for (let entry = this.#root; entry; entry = entry.next) {
        if (CBOR.#compare(entry, encodedKey) == 0) {
          return entry;
        }
      }
      if (mustExist) {
        this.#missingKey(key);
      }
      return null;
    }

    get = function(key) {
      return this.#lookup(key, true).value;
    }

    getConditionally = function(key, defaultValue) {
      let entry = this.#lookup(key, false);
      defaultValue = CBOR.#cborArguentCheck(defaultValue);
      return entry == null ? defaultValue : entry.value;
    }

    getKeys = function() {
      let keys = [];
      for (let entry = this.#root; entry; entry = entry.next) {
        keys.push(entry.key);
      }
      return keys;
    }

    remove = function(key) {
      let encodedKey = this.#getKey(key).encode();
      let precedingEntry = null;
      for (let entry = this.#root; entry; entry = entry.next) {
        if (CBOR.#compare(entry, encodedKey) == 0) {
          if (precedingEntry == null) {
            // Remove root key.  It may be alone.
            this.#root = entry.next;
          } else {
            // Remove key somewhere above root.
            precedingEntry.next = entry.next;
          }
          return entry.value;
        }
        precedingEntry = entry;
      }
      this.#missingKey(key);
    }

    containsKey = function(key) {
      return this.#lookup(key, false) != null;
    }

    encode = function() {
      let q = 0;
      let encoded = new Uint8Array();
      for (let entry = this.#root; entry; entry = entry.next) {
        q++;
        encoded = CBOR.#addArrays(encoded, 
                      CBOR.#addArrays(entry.key.encode(), entry.value.encode()));
      }
      return CBOR.#addArrays(CBOR.#encodeTagAndN(CBOR.#MT_MAP, q), encoded);
    }

    toString = function(cborPrinter) {
      if (cborPrinter == undefined) {
        cborPrinter = new CBOR.#Printer();
      }
      let notFirst = false;
      let buffer = cborPrinter.beginMap();
      for (let entry = this.#root; entry; entry = entry.next) {
        if (notFirst) {
          buffer += ',';
        }
        notFirst = true;
        buffer += cborPrinter.newlineAndIndent();
        buffer += entry.key.toString(cborPrinter) + ': ' + entry.value.toString(cborPrinter);
      }
      return buffer + cborPrinter.endMap(notFirst);
    }

    _get = function() {
      return this;
    }
  }

///////////////////////////
//       CBOR.Tag        //
///////////////////////////

  static Tag = class extends CBOR.#CBORObject {

    #tagNumber;
    #object;

    constructor(tagNumber, object) {
      super();
      this.#tagNumber = CBOR.#intCheck(tagNumber);
      if (tagNumber < 0) {
        throw Error("Tag is negative");
      }
      this.#object = CBOR.#cborArguentCheck(object);
    }

    encode = function() {
      return CBOR.#addArrays(CBOR.#encodeTagAndN(CBOR.#MT_TAG, this.#tagNumber),
                             this.#object.encode());
    }

    toString = function(cborPrinter) {
      return this.#tagNumber.toString() + '(' + this.#object.toString(cborPrinter) + ')';
    }

    _get = function() {
      return this;
    }
  }


  static #_decoder = class {

    constructor(cbor,
                sequenceFlag,
                acceptNonDeterministic,
                constrainedMapKeys) {
      this.cbor = cbor;
      this.counter = 0;
      this.atFirstByte = true;
      this.sequenceFlag = sequenceFlag;
      this.deterministicMode = !acceptNonDeterministic;
      this.constrainedMapKeys = constrainedMapKeys;
    }

    readByte = function() {
      if (this.counter >= this.cbor.length) {
        if (this.sequenceFlag && this.atFirstByte) {
          return CBOR.#MT_NULL;
        }
        throw Error("Reading past end of buffer");
      }
      this.atFirstByte = false;
      return this.cbor[this.counter++];
    }
        
    readBytes = function (length) {
      let result = new Uint8Arry(length);
      let q = -1; 
      while (++q < length) {
        result[q] = readByte();
      }
      return result;
    }
/*

        private CBORFloat checkDoubleConversion(int tag, long bitFormat, long rawDouble)
                 {
            CBORFloat value = new CBORFloat(Double.longBitsToDouble(rawDouble));
            if ((value.tag != tag || value.bitFormat != bitFormat) && deterministicMode) {
                reportError(String.format(STDERR_NON_DETERMINISTIC_FLOAT + "%2x", tag));
            }
            return value;
        }
*/
    unsupportedTag = function(tag) {
      throw Error("Unsupported tag: " + CBOR.#twoHex(tag));
    }

    rangeLimitedBigInt = function(bigInt) {
      if (bigInt > 0xffffffffn) {
        throw Error("Length limited to 0xffffffff");
      }
      return Number(bigInt);
    }

    getObject = function() {
      let tag = this.readByte();
      console.log("Get: "+ tag);

      // Begin with CBOR types that are uniquely defined by the tag byte.
      switch (tag) {
        case CBOR.#MT_BIG_NEGATIVE:
        case CBOR.#MT_BIG_UNSIGNED:
          let byteArray = this.getObject().getBytes();
          if ((byteArray.length == 0 || byteArray[0] == 0 || byteArray.length <= 8) && 
              this.deterministicMode) {
            throw Error("Non-deterministic big integer encoding");
          }
          let bigInt = BigInt(0);
          byteArray.forEach(byte => {
            bigInt <<= 8;
            bigInt += BigInt(byte);
          });
          if (tag == MT_BIG_NEGATIVE) {
            bigInt = ~bigInt;
          }
          return new CBOR.BigInt(bigInt);
/*
          case CBOR.#MT_FLOAT16:
              let float16 = readNumber(2);
              let unsignedf16 = float16 & ~FLOAT16_NEG_ZERO;

              // Begin with the edge cases.
                    
              if ((unsignedf16 & FLOAT16_POS_INFINITY) == FLOAT16_POS_INFINITY) {
                  // Special "number"
                  f64Bin = (unsignedf16 == FLOAT16_POS_INFINITY) ?
                      // Non-deterministic representations of NaN will be flagged later.
                      // NaN "signaling" is not supported, "quiet" NaN is all there is.

                      FLOAT64_POS_INFINITY : FLOAT64_NOT_A_NUMBER;

              } else if (unsignedf16 == 0) {
                      f64Bin = FLOAT64_ZERO;
              } else {

                  // It is a "regular" non-zero number.
                    
                  // Get the bare (but still biased) float16 exponent.
                  let exponent = (unsignedf16 >> FLOAT16_SIGNIFICAND_SIZE);
                  // Get the float16 significand bits.
                  let significand = unsignedf16;
                  if (exponent == 0) {
                      // Subnormal float16 - In float64 that must translate to normalized.
                      exponent++;
                      do {
                          exponent--;
                          significand <<= 1;
                          // Continue until the implicit "1" is in the proper position.
                      } while ((significand & (1 << FLOAT16_SIGNIFICAND_SIZE)) == 0);
                  }
//                     significand & ((1 << FLOAT16_SIGNIFICAND_SIZE) - 1);
                  f64Bin = mapValues(exponent + FLOAT64_EXPONENT_BIAS - FLOAT16_EXPONENT_BIAS,
                                      significand, FLOAT16_SIGNIFICAND_SIZE);
                  mapVau
                  unsignedResult = 
                  // Exponent.  Set the proper bias and put result in front of significand.
                  ((exponent + (FLOAT64_EXPONENT_BIAS - FLOAT16_EXPONENT_BIAS)) 
                      << FLOAT64_SIGNIFICAND_SIZE) +
                  // Significand.  Remove everything above.
                  (significand & ((1l << FLOAT64_SIGNIFICAND_SIZE) - 1));
              }
                return checkDoubleConversion(tag,
                                              float16, 
                                              f64Bin,
                                              // Put sign bit in position.
                                              ((float16 & FLOAT16_NEG_ZERO) << (64 - 16)));

            case CBOR.#MT_FLOAT32:
                long float32 = getLongFromBytes(4);
                return checkDoubleConversion(tag, 
                                              float32,
                                              Double.doubleToLongBits(
                                                      Float.intBitsToFloat((int)float32)));
 
            case CBOR.#MT_FLOAT64:
                long float64 = getLongFromBytes(8);
                return checkDoubleConversion(tag, float64, float64);
*/
        case CBOR.#MT_NULL:
          return new CBOR.Null();
                    
        case CBOR.#MT_TRUE:
        case CBOR.#MT_FALSE:
          return new CBOR.Bool(tag == CBOR.#MT_TRUE);
      }
      // Then decode CBOR types that blend length of data in the tag byte.
      let n = tag & 0x1f;
      let bigN = 0n;
      if (n > 27n) {
        this.unsupportedTag(tag);
      }
      if (n > 23) {
        // For 1, 2, 4, and 8 byte N.
        let diff = n - 24;
        let q = 1 << diff;
        while (--q >= 0) {
          bigN <<= 8n;
          bigN |= BigInt(this.readByte());
        }
        // If the upper half (for 2, 4, 8 byte N) of N or a single byte
        // N is zero, a shorter variant should have been used.
        // In addition, N must be > 23. 
        if ((bigN < 24n || (--diff >= 0 && BigInt(~CBOR.#RANGES[diff]) & bigN)) && 
            this.deterministicMode) {
          throw Error("Non-deterministic integer encoding");
        }
      } else {
        bigN = BigInt(n);
      }
            console.log("N=" + bigN);
      // N successfully decoded, now switch on major type (upper three bits).
      switch (tag & 0xe0) {
        case CBOR.#MT_TAG:
          let tagData = getObject();
          /*
          if (bigN == CBORTag.RESERVED_TAG_COTX) {
            let holder = tagData.getArray(2);
            if (holder.get(0).getType() != CBORTypes.TEXT_STRING) {
                reportError("Tag syntax " +  CBORTag.RESERVED_TAG_COTX +
                            "([\"string\", CBOR object]) expected");
            }
          }
          */
          return new CBOR.Tag(bigN, tagData);

        case CBOR.#MT_UNSIGNED:
          if (bigN >= BigInt(Number.MAX_SAFE_INTEGER)) {
            return new CBOR.BigInt(bigN);
          }
          return new CBOR.Int(Number(bigN), true);
    
        case CBOR.#MT_NEGATIVE:
          let bigN = ~bigN;
          if (bigN <= BigInt(-Number.MAX_SAFE_INTEGER)) {
            return new CBOR.BigInt(value);
          }
          return new CBOR.Int(Number(bigN), false);
    
        case CBOR.#MT_BYTES:
          return new CBOR.Bytes(this.readBytes(this.rangeLimitedBigInt(bigN)));
    
        case CBOR.#MT_STRING:
          return new CBOR.String(UTF8.decode(this.readBytes(this.rangeLimitedBigInt(bigN))));
    
        case CBOR.#MT_ARRAY:
          let cborArray = new CBOR.Array();
          for (let q = this.rangeLimitedBigInt(bigN); --q >= 0;) {
            cborArray.add(getObject());
          }
          return cborArray;
    
        case CBOR.#MT_MAP:
          let cborMap = new CBOR.Map();
          cborMap.deterministicMode = deterministicMode;
          cborMap.constrainedKeys = constrainedMapKeys;
          for (let q = this.rangeLimitedBigInt(bigN); --q >= 0;) {
            cborMap.set(getObject(), getObject());
          }
          // Programmatically added elements sort automatically. 
          cborMap.deterministicMode = false;
          return cborMap;
    
        default:
          this.unsupportedTag(tag);
      }
    }
  }

///////////////////////////
//     CBOR.decode()     //
///////////////////////////

  static decode = function(cbor) {
    let decoder = new CBOR.#_decoder(CBOR.#bytesCheck(cbor), false, false, false);
    return decoder.getObject();
  }

///////////////////////////
//    Support Methods    //
///////////////////////////

  static #encodeTagAndN = function(majorType, n) {
    let modifier = n;
    let length = 0;
    if (n > 23) {
      modifier = 24;
      length = 1;
      let q = 0;
      while (q < 3 && n > CBOR.#RANGES[q++]) {
        modifier++;
        length <<= 1;
      }
    }
    let encoded = new Uint8Array(length + 1);
    encoded[0] = majorType | modifier;
    while (length > 0) {
      encoded[length--] = n;
      n /= 256;
    }
    return encoded;
  }

  static #addArrays = function(a1, a2) {
  let res = new Uint8Array(a1.length + a2.length);
    let q = 0;
    while (q < a1.length) {
      res[q] = a1[q++];
    }
    for (let i = 0; i < a2.length; i++) {
      res[q + i] = a2[i];
    }
    return res;
  }

  static #compare = function(entry, testKey) {
    let encodedKey = entry.encodedKey;
    let minIndex = Math.min(encodedKey.length, testKey.length);
    for (let i = 0; i < minIndex; i++) {
      let diff = encodedKey[i] - testKey[i];
      if (diff != 0) {
        return diff;
      }
    }
    return encodedKey.length - testKey.length;
  }

  static #bytesCheck = function(bytes) {
    if (bytes instanceof Uint8Array) {
      return bytes;
    }
    throw Error("Argument is not an 'Uint8Array'");
  }

  static #typeCheck = function(object, type) {
    if (typeof object != type) {
      throw Error("Argument is not a '" + type + "'");
    }
    return object;
  }

  static #intCheck = function(int) {
    CBOR.#typeCheck(int, 'number');
    if (!Number.isSafeInteger(int)) {
      throw Error(Number.isInteger(int) ?
        "Argument is outside of Number.MAX_SAFE_INTEGER" : "Argument is not an integer");
    }
    return int;
  }

  static #Printer = class {
    indentationLevel = 0;

    beginMap = function() {
      this.indentationLevel++;
      return '{';
    }

    newlineAndIndent = function() {
      let buffer = '\n';
      for (let i = 0; i < this.indentationLevel; i++) {
        buffer += '  ';
      }
      return buffer;
    }

    endMap = function(notEmpty) {
      this.indentationLevel--;
      if (notEmpty) {
        return this.newlineAndIndent() + '}';
      }
      return '}';
    }
  }

  static #oneHex = function (digit) {
    return String.fromCharCode(digit < 10 ? (48 + digit) : (87 + digit));
  }

  static #twoHex = function(byte) {
    return CBOR.#oneHex(byte / 16) + CBOR.#oneHex(byte % 16);
  }

  static #cborArguentCheck = function(value) {
    if (value instanceof CBOR.#CBORObject) {
      return value;
    }
    throw Error(value ? "Argument is not a CBOR object: " + value.constructor.name : "'null'");
  }

  static toHex = function (bin) {
    let result = '';
    for (let i = 0; i < bin.length; i++) {
      result += CBOR.#twoHex(bin[i]);
    }
    return result;
  }

}

// To be DELETED

toBin = function(bin) {
  let exppos = bin.length == 8 ? 4 : 7;
  let res = '';
  for (let q = 0; q < bin.length; q++) {
    for (let s = 7; s >= 0; s--) {
       res += String.fromCharCode(48 + ((bin[q] >> s) & 1));
       if ((q == 0 && s == 7) || (q == 1 && s == exppos)) {
         res += ' ';
       }
    }
  }
  return res;
}

  let bigInt = BigInt("0");
  let cbor = new CBOR.BigInt(bigInt).encode();
  console.log("Encoded: " + CBOR.toHex(cbor));
  console("Decoded: " + CBOR.decode(cbor).getBigInt());
