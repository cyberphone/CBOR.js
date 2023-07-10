/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
//                             CBOR JavaScript API                             //
//                                                                             //
// Defines a single global object CBOR to (in some way) mimic the JSON object. //
// Determinisic encoding aligned with Appendix A and 4.2.2 Rule 2 of RFC 8949. //
// Author: Anders Rundgren (https://github.com/cyberphone)                     //
/////////////////////////////////////////////////////////////////////////////////

export default class CBOR {

  // Super class for all CBOR types.
  static #CborObject = class {

    #readFlag;

    constructor() {
      this.#readFlag = false;
    }

    getInt = function() {
      if (this instanceof CBOR.BigInt) {
        // During decoding, integers outside of Number.MAX_SAFE_INTEGER
        // automatically get "BigInt" representation. 
        CBOR.#error("Integer is outside of Number.MAX_SAFE_INTEGER, use getBigInt()");
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

    getBoolean = function() {
      return this.#checkTypeAndGetValue(CBOR.Boolean);
    }

    isNull = function() {
      if (this instanceof CBOR.Null) {
        this.#readFlag = true;
        return true;
      }
      return false;
    }

    getBigInt = function() {
      if (this instanceof CBOR.Int) {
        return BigInt(this.getInt());
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
      if (object && object instanceof CBOR.#CborObject) {
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

    toDiag = function(prettyPrint) {
      let cborPrinter = new CBOR.#CborPrinter(CBOR.#typeCheck(prettyPrint, 'Boolean'));
      this.internalToString(cborPrinter);
      return cborPrinter.buffer;
    }

    toString = function() {
      return this.toDiag(true);
    }
 
    #traverse = function(holderObject, check) {
      switch (this.constructor.name) {
        case "Map":
          this.getKeys().forEach(key => {
            this.get(key).#traverse(key, check);
          });
          break;
        
        case "Array":
          this.toArray().forEach(object => {
            object.#traverse(this, check);
          });
          break;
        
        case "Tag":
          this.getTaggedObject().#traverse(this, check);
          break;
      }
      if (check) {
        if (!this.#readFlag) {
          CBOR.#error((holderObject == null ? "Data" : 
            holderObject instanceof CBOR.Array ? "Array element" :
              holderObject instanceof CBOR.Tag ?
              "Tagged object " + holderObject.getTagNumber().toString() : 
              "Map key " + holderObject.toDiag(false) + " with argument") +                    
            " of type=CBOR." + this.constructor.name + 
            " with value=" + this.toDiag(false) + " was never read");
        }
      } else {
        this.#readFlag = true;
      }
    }

    scan = function() {
      this.#traverse(null, false);
      return this;
    }

    checkForUnread = function() {
      this.#traverse(null, true);
    }

    get length() {
      if (!this._getLength) {
        CBOR.#error("CBOR." + this.constructor.name + " does not have a 'length' property");
      }
      return this._getLength();
    }
 
    #checkTypeAndGetValue = function(className) {
      if (!(this instanceof className)) {
        CBOR.#error("Invalid method call for CBOR." + this.constructor.name);
      }
      this.#readFlag = true;
      return this._get();
    }
  }

  static CborError = class extends Error {
    constructor(message) {
      super(message);
    }
  }

  static #error = function(message) {
    if (message.length > 100) {
      message = message.substring(0, 100) + ' ...';
    }
    throw new CBOR.CborError(message);
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
    CBOR.#error("CBOR cannot be instantiated");
  }

///////////////////////////
//       CBOR.Int        //
///////////////////////////
 
  static Int = class extends CBOR.#CborObject {

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

    internalToString = function(cborPrinter) {
      cborPrinter.append(this.#value.toString());
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
 
  static BigInt = class extends CBOR.#CborObject {

    #value;

    // The CBOR.BigInt wrapper object implements the CBOR integer reduction algorithm.  The
    // JavaScript "BigInt" object is used for maintaining lossless represention of large integers.
    constructor(value) {
      super();
      this.#value = CBOR.#typeCheck(value, 'BigInt');
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

    internalToString = function(cborPrinter) {
      cborPrinter.append(this.#value.toString());
    }
 
    _get = function() {
      return this.#value;
    }
  }

///////////////////////////
//      CBOR.Float       //
///////////////////////////
 
  static Float = class extends CBOR.#CborObject {

    #value;
    #encoded;
    #tag;

    constructor(value) {
      super();
      this.#value = CBOR.#typeCheck(value, 'Number');
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
              // Denormalize by shifting right 1-23 positions.
              f32signif >>= (1 - f32exp);
              f32exp = 0;
              // Subnormal F32 cannot be represented by F16, stick to F32.
              break;
            }
            // If F16 would lose precision, stick to F32.
            if (f32signif & 0x1fff) {
              break;
            }
            // Setup for F16.
            let f16exp = f32exp - 127 + 15;
            // Too small or too big for F16, or running into F16 NaN/Infinity space.
            if (f16exp <= -10 || f16exp >= 31) {
              break;
            }
            let f16signif = f32signif >> 13;
            // Finally, check if we need to denormalize F16.
            if (f16exp <= 0) {
              // The implicit "1" becomes explicit using subnormal representation.
              f16signif += 1 << 10;
              let f16signifSave = f16signif;
              f16signif >>= (1 - f16exp);
              if (f16signifSave != (f16signif << (1 - f16exp))) {
                // Losing bits is not an option, stick to F32.
                break;
              }
              // Valid and denormalized F16.
              f16exp = 0;
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
            // Converting value to F32 returned a truncated result.
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

    internalToString = function(cborPrinter) {
      let floatString = Object.is(this.#value,-0) ? '-0.0' : this.#value.toString();
      // Diagnostic Notation support.
      if (floatString.indexOf('.') < 0) {
        let matches = floatString.match(/\-?\d+/g);
        if (matches) {
          floatString = matches[0] + '.0' + floatString.substring(matches[0].length);
        }
      }
      cborPrinter.append(floatString);
    }

    _compare = function(decoded) {
      return CBOR.compareArrays(this.#encoded, decoded);
    }

    _getLength = function() {
      return this.#encoded.length;
    }

    _get = function() {
      return this.#value;
    }
  }

///////////////////////////
//     CBOR.String       //
///////////////////////////
 
  static String = class extends CBOR.#CborObject {

    #textString;

    constructor(textString) {
      super();
      this.#textString = CBOR.#typeCheck(textString, 'String');
    }
    
    encode = function() {
      let utf8 = new TextEncoder().encode(this.#textString);
      return CBOR.addArrays(CBOR.#encodeTagAndN(CBOR.#MT_STRING, utf8.length), utf8);
    }

    internalToString = function(cborPrinter) {
      cborPrinter.append('"');
      for (let q = 0; q < this.#textString.length; q++) {
        let c = this.#textString.charCodeAt(q);
        if (c <= 0x5c) {
          let escapedCharacter;
          if (escapedCharacter = CBOR.#ESCAPE_CHARACTERS[c]) {
            cborPrinter.append('\\');
            if (escapedCharacter == 1) {
              cborPrinter.append('u00');
              cborPrinter.append(CBOR.#twoHex(c));
            } else {
              cborPrinter.append(escapedCharacter);
            }
            continue;
          }
        }
        cborPrinter.append(String.fromCharCode(c));
      }
      cborPrinter.append('"');
    }

    constrainedKeyType = function() {
      return false;
    }

    _get = function() {
      return this.#textString;
    }
  }

///////////////////////////
//      CBOR.Bytes       //
///////////////////////////
 
  static Bytes = class extends CBOR.#CborObject {

    #byteString;

    constructor(byteString) {
      super();
      this.#byteString = CBOR.#bytesCheck(byteString);
    }
    
    encode = function() {
      return CBOR.addArrays(CBOR.#encodeTagAndN(CBOR.#MT_BYTES, this.#byteString.length), 
                            this.#byteString);
    }

    internalToString = function(cborPrinter) {
      cborPrinter.append("h'" + CBOR.toHex(this.#byteString) + "'");
    }

    _get = function() {
      return this.#byteString;
    }
  }

///////////////////////////
//     CBOR.Boolean      //
///////////////////////////
 
  static Boolean = class extends CBOR.#CborObject {

    #value;

    constructor(value) {
      super();
      this.#value = CBOR.#typeCheck(value, 'Boolean');
    }
    
    encode = function() {
      return new Uint8Array([this.#value ? CBOR.#MT_TRUE : CBOR.#MT_FALSE]);
    }

    internalToString = function(cborPrinter) {
      cborPrinter.append(this.#value.toString());
    }

    _get = function() {
      return this.#value;
    }
  }

///////////////////////////
//      CBOR.Null        //
///////////////////////////
 
  static Null = class extends CBOR.#CborObject {
    
    encode = function() {
      return new Uint8Array([CBOR.#MT_NULL]);
    }

    internalToString = function(cborPrinter) {
      cborPrinter.append('null');
    }
  }

///////////////////////////
//      CBOR.Array       //
///////////////////////////

  static Array = class extends CBOR.#CborObject {

    #objects = [];

    add = function(object) {
      this.#objects.push(CBOR.#cborArgumentCheck(object));
      return this;
    }

    get = function(index) {
      index = CBOR.#intCheck(index);
      if (index < 0 || index >= this.#objects.length) {
        CBOR.#error("Array index out of range: " + index);
      }
      return this.#objects[index];
    }

    toArray = function() {
      let array = [];
      this.#objects.forEach(object => array.push(object));
      return array;
    }

    encode = function() {
      let encoded = CBOR.#encodeTagAndN(CBOR.#MT_ARRAY, this.#objects.length);
      this.#objects.forEach(object => {
        encoded = CBOR.addArrays(encoded, object.encode());
      });
      return encoded;
    }

    internalToString = function(cborPrinter) {
      cborPrinter.append('[');
      let notFirst = false;
      this.#objects.forEach(object => {
        if (notFirst) {
          cborPrinter.append(',');
          cborPrinter.space();
        }
        notFirst = true;
        object.internalToString(cborPrinter);
      });
      cborPrinter.append(']');
    }

    _getLength = function() {
      return this.#objects.length;
    }

    _get = function() {
      return this;
    }
  }

///////////////////////////
//       CBOR.Map        //
///////////////////////////

  static Map = class extends CBOR.#CborObject {

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
      let newEntry = new CBOR.Map.Entry(this.#getKey(key), CBOR.#cborArgumentCheck(value));
      if (this._constrainedKeys && key.constrainedKeyType()) {
        CBOR.#error("Constrained key option disallows: " + key.constructor.name);
      }
      if (this.#root) {
        // Second key etc.
        if (this._constrainedKeys &&
            this.#lastEntry.key.constructor.name != key.constructor.name) {
          CBOR.#error("Constrained key option disallows mixing types: " + key.constructor.name);
        }
        if (this._deterministicMode) {
          // Normal case for parsing.
          let diff = this.#lastEntry.compare(newEntry.encodedKey);
          if (diff >= 0) {
            CBOR.#error((diff ? "Non-deterministic order for key: " : "Duplicate key: ") + key);
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
              CBOR.#error("Duplicate key: " + key);                      
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
      return CBOR.#cborArgumentCheck(key);
    }

    #missingKey = function(key) {
      CBOR.#error("Missing key: " + key);
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
      defaultValue = defaultValue ? CBOR.#cborArgumentCheck(defaultValue) : null;
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

    _getLength = function() {
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

    internalToString = function(cborPrinter) {
      let notFirst = false;
      cborPrinter.beginMap();
      for (let entry = this.#root; entry; entry = entry.next) {
        if (notFirst) {
          cborPrinter.append(',');
        }
        notFirst = true;
        cborPrinter.newlineAndIndent();
        entry.key.internalToString(cborPrinter);
        cborPrinter.append(':');
        cborPrinter.space();
        entry.value.internalToString(cborPrinter);
      }
      cborPrinter.endMap(notFirst);
    }

    _get = function() {
      return this;
    }
  }

///////////////////////////
//       CBOR.Tag        //
///////////////////////////

  static Tag = class extends CBOR.#CborObject {

    static RESERVED_TAG_COTX = 1010n;

    #tagNumber;
    #object;

    constructor(tagNumber, object) {
      super();
      this.#tagNumber = CBOR.#typeCheck(tagNumber, 'BigInt');
      this.#object = CBOR.#cborArgumentCheck(object);
      if (tagNumber < 0n || tagNumber >= 0x10000000000000000n) {
        CBOR.#error("Tag value is out of range");
      }
      if (tagNumber == CBOR.Tag.RESERVED_TAG_COTX) {
        if (object.constructor.name != CBOR.Array.name || object.length != 2 ||
            object.get(0).constructor.name != CBOR.String.name) {
          this.#errorInObject("Invalid COTX object");
        }
      } else if (tagNumber == 0n) {
        if (object.constructor.name == CBOR.String.name) {
          let dateTime = object.getString();
          if (dateTime.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(\.\d+)?(-\d{2}:\d{2}|Z)$/m) &&
              !Number.isNaN(new Date(dateTime).getTime())) {
            return;
          }
        }
        this.#errorInObject("Invalid ISO date string");
      }
    }

    #errorInObject = function(message) {
      CBOR.#error(message + ': ' + this.#object.toDiag(false));
    }

    encode = function() {
      return CBOR.addArrays(CBOR.#finishBigIntAndTag(CBOR.#MT_TAG, this.#tagNumber),
                            this.#object.encode());
    }

    internalToString = function(cborPrinter) {
      cborPrinter.append(this.#tagNumber.toString());
      cborPrinter.append('(');
      this.#object.internalToString(cborPrinter);
      cborPrinter.append(')');
    }

    getTagNumber = function() {
      return this.#tagNumber;
    }

    getTaggedObject = function() {
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
        CBOR.#error("CBOR." + target.name + " expects " + this.numberOfArguments + " argument(s)");
      }
      return new target(...argumentsList);
    }

    construct(target, args) {
      CBOR.#error("CBOR." + target.name + " does not permit \"new\"");
    }
  }

  static Int = new Proxy(CBOR.Int, new CBOR.#handler(1));
  static BigInt = new Proxy(CBOR.BigInt, new CBOR.#handler(1));
  static Float = new Proxy(CBOR.Float, new CBOR.#handler(1));
  static String = new Proxy(CBOR.String, new CBOR.#handler(1));
  static Bytes = new Proxy(CBOR.Bytes, new CBOR.#handler(1));
  static Boolean = new Proxy(CBOR.Boolean, new CBOR.#handler(1));
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
                nonDeterministic,
                constrainedKeys) {
      this.cbor = CBOR.#bytesCheck(cbor);
      this.counter = 0;
      this.sequenceFlag = sequenceFlag;
      this.deterministicMode = !nonDeterministic;
      this.constrainedKeys = constrainedKeys;
    }

    readByte = function() {
      if (this.counter >= this.cbor.length) {
        if (this.sequenceFlag && this.atFirstByte) {
          return CBOR.#MT_NULL;
        }
        CBOR.#error("Reading past end of buffer");
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
      CBOR.#error("Unsupported tag: " + CBOR.#twoHex(tag));
    }

    rangeLimitedBigInt = function(value) {
      if (value > 0xffffffffn) {
        CBOR.#error("Length limited to 0xffffffff");
      }
      return Number(value);
    }

    compareAndReturn = function(decoded, f64) {
      let cborFloat = CBOR.Float(f64);
      if (cborFloat._compare(decoded) && this.deterministicMode) {
        CBOR.#error("Non-deterministic encoding of: " + f64);
      }
      return cborFloat;
    }

    // Interesting algorithm...
    // 1. Read the F16 byte string.
    // 2. Convert the F16 byte string to its F64 IEEE-754 equivalent (JavaScript Number).
    // 3. Create a CBOR.Float object using the F64 Number as input. This causes CBOR.Float to
    //    create an '#encoded' byte string holding the deterministic IEEE-754 representation.
    // 4. Optionally verify that '#encoded' is equal to the byte string read at step 1.
    // Maybe not the most performant solution, but hey, this is a "Reference Implementation" :)
    decompressF16AndReturn = function() {
      let f64;
      let decoded = this.readBytes(2);
      let f16Binary = (decoded[0] << 8) + decoded[1];
      let exponent = f16Binary & 0x7c00;
      let significand = f16Binary & 0x3ff;
      // Catch the three cases of special/reserved numbers.
      if (exponent == 0x7c00) {
        f64 = significand ? Number.NaN : Number.POSITIVE_INFINITY;
      } else {
        // It is a genuine number.
        if (exponent) {
          // Normal representation, add the implicit "1.".
          significand += 0x400;
          // -1: Keep fractional point in line with subnormal numbers.
          // It should preferable be <<= but JavaScript shifts are broken...
          significand *= Math.pow(2, (exponent / 0x400) - 1);
        }
        // Divide with: 2 ^ (Exponent offset + Size of significand - 1).
        f64 = significand / 0x1000000;
      }
      return this.compareAndReturn(decoded, f16Binary >= 0x8000 ? -f64 : f64);
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
            CBOR.#error("Non-deterministic big integer encoding");
          }
          let value = 0n;
          byteArray.forEach(byte => {
            value <<= 8n;
            value += BigInt(byte);
          });
          return CBOR.BigInt(tag == CBOR.#MT_BIG_NEGATIVE ? ~value : value);

        case CBOR.#MT_FLOAT16:
          return this.decompressF16AndReturn();

        case CBOR.#MT_FLOAT32:
           let f32bytes = this.readBytes(4);
           const f32buffer = new ArrayBuffer(4);
           new Uint8Array(f32buffer).set(f32bytes);
           return this.compareAndReturn(f32bytes, new DataView(f32buffer).getFloat32(0, false));

        case CBOR.#MT_FLOAT64:
           let f64bytes = this.readBytes(8);
           const f64buffer = new ArrayBuffer(8);
           new Uint8Array(f64buffer).set(f64bytes);
           return this.compareAndReturn(f64bytes, new DataView(f64buffer).getFloat64(0, false));

        case CBOR.#MT_NULL:
          return CBOR.Null();
 
        case CBOR.#MT_TRUE:
        case CBOR.#MT_FALSE:
          return CBOR.Boolean(tag == CBOR.#MT_TRUE);
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
          CBOR.#error("Non-deterministic N encoding for tag: 0x" + CBOR.#twoHex(tag));
        }
      }
      // N successfully decoded, now switch on major type (upper three bits).
      switch (tag & 0xe0) {

        case CBOR.#MT_TAG:
          return CBOR.Tag(bigN, this.getObject());

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
      CBOR.#error("Unexpected data encountered after CBOR object");
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

  static initExtended = function(cbor, sequenceFlag, nonDeterministic, constrainedKeys) {
    return new CBOR.#_decoder(cbor, 
                              sequenceFlag,
                              nonDeterministic, 
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
  
    constructor(cborText, sequenceFlag) {
      this.cborText = cborText;
      this.sequenceFlag = sequenceFlag;
      this.index = 0;
    }
 
  
    parserError = function(error) {
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
      throw new CBOR.DiagnosticNotation.ParserError("\n" + complete +
                "^\n\nError in line " + lineNumber + ". " + error);
    }
  
    readSequenceToEOF = function() {
      try {
        let sequence = [];
        while (true) {
          sequence.push(this.getObject());
          if (this.index < this.cborText.length) {
            if (this.sequenceFlag) {
              this.scanFor(",");
            } else {
              this.readChar();
              this.parserError("Unexpected data after token");
            }
          } else {
            return sequence;
          }
        }
      } catch (e) {
        if (e instanceof CBOR.DiagnosticNotation.ParserError) {
          throw e;
        }
        // The exception apparently came from a deeper layer.
        // Make it a parser error and remove the original error name.
        this.parserError(e.toString().replace(/.*Error\: ?/g, ''));
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
            this.parserError("b32 not implemented");
          }
          this.scanFor("64");
          return this.getBytes(true);
        
        case 't':
          this.scanFor("rue");
          return CBOR.Boolean(true);
     
        case 'f':
          this.scanFor("alse");
          return CBOR.Boolean(false);
     
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
          this.parserError("Unexpected character: " + this.toChar(this.readChar()));
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

          case '_':
            if (!prefix) {
              this.parserError("'_' is only permitted for 0b, 0o, and 0x numbers");
            }
            this.readChar();

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
          this.parserError("Floating point value out of range");
        }
        return CBOR.Float(negative ? -value : value);
      }
      if (this.nextChar() == '(') {
        // Do not accept '-', 0xhhh, or leading zeros
        this.testForNonDecimal(prefix);
        if (negative || (token.length > 1 && token.charAt(0) == '0')) {
          this.parserError("Tag syntax error");
        }
        this.readChar();
        let tagNumber = BigInt(token);
        let cborTag = CBOR.Tag(tagNumber, this.getObject());
        this.scanFor(")");
        return cborTag;
      }
      let bigInt = BigInt((prefix == null ? '' : prefix) + token);
      // Clone: slight quirk to get the optimal CBOR integer type  
      return CBOR.BigInt(negative ? -bigInt : bigInt).clone();
    }

    testForNonDecimal = function(nonDecimal) {
      if (nonDecimal) {
        this.parserError("0b, 0o, and 0x prefixes are only permited for integers");
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
          this.parserError("Expected: '" + c + "' actual: " + this.toChar(actual));
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
                this.parserError("Invalid escape character " + this.toChar(c));
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
              this.parserError("Unexpected control character: " + this.toChar(c));
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
        this.parserError("Unexpected EOF");
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
// CBOR.diagDecode()         //
// CBOR.diagDecodeSequence() //
///////////////////////////////

  static diagDecode = function(cborText) {
    return new CBOR.DiagnosticNotation(cborText, false).readSequenceToEOF()[0];
  }

  static diagDecodeSequence = function(cborText) {
    return new CBOR.DiagnosticNotation(cborText, true).readSequenceToEOF();
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
    CBOR.#error("Argument is not an 'Uint8Array'");
  }

  static #typeCheck = function(object, type) {
    if (typeof object != type.toLowerCase()) {
      CBOR.#error("Argument is not a '" + type + "'");
    }
    return object;
  }

  static #intCheck = function(value) {
    CBOR.#typeCheck(value, 'Number');
    if (!Number.isSafeInteger(value)) {
      CBOR.#error(Number.isInteger(value) ? "Argument is outside of Number.MAX_SAFE_INTEGER" :
                  "Argument is not an integer");
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

  static #CborPrinter = class {

    indentationLevel = 0;
    buffer = '';

    constructor(prettyPrint) {
      this.prettyPrint = prettyPrint;
    }

    beginMap = function() {
      this.indentationLevel++;
      this.buffer += '{';
    }

    append = function(string) {
      this.buffer += string;
    }

    space = function() {
      if (this.prettyPrint) {
        this.buffer += ' ';
      }
    }

    newlineAndIndent = function() {
      if (this.prettyPrint) {
        this.buffer += '\n';
        for (let i = 0; i < this.indentationLevel; i++) {
          this.buffer += '  ';
        }
      }
    }

    endMap = function(notEmpty) {
      this.indentationLevel--;
      if (notEmpty) {
        this.newlineAndIndent();
      }
      this.buffer += '}';
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

  static #cborArgumentCheck = function(object) {
    if (object instanceof CBOR.#CborObject) {
      return object;
    }
    CBOR.#error("Argument is not a CBOR.* object: " + (object ? object.constructor.name : 'null'));
  }

  static #decodeOneHex(charCode) {
    if (charCode >= 0x30 && charCode <= 0x39) return charCode - 0x30;
    if (charCode >= 0x61 && charCode <= 0x66) return charCode - 0x57;
    if (charCode >= 0x41 && charCode <= 0x46) return charCode - 0x37;
    CBOR.#error("Bad hex character: " + String.fromCharCode(charCode));
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
      CBOR.#error("Uneven number of characters in hex string");
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
