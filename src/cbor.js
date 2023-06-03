/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
//                             CBOR JavaScript API                             //
//                                                                             //
// Defines a single global object CBOR to (in some way) mimic the JSON object. //
// Determinisic encoding aligned with Appendix A and 4.2.2 Rule 2 of RFC 8949. //
// Author: Anders Rundgren (https://github.com/cyberphone)                     //
/////////////////////////////////////////////////////////////////////////////////

'use strict';

class CBOR {

  // Super class for all CBOR types.
  static #CBORObject = class {

    constructor() {}

    getInt = function() {
      if (this instanceof CBOR.BigInt) {
        // During decoding, integers outside of Number.MAX_SAFE_INTEGER
        // automatically get "BigInt" representation. 
        throw RangeError("Integer is outside of Number.MAX_SAFE_INTEGER, use getBigInt()");
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

    equals = function(object) {
      if (object && object instanceof CBOR.#CBORObject) {
        return CBOR.compareArrays(this.encode(), object.encode()) == 0;
      }
      return false;
    }

    clone = function() {
      return CBOR.decode(this.encode());
    }

    // Overridden by CBOR.Int and CBOR.String
    constrainedKeyType = function() {
      return true;
    }
 
    #checkTypeAndGetValue = function(className) {
      if (!(this instanceof className)) {
        throw TypeError("Invalid method call for object: CBOR." + this.constructor.name);
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

  static #ESCAPE_CHARACTERS = [
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

    #value;

    // Integers with a magnitude above 2^53 - 1, must use CBOR.BigInt. 
    constructor(value) {
      super();
      this.#value = CBOR.#intCheck(value);
    }
    
    encode = function() {
      let tag;
      let n = this.#value;
      if (n < 0) {
        tag = CBOR.#MT_NEGATIVE;
        n = -n - 1;
      } else {
        tag = CBOR.#MT_UNSIGNED;
      }
      return CBOR.#encodeTagAndN(tag, n);
    }

    toString = function() {
      return this.#value.toString();
    }

    constrainedKeyType = function() {
      return false;
    }

    _get = function() {
      return this.#value;
    }
  }

///////////////////////////
//     CBOR.BigInt       //
///////////////////////////
 
  static BigInt = class extends CBOR.#CBORObject {

    #value;

    // The CBOR.BigInt wrapper object implements the CBOR integer reduction algorithm.  The
    // JavaScript "BigInt" object is used for maintaining lossless represention of large integers.
    constructor(value) {
      super();
      this.#value = CBOR.#typeCheck(value, 'bigint');
    }
    
    encode = function() {
      let tag;
      let value = this.#value
      if (value < 0) {
        tag = CBOR.#MT_NEGATIVE;
        value = ~value;
      } else {
        tag = CBOR.#MT_UNSIGNED;
      }
      return CBOR.#finishBigIntAndTag(tag, value);
    }

    toString = function() {
      return this.#value.toString();
    }
 
    _get = function() {
      return this.#value;
    }
  }

///////////////////////////
//      CBOR.Float       //
///////////////////////////
 
  static Float = class extends CBOR.#CBORObject {

    #value;
    #encoded;
    #tag;

    constructor(value) {
      super();
      this.#value = CBOR.#typeCheck(value, 'number');
      // Begin catching the F16 edge cases.
      this.#tag = CBOR.#MT_FLOAT16;
      if (Number.isNaN(value)) {
        this.#encoded = CBOR.#int16ToByteArray(0x7e00);
      } else if (!Number.isFinite(value)) {
        this.#encoded = CBOR.#int16ToByteArray(value < 0 ? 0xfc00 : 0x7c00);
      } else if (Math.abs(value) == 0) {
        this.#encoded = CBOR.#int16ToByteArray(Object.is(value,-0) ? 0x8000 : 0x0000);
      } else {
        // It is apparently a genuine (non-zero) number.
        // The following code depends on that Math.fround works as expected.
        let f32 = Math.fround(value);
        let u8;
        let f32exp;
        let f32signif;
        while (true) {  // "goto" surely beats quirky loop/break/return/flag constructs...
          if (f32 == value) {
            // Nothing was lost during the conversion, F32 or F16 is on the menu.
            this.#tag = CBOR.#MT_FLOAT32;
            // However, JavaScript always defer to F64 for "Number".
            u8 = CBOR.#f64ToByteArray(value);
            f32exp = ((u8[0] & 0x7f) << 4) + ((u8[1] & 0xf0) >> 4) - 1023 + 127;
            f32signif = ((u8[1] & 0x0f) << 19) + (u8[2] << 11) + (u8[3] << 3) + (u8[4] >> 5)
            // Very small F32 numbers may require subnormal representation.
            if (f32exp <= 0) {
              // The implicit "1" becomes explicit using subnormal representation.
              f32signif += 1 << 23;
              // Always perform at least one turn.
              f32exp--;
              do {
                f32signif >>= 1;
              } while (++f32exp < 0);   
            }
            // If it is a subnormal F32 or if F16 would lose precision, stick to F32.
            if (f32exp == 0 || f32signif & 0x1fff) {
              break;
            }
            // Arrange for F16.
            let f16exp = f32exp - 127 + 15;
            let f16signif = f32signif >> 13;
            // If too large for F16, stick to F32.
            if (f16exp > 30) {
              break;
            }
            // Finally, is value too small for F16?
            if (f16exp <= 0) {
              // The implicit "1" becomes explicit using subnormal representation.
              f16signif += 1 << 10;
              // Always perform at least one turn.
              f16exp--;
              do {
                // Losing bits is not an option.
                if ((f16signif & 1) != 0) {
                  f16signif = 0;
                  break;
                }
                f16signif >>= 1;
              } while (++f16exp < 0);
              // If too small for F16, stick to F32.
              if (f16signif == 0) {
                break;
              }
            }
            // A rarity, 16 bits turned out being sufficient for representing value.
            this.#tag = CBOR.#MT_FLOAT16;
            let f16bin = 
                // Put sign bit in position.
                ((u8[0] & 0x80) << 8) +
                // Exponent.  Put it in front of significand.
                (f16exp << 10) +
                // Significand.
                f16signif;
                this.#encoded = CBOR.#int16ToByteArray(f16bin);
          } else {
            // Converting to F32 returned a truncated result.
            // Full 64-bit representation is required.
            this.#tag = CBOR.#MT_FLOAT64;
            this.#encoded = CBOR.#f64ToByteArray(value);
          }
          // Common F16 and F64 return point.
          return;
        }
        // Broken loop: 32 bits are apparently needed for maintaining magnitude and precision.
        let f32bin = 
            // Put sign bit in position. Why not << 24?  JS shift doesn't work above 2^31...
            ((u8[0] & 0x80) * 0x1000000) +
            // Exponent.  Put it in front of significand (<< 23).
            (f32exp * 0x800000) +
            // Significand.
            f32signif;
            this.#encoded = CBOR.addArrays(CBOR.#int16ToByteArray(f32bin / 0x10000), 
                                           CBOR.#int16ToByteArray(f32bin % 0x10000));
      }
    }
    
    encode = function() {
      return CBOR.addArrays(new Uint8Array([this.#tag]), this.#encoded);
    }

    toString = function() {
      let floatString = this.#value.toString();
      // Diagnostic Notation support.
      if (floatString.indexOf('.') < 0) {
        let matches = floatString.match(/\-?\d+/g);
        if (matches) {
          floatString = matches[0] + '.0' + floatString.substring(matches[0].length);
        }
      }
     return floatString;
    }

    _compare = function(decoded) {
      return CBOR.compareArrays(this.#encoded, decoded);
    }

    _get = function() {
      return this.#value;
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
      return CBOR.addArrays(CBOR.#encodeTagAndN(CBOR.#MT_STRING, utf8.length), utf8);
    }

    toString = function() {
      let buffer = '"';
      for (let q = 0; q < this.#string.length; q++) {
        let c = this.#string.charCodeAt(q);
        if (c <= 0x5c) {
          let escapedCharacter;
          if (escapedCharacter = CBOR.#ESCAPE_CHARACTERS[c]) {
            buffer += '\\';
            if (escapedCharacter == 1) {
              buffer += 'u00' + CBOR.#twoHex(c);
            } else {
              buffer += escapedCharacter;
            }
            continue;
          }
        }
        buffer += String.fromCharCode(c);
      }
      return buffer + '"';
    }

    constrainedKeyType = function() {
      return false;
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
      return CBOR.addArrays(CBOR.#encodeTagAndN(CBOR.#MT_BYTES, this.#bytes.length), this.#bytes);
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

    #elements = [];

    add = function(element) {
      this.#elements.push(CBOR.#cborArguentCheck(element));
      return this;
    }

    get = function(index) {
      index = CBOR.#intCheck(index);
      if (index < 0 || index >= this.#elements.length) {
        throw RangeError("Array index out of range: " + index);
      }
      return this.#elements[index];
    }

    toArray = function() {
      let array = [];
      this.#elements.forEach(element => array.push(element));
      return array;
    }

    encode = function() {
      let encoded = CBOR.#encodeTagAndN(CBOR.#MT_ARRAY, this.#elements.length);
      this.#elements.forEach(object => {
        encoded = CBOR.addArrays(encoded, object.encode());
      });
      return encoded;
    }

    toString = function(cborPrinter) {
      let buffer = '[';
      let notFirst = false;
      this.#elements.forEach(object => {
        if (notFirst) {
          buffer += ', ';
        }
        notFirst = true;
        buffer += object.toString(cborPrinter);
      });
      return buffer + ']';
    }

    size = function() {
      return this.#elements.length;
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
    #numberOfEntries = 0;
    _constrainedKeys = false;
    _deterministicMode = false;

    static Entry = class {

       constructor(key, value) {
         this.key = key;
         this.encodedKey = key.encode();
         this.value = value;
         this.next = null;
       }

       compare = function(encodedKey) {
         return CBOR.compareArrays(this.encodedKey, encodedKey);
       }
    }

    set = function(key, value) {
      let newEntry = new CBOR.Map.Entry(this.#getKey(key), CBOR.#cborArguentCheck(value));
      if (this._constrainedKeys && key.constrainedKeyType()) {
        throw Error("Constrained key option disallows: " + key.constructor.name);
      }
      if (this.#root) {
        // Second key etc.
        if (this._constrainedKeys &&
            this.#lastEntry.key.constructor.name != key.constructor.name) {
          throw Error("Constrained key option disallows mixing types: " + key.constructor.name);
        }
        if (this._deterministicMode) {
          // Normal case for parsing.
          let diff = this.#lastEntry.compare(newEntry.encodedKey);
          if (diff >= 0) {
            throw Error((diff ? "Non-deterministic order for key: " : "Duplicate key: ") + key);
          }
          this.#lastEntry.next = newEntry;
        } else {
          // Programmatically created key or the result of unconstrained parsing.
          // Then we need to test and sort (always produce deterministic CBOR).
          let precedingEntry = null;
          let diff = 0;
          for (let entry = this.#root; entry; entry = entry.next) {
            diff = entry.compare(newEntry.encodedKey);
            if (diff == 0) {
              throw Error("Duplicate key: " + key);                      
            }
            if (diff > 0) {
              // New key is (lexicographically) smaller than current entry.
              if (precedingEntry == null) {
                // New key is smaller than root. New key becomes root.
                newEntry.next = this.#root;
                this.#root = newEntry;
              } else {
                // New key is smaller than an entry above root. Insert before current entry.
                newEntry.next = entry;
                precedingEntry.next = newEntry;
              }
              // Done, break out of the loop.
              break;
            }
            // No luck in this round, continue searching.
            precedingEntry = entry;
          }
          // Biggest key so far, insert it at the end.
          if (diff < 0) {
            precedingEntry.next = newEntry;
          }
        }
      } else {
        // First key, take it as is.
        this.#root = newEntry;
      }
      this.#lastEntry = newEntry;
      this.#numberOfEntries++;
      return this;
    }

    #getKey = function(key) {
      return CBOR.#cborArguentCheck(key);
    }

    #missingKey = function(key) {
      throw ReferenceError("Missing key: " + key);
    }

    #lookup(key, mustExist) {
      let encodedKey = this.#getKey(key).encode();
      for (let entry = this.#root; entry; entry = entry.next) {
        if (entry.compare(encodedKey) == 0) {
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
      // Note: defaultValue may be 'null'
      defaultValue = defaultValue ? CBOR.#cborArguentCheck(defaultValue) : null;
      return entry ? entry.value : defaultValue;
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
        if (entry.compare(encodedKey) == 0) {
          if (precedingEntry == null) {
            // Remove root key.  It may be alone.
            this.#root = entry.next;
          } else {
            // Remove key somewhere above root.
            precedingEntry.next = entry.next;
          }
          this.#numberOfEntries--;
          return entry.value;
        }
        precedingEntry = entry;
      }
      this.#missingKey(key);
    }

    size = function() {
      return this.#numberOfEntries;
    }

    containsKey = function(key) {
      return this.#lookup(key, false) != null;
    }

    encode = function() {
      let encoded = CBOR.#encodeTagAndN(CBOR.#MT_MAP, this.#numberOfEntries);
      for (let entry = this.#root; entry; entry = entry.next) {
        encoded = CBOR.addArrays(encoded, 
                                 CBOR.addArrays(entry.key.encode(), entry.value.encode()));
      }
      return encoded;
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

    static RESERVED_TAG_COTX = 1010n;

    #tagNumber;
    #object;

    constructor(tagNumber, object) {
      super();
      if (typeof tagNumber != 'bigint') {
        tagNumber = BigInt(CBOR.#intCheck(tagNumber));
      }
      if (tagNumber < 0n || tagNumber >= 0x10000000000000000n) {
        throw RangeError("Tag value is out of range");
      }
      this.#tagNumber = tagNumber;
      this.#object = CBOR.#cborArguentCheck(object);
    }

    encode = function() {
      return CBOR.addArrays(CBOR.#finishBigIntAndTag(CBOR.#MT_TAG, this.#tagNumber),
                            this.#object.encode());
    }

    toString = function(cborPrinter) {
      return this.#tagNumber.toString() + '(' + this.#object.toString(cborPrinter) + ')';
    }

    getTagNumber = function() {
      return this.#tagNumber;
    }

    getTagObject = function() {
      return this.#object;
    }

    _get = function() {
      return this;
    }
  }

///////////////////////////
//        Proxy          //
///////////////////////////

  // The Proxy concept enables checks for invocation by "new" and number of arguments.
  static #handler = class {

    constructor(numberOfArguments) {
      this.numberOfArguments = numberOfArguments;
    }

    apply(target, thisArg, argumentsList) {
      if (argumentsList.length != this.numberOfArguments) {
        throw SyntaxError("CBOR." + target.name + " expects " +
                          this.numberOfArguments + " argument(s)");
      }
      return new target(...argumentsList);
    }

    construct(target, args) {
      throw SyntaxError("CBOR." + target.name + " does not permit \"new\"");
    }
  }

  static Int = new Proxy(CBOR.Int, new CBOR.#handler(1));
  static BigInt = new Proxy(CBOR.BigInt, new CBOR.#handler(1));
  static Float = new Proxy(CBOR.Float, new CBOR.#handler(1));
  static String = new Proxy(CBOR.String, new CBOR.#handler(1));
  static Bytes = new Proxy(CBOR.Bytes, new CBOR.#handler(1));
  static Bool = new Proxy(CBOR.Bool, new CBOR.#handler(1));
  static Null = new Proxy(CBOR.Null, new CBOR.#handler(0));
  static Array = new Proxy(CBOR.Array, new CBOR.#handler(0));
  static Map = new Proxy(CBOR.Map, new CBOR.#handler(0));
  static Tag = new Proxy(CBOR.Tag, new CBOR.#handler(2));


///////////////////////////
//     Decoder Core      //
///////////////////////////

  static #_decoder = class {

    constructor(cbor,
                sequenceFlag,
                acceptNonDeterministic,
                constrainedKeys) {
      this.cbor = CBOR.#bytesCheck(cbor);
      this.counter = 0;
      this.sequenceFlag = sequenceFlag;
      this.deterministicMode = !acceptNonDeterministic;
      this.constrainedKeys = constrainedKeys;
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
      let result = new Uint8Array(length);
      let q = -1; 
      while (++q < length) {
        result[q] = this.readByte();
      }
      return result;
    }

    unsupportedTag = function(tag) {
      throw Error("Unsupported tag: " + CBOR.#twoHex(tag));
    }

    rangeLimitedBigInt = function(value) {
      if (value > 0xffffffffn) {
        throw RangeError("Length limited to 0xffffffff");
      }
      return Number(value);
    }

    compareAndReturn = function(decoded, f64) {
      let cborFloat = CBOR.Float(f64);
      if (cborFloat._compare(decoded) && this.deterministicMode) {
        throw Error("Non-deterministic encoding of: " + f64);
      }
      return cborFloat;
    }

    recreateF64AndReturn = function(numberOfBytes,
                                    specialNumbers,
                                    significandMsbP1,
                                    divisor) {
      let decoded = this.readBytes(numberOfBytes);
      let sign = false;
      if (decoded[0] & 0x80) {
        decoded[0] &= 0x7f;
        sign = true;
      }
      let float = 0n;
      for (let i = 0; i < decoded.length; i++) {
        float *= 256n;
        float += BigInt(decoded[i]);
      }
      let f64 = 0.0;
      while (true) {
        // The two cases of zero.
        if (!float) break;
        // The three cases of numbers that have no/little use.
        if ((float & specialNumbers) == specialNumbers) {
          f64 = (float == specialNumbers) ? Number.POSITIVE_INFINITY : Number.NaN;
          break;
        }
        // A genuine number
        let exponent = float & specialNumbers;
        let significand = float - exponent;
        if (exponent) {
          // Normal representation, add implicit "1.".
          significand += significandMsbP1;
          significand <<= ((exponent / significandMsbP1) - 1n);
        }
        let array = [];
        while (significand) {
          array.push(Number(significand & 255n));
          significand >>= 8n;
        }
        array = array.reverse();
        for (let q = 0; q < array.length; q++) {
          f64 *= 256;
          f64 += array[q];
        }
        f64 /= divisor;
        break;
      }
      if (sign) {
        f64 = -f64;
        decoded[0] |= 0x80;
      }
      return this.compareAndReturn(decoded, f64);
    }

    getObject = function() {
      let tag = this.readByte();

      // Begin with CBOR types that are uniquely defined by the tag byte.
      switch (tag) {
        case CBOR.#MT_BIG_NEGATIVE:
        case CBOR.#MT_BIG_UNSIGNED:
          let byteArray = this.getObject().getBytes();
          if ((byteArray.length == 0 || byteArray[0] == 0 || byteArray.length <= 8) && 
              this.deterministicMode) {
            throw Error("Non-deterministic big integer encoding");
          }
          let value = 0n;
          byteArray.forEach(byte => {
            value <<= 8n;
            value += BigInt(byte);
          });
          if (tag == CBOR.#MT_BIG_NEGATIVE) {
            value = ~value;
          }
          return CBOR.BigInt(value);

        case CBOR.#MT_FLOAT16:
          return this.recreateF64AndReturn(2, 0x7c00n, 0x400n, 0x1000000);

        case CBOR.#MT_FLOAT32:
          return this.recreateF64AndReturn(4, 0x7f800000n, 0x800000n, 
                                           0x20000000000000000000000000000000000000);

        case CBOR.#MT_FLOAT64:
           let f64bytes = this.readBytes(8);
           const f64buffer = new ArrayBuffer(8);
           new Uint8Array(f64buffer).set(f64bytes);
           return this.compareAndReturn(f64bytes, new DataView(f64buffer).getFloat64(0, false));

        case CBOR.#MT_NULL:
          return CBOR.Null();
 
        case CBOR.#MT_TRUE:
        case CBOR.#MT_FALSE:
          return CBOR.Bool(tag == CBOR.#MT_TRUE);
      }
      // Then decode CBOR types that blend length of data in the tag byte.
      let n = tag & 0x1f;
      let bigN = BigInt(n);
      if (n > 27) {
        this.unsupportedTag(tag);
      }
      if (n > 23) {
        // For 1, 2, 4, and 8 byte N.
        let q = 1 << (n - 24);
        let mask = 0xffffffffn << BigInt((q >> 1) * 8);
        bigN = 0n;
        while (--q >= 0) {
          bigN <<= 8n;
          bigN += BigInt(this.readByte());
        }
        // If the upper half (for 2, 4, 8 byte N) of N or a single byte
        // N is zero, a shorter variant should have been used.
        // In addition, N must be > 23. 
        if ((bigN < 24n || !(mask & bigN)) && this.deterministicMode) {
          throw Error("Non-deterministic N encoding for tag: 0x" + CBOR.#twoHex(tag));
        }
      }
      // N successfully decoded, now switch on major type (upper three bits).
      switch (tag & 0xe0) {

        case CBOR.#MT_TAG:
          let taggedObject = this.getObject();
          if (bigN == CBOR.Tag.RESERVED_TAG_COTX) {
            if (taggedObject.constructor.name != CBOR.Array.name || taggedObject.size() != 2 ||
                taggedObject.get(0).constructor.name != CBOR.String.name) {
                throw SyntaxError("Tag syntax " +  CBOR.Tag.RESERVED_TAG_COTX +
                                  "([\"string\", CBOR object]) expected");
            }
          }
          return CBOR.Tag(bigN, taggedObject);

        case CBOR.#MT_UNSIGNED:
          if (bigN > BigInt(Number.MAX_SAFE_INTEGER)) {
            return CBOR.BigInt(bigN);
          }
          return CBOR.Int(Number(bigN));
    
        case CBOR.#MT_NEGATIVE:
          bigN = ~bigN;
          if (bigN < BigInt(-Number.MAX_SAFE_INTEGER)) {
            return CBOR.BigInt(bigN);
          }
          return CBOR.Int(Number(bigN));
    
        case CBOR.#MT_BYTES:
          return CBOR.Bytes(this.readBytes(this.rangeLimitedBigInt(bigN)));
    
        case CBOR.#MT_STRING:
          return CBOR.String(new TextDecoder('utf-8', {fatal: true}).decode(
                                     this.readBytes(this.rangeLimitedBigInt(bigN))));
    
        case CBOR.#MT_ARRAY:
          let cborArray = CBOR.Array();
          for (let q = this.rangeLimitedBigInt(bigN); --q >= 0;) {
            cborArray.add(this.getObject());
          }
          return cborArray;
    
        case CBOR.#MT_MAP:
          let cborMap = CBOR.Map();
          cborMap._deterministicMode = this.deterministicMode;
          cborMap._constrainedKeys = this.constrainedKeys;
          for (let q = this.rangeLimitedBigInt(bigN); --q >= 0;) {
            cborMap.set(this.getObject(), this.getObject());
          }
          // Programmatically added elements sort automatically. 
          cborMap._deterministicMode = false;
          return cborMap;
    
        default:
          this.unsupportedTag(tag);
      }
    }
  }

  static #getObject = function(decoder) {
    decoder.atFirstByte = true;
    let object = decoder.getObject();
    if (decoder.sequenceFlag) {
      if (decoder.atFirstByte) {
        return null;
      }
    } else if (decoder.counter < decoder.cbor.length) {
      throw Error("Unexpected data encountered after CBOR object");
    }
    return object;
  }

///////////////////////////
//     CBOR.decode()     //
///////////////////////////

  static decode = function(cbor) {
    let decoder = new CBOR.#_decoder(cbor, false, false, false);
    return CBOR.#getObject(decoder);
  }

///////////////////////////
//  CBOR.initExtended()  //
///////////////////////////

  static initExtended = function(cbor, sequenceFlag, acceptNonDeterministic, constrainedKeys) {
    return new CBOR.#_decoder(cbor, 
                              sequenceFlag,
                              acceptNonDeterministic, 
                              constrainedKeys);
  }

///////////////////////////
// CBOR.decodeExtended() //
///////////////////////////

  static decodeExtended = function(decoder) {
    return CBOR.#getObject(decoder);
  }

//================================//
//   Diagnostic Notation Support  //
//================================//

  static DiagnosticNotation = class {

    static ParserError = class extends Error {
      constructor(message) {
        super(message);
      }
    }

    cborText;
    index;
    sequence;
  
    constructor(cborText, sequence) {
      this.cborText = cborText;
      this.sequence = sequence;
      this.index = 0;
    }
 
  
    reportError = function(error) {
      // Unsurprisingly, error handling turned out to be the most complex part...
      let start = this.index - 100;
      if (start < 0) {
        start = 0;
      }
      let linePos = 0;
      while (start < this.index - 1) {
        if (this.cborText[start++] == '\n') {
          linePos = start;
        }
      }
      let complete = '';
      if (this.index > 0 && this.cborText[this.index - 1] == '\n') {
        this.index--;
      }
      let endLine = this.index;
      while (endLine < this.cborText.length) {
        if (this.cborText[endLine] == '\n') {
          break;
        }
        endLine++;
      }
      for (let q = linePos; q < endLine; q++) {
        complete += this.cborText[q];
      }
      complete += '\n';
      for (let q = linePos; q < this.index; q++) {
        complete += '-';
      }
      let lineNumber = 1;
      for (let q = 0; q < this.index - 1; q++) {
        if (this.cborText[q] == '\n') {
          lineNumber++;
        }
      }
      throw new CBOR.DiagnosticNotation.ParserError(complete +
                "^\n\nError in line " + lineNumber + ". " + error);
    }
  
    readToEOF = function() {
      try {
        let cborObject = this.getObject();
        if (this.index < this.cborText.length) {
          this.readChar();
          this.reportError("Unexpected data after token");
        }
        return cborObject;
      } catch (e) {
        if (e instanceof CBOR.DiagnosticNotation.ParserError) {
          throw e;
        }
        this.reportError(e.toString());
      }
    }

    readSequenceToEOF = function() {
      try {
        let sequence = [];
        while (true) {
          sequence.push(this.getObject());
          if (this.index < this.cborText.length) {
            this.scanFor(",");
          } else {
            return sequence;
          }
        }
      } catch (e) {
        if (e instanceof CBOR.DiagnosticNotation.ParserError) {
          throw e;
        }
        this.reportError(e.toString());
      }
    }

    getObject = function() {
      this.scanNonSignficantData();
      let cborObject = this.getRawObject();
      this.scanNonSignficantData();
      return cborObject;
    }
  
    continueList = function(validStop) {
      if (this.nextChar() == ',') {
        this.readChar();
        this.scanNonSignficantData();
        return true;
      }
      this.scanFor(validStop);
      this.index--;
      return false;
    }
  
    getRawObject = function() {
      switch (this.readChar()) {
    
        case '<':
          this.scanFor("<");
          let embedded = this.getObject();
          this.scanFor(">>");
          return CBOR.Bytes(embedded.encode());
  
        case '[':
          let array = CBOR.Array();
          this.scanNonSignficantData();
          while (this.readChar() != ']') {
            this.index--;
            do {
              array.add(this.getObject());
            } while (this.continueList(']'));
          }
          return array;
   
        case '{':
          let map = CBOR.Map();
          this.scanNonSignficantData();
          while (this.readChar() != '}') {
            this.index--;
            do {
              let key = this.getObject();
              this.scanFor(":");
              map.set(key, this.getObject());
            } while (this.continueList('}'));
          }
          return map;
     
        case '\'':
          return this.getString(true);
        
        case '"':
          return this.getString(false);

        case 'h':
          return this.getBytes(false);

        case 'b':
          if (this.nextChar() == '3') {
            this.scanFor("32'");
            this.reportError("b32 not implemented");
          }
          this.scanFor("64");
          return this.getBytes(true);
        
        case 't':
          this.scanFor("rue");
          return CBOR.Bool(true);
     
        case 'f':
          this.scanFor("alse");
          return CBOR.Bool(false);
     
        case 'n':
          this.scanFor("ull");
          return CBOR.Null();

        case '-':
          if (this.readChar() == 'I') {
            this.scanFor("nfinity");
            return CBOR.Float(Number.NEGATIVE_INFINITY);
          }
          return this.getNumberOrTag(true);

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            return this.getNumberOrTag(false);

        case 'N':
          this.scanFor("aN");
          return CBOR.Float(Number.NaN);

        case 'I':
          this.scanFor("nfinity");
          return CBOR.Float(Number.POSITIVE_INFINITY);
        
        default:
          this.index--;
          this.reportError("Unexpected character: " + this.toChar(this.readChar()));
      }
    }

    getNumberOrTag = function(negative) {
      let token = '';
      this.index--;
      let prefix = null;
      if (this.readChar() == '0') {
        switch (this.nextChar()) {
          case 'b':
          case 'o':
          case 'x':
            prefix = '0' + this.readChar();
            break;
        }
      }
      if (prefix == null) {
        this.index--;
      }
      let floatingPoint = false;
      while (true)  {
        token += this.readChar();
        switch (this.nextChar()) {
          case '\u0000':
          case ' ':
          case '\n':
          case '\r':
          case '\t':
          case ',':
          case ':':
          case '>':
          case ']':
          case '}':
          case '/':
          case '#':
          case '(':
          case ')':
            break;
          
          case '.':
            floatingPoint = true;
            continue;

          default:
            continue;
        }
        break;
      }
        if (floatingPoint) {
          this.testForNonDecimal(prefix);
          let value = Number(token);
          // Implicit overflow is not permitted
          if (!Number.isFinite(value)) {
            this.reportError("Floating point value out of range");
          }
          return CBOR.Float(negative ? -value : value);
        }
        if (this.nextChar() == '(') {
          // Do not accept '-', 0xhhh, or leading zeros
          this.testForNonDecimal(prefix);
          if (negative || (token.length > 1 && token.charAt(0) == '0')) {
            this.reportError("Tag syntax error");
          }
          this.readChar();
          let tagNumber = BigInt(token);
          let taggedObject = this.getObject();
          if (tagNumber == CBOR.Tag.RESERVED_TAG_COTX) {
            if (taggedObject.constructor.name != CBOR.Array.name|| taggedObject.size() != 2 ||
                taggedObject.get(0).constructor.name != CBOR.String.name) {
              this.reportError("Special tag " + CBOR.Tag.RESERVED_TAG_COTX + " syntax error");
            }
          }
          let cborTag = CBOR.Tag(tagNumber, taggedObject);
          this.scanFor(")");
          return cborTag;
        }
        let bigInt = BigInt((prefix == null ? '' : prefix) + token);
        // Clone: slight quirk to get the proper CBOR integer type  
        return CBOR.BigInt(negative ? -bigInt : bigInt).clone();
    }

    testForNonDecimal = function(nonDecimal) {
      if (nonDecimal) {
        this.reportError("Hexadecimal not permitted here");
      }
    }

    nextChar = function() {
      if (this.index == this.cborText.length) return String.fromCharCode(0);
      let c = this.readChar();
      this.index--;
      return c;
    }

    toChar = function(c) {
      let charCode = c.charCodeAt(0); 
      return charCode < 0x20 ? "\\u00" + CBOR.#twoHex(charCode) : "'" + c + "'";
    }

    scanFor = function(expected) {
      [...expected].forEach(c => {
        let actual = this.readChar(); 
        if (c != actual) {
          this.reportError("Expected: '" + c + "' actual: " + this.toChar(actual));
        }
      });
    }

    getString = function(byteString) {
      let s = '';
      while (true) {
        let c;
        switch (c = this.readChar()) {
          // Multiline extension
          case '\n':
          case '\r':
          case '\t':
            break;

          case '\\':
            switch (c = this.readChar()) {
              case '\n':
                continue;

              case '\'':
              case '"':
              case '\\':
                break;
  
              case 'b':
                c = '\b';
                break;
  
              case 'f':
                c = '\f';
                break;
  
              case 'n':
                c = '\n';
                break;
  
              case 'r':
                c = '\r';
                break;
  
              case 't':
                c = '\t';
                break;
  
              case 'u':
                let u16 = 0;
                for (let i = 0; i < 4; i++) {
                  u16 += (u16 << 4) + CBOR.#decodeOneHex(this.readChar().charCodeAt(0));
                }
                c = String.fromCharCode(u16);
                break;
  
              default:
                this.reportError("Invalid escape character " + this.toChar(c));
            }
            break;
 
          case '"':
            if (!byteString) {
              return CBOR.String(s);
            }
            break;

          case '\'':
            if (byteString) {
              return CBOR.Bytes(new TextEncoder().encode(s));
            }
            break;
          
          default:
            if (c.charCodeAt(0) < 0x20) {
              this.reportError("Unexpected control character: " + this.toChar(c));
            }
        }
        s += c;
      }
    }
  
    getBytes = function(b64) {
      let token = '';
      this.scanFor("'");
      while(true) {
        let c;
        switch (c = this.readChar()) {
          case '\'':
            break;
         
          case ' ':
          case '\r':
          case '\n':
          case '\t':
            continue;

          default:
            token += c;
            continue;
        }
        break;
      }
      return CBOR.Bytes(b64 ? CBOR.fromBase64Url(token) : CBOR.fromHex(token));
    }

    readChar = function() {
      if (this.index >= this.cborText.length) {
        this.reportError("Unexpected EOF");
      }
      return this.cborText[this.index++];
    }

    scanNonSignficantData = function() {
      while (this.index < this.cborText.length) {
        switch (this.nextChar()) {
          case ' ':
          case '\n':
          case '\r':
          case '\t':
            this.readChar();
            continue;

          case '/':
            this.readChar();
            if (this.nextChar() != '/') {
              while (this.readChar() != '/') {
              }
              continue;
            }
          // Yes, '//' is currently considered as equivalent to '#'
          case '#':
            this.readChar();
            while (this.index < this.cborText.length && this.readChar() != '\n') {
            }
            continue;

          default:
            return;
        }
      }
    }
  }

///////////////////////////////
// CBOR.diagnosticNotation() //
///////////////////////////////

  static diagnosticNotation = function(cborText, optionalSequenceFlag) {
    if (optionalSequenceFlag) {
      return new CBOR.DiagnosticNotation(cborText, true).readSequenceToEOF();
    } else {
      return new CBOR.DiagnosticNotation(cborText, false).readToEOF();
    }
  }

//================================//
//    Internal Support Methods    //
//================================//

  static #encodeTagAndN = function(majorType, n) {
    let modifier = n;
    let length = 0;
    if (n > 23) {
      modifier = 24;
      length = 1;
      let nextRange = 0x100;
      while (length < 8 && n >= nextRange) {
        modifier++;
        length <<= 1;
        // The last multiplication will not be an integer but "length < 8" handles this.
        nextRange *= nextRange;
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

  static #bytesCheck = function(byteArray) {
    if (byteArray instanceof Uint8Array) {
      return byteArray;
    }
    throw TypeError("Argument is not an 'Uint8Array'");
  }

  static #typeCheck = function(object, type) {
    if (typeof object != type) {
      throw TypeError("Argument is not a '" + type + "'");
    }
    return object;
  }

  static #intCheck = function(value) {
    CBOR.#typeCheck(value, 'number');
    if (!Number.isSafeInteger(value)) {
      if (Number.isInteger(value)) {
        throw RangeError("Argument is outside of Number.MAX_SAFE_INTEGER");
      } else {
        throw TypeError("Argument is not an integer");
      }
    }
    return value;
  }

  static #finishBigIntAndTag = function(tag, value) {
    // Convert BigInt to Uint8Array (but with a twist).
    let array = [];
    do {
      array.push(Number(value & 255n));
      value >>= 8n;
    } while (value);
    let length = array.length;
    // Prepare for "integer" encoding (1, 2, 4, 8).  Only 3, 5, 6, and 7 need an action.
    while (length < 8 && length > 2 && length != 4) {
      array.push(0);
      length++;
    }
    let byteArray = new Uint8Array(array.reverse());
    // Does this number qualify as a "big integer"?
    if (length <= 8) {
      // Apparently not, encode it as "integer".
      if (length == 1 && byteArray[0] <= 23) {
        return new Uint8Array([tag | byteArray[0]]);
      }
      let modifier = 24;
      while (length >>= 1) {
          modifier++;
      }
      return CBOR.addArrays(new Uint8Array([tag | modifier]), byteArray);
    }
    // True "BigInt".
    return CBOR.addArrays(new Uint8Array([tag == CBOR.#MT_NEGATIVE ?
                                             CBOR.#MT_BIG_NEGATIVE : CBOR.#MT_BIG_UNSIGNED]), 
                                          CBOR.Bytes(byteArray).encode());
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
      return notEmpty ? this.newlineAndIndent() + '}' : '}';
    }
  }
  
  static #int16ToByteArray = function(int16) {
    return new Uint8Array([int16 / 256, int16 % 256]);
  }

  static #f64ToByteArray = function(value) {
    const buffer = new ArrayBuffer(8);
    new DataView(buffer).setFloat64(0, value, false);
    return [].slice.call(new Uint8Array(buffer))
  }

  static #oneHex = function(digit) {
    return String.fromCharCode(digit < 10 ? (0x30 + digit) : (0x57 + digit));
  }

  static #twoHex = function(byte) {
    return CBOR.#oneHex(byte / 16) + CBOR.#oneHex(byte % 16);
  }

  static #cborArguentCheck = function(object) {
    if (object instanceof CBOR.#CBORObject) {
      return object;
    }
    throw TypeError("Argument is not a CBOR.* object: " + 
                    (object ? object.constructor.name : 'null'));
  }

  static #decodeOneHex(charCode) {
    if (charCode >= 0x30 && charCode <= 0x39) return charCode - 0x30;
    if (charCode >= 0x61 && charCode <= 0x66) return charCode - 0x57;
    if (charCode >= 0x41 && charCode <= 0x46) return charCode - 0x37;
    throw SyntaxError("Bad hex character: " + String.fromCharCode(charCode));
  }

//================================//
//     Public Support Methods     //
//================================//

  static addArrays = function(a, b) {
    let result = new Uint8Array(a.length + b.length);
      let q = 0;
      while (q < a.length) {
        result[q] = a[q++];
      }
      for (let i = 0; i < b.length; i++) {
        result[q + i] = b[i];
      }
      return result;
    }

  static array

  static compareArrays = function(a, b) {
    let minIndex = Math.min(a.length, b.length);
    for (let i = 0; i < minIndex; i++) {
      let diff = a[i] - b[i];
      if (diff != 0) {
        return diff;
      }
    }
    return a.length - b.length;
  }
  
  static toHex = function (byteArray) {
    let result = '';
    for (let i = 0; i < byteArray.length; i++) {
      result += CBOR.#twoHex(byteArray[i]);
    }
    return result;
  }

  static fromHex = function (hexString) {
    let length = hexString.length;
    if (length & 1) {
      throw SyntaxError("Uneven number of characters in hex string");
    }
    let result = new Uint8Array(length >> 1);
    for (let q = 0; q < length; q += 2) {
      result[q >> 1] = (CBOR.#decodeOneHex(hexString.charCodeAt(q)) << 4) +
                        CBOR.#decodeOneHex(hexString.charCodeAt(q + 1));
    }
    return result;
  }

  static toBase64Url = function(byteArray) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(byteArray)))
               .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  static fromBase64Url = function(base64) {
    if (!base64.includes('=')) {
      base64 = base64 +  '===='.substring(0, (4 - (base64.length % 4)) % 4);
    }
    return Uint8Array.from(atob(base64.replace(/-/g, '+').replace(/_/g, '/')),
                           c => c.charCodeAt(0));
  }

}

// module.exports = CBOR;
