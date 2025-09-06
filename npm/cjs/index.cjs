//////////////////////////////////////////////////////////////////
//                                                              //
//                     CBOR JavaScript API                      //
//                                                              //
// Author: Anders Rundgren (anders.rundgren.net@gmail.com)      //
// Repository: https://github.com/cyberphone/CBOR.js#cborjs     //
//////////////////////////////////////////////////////////////////

'use strict';

// Single global static object.
class CBOR {

  // Super class for all CBOR wrappers.
  static #CborObject = class {

    #readFlag;
    _immutableFlag;

    constructor() {
      this.#readFlag = false;
      this._immutableFlag = false;
    }

    getInt53 = function() {
      if (this instanceof CBOR.BigInt) {
        // During decoding, integers outside of Number.MAX_SAFE_INTEGER
        // automatically get "BigInt" representation. 
        CBOR.#error("Integer is outside of Number.MAX_SAFE_INTEGER, use getBigInt()");
      }
      return this.#checkTypeAndGetValue(CBOR.Int);
    }

    #rangeInt = function(min, max) {
      let value = this.getInt53();
      if (value < min || value > max) {
        CBOR.#error("Value out of range: " + value);
      }
      return value;
    } 

    getInt8 = function() {
      return this.#rangeInt(-0x80, 0x7f);
    }

    getUint8 = function() {
      return this.#rangeInt(0, 0xff);
    }

    getInt16 = function() {
      return this.#rangeInt(-0x8000, 0x7fff);
    }

    getUint16 = function() {
      return this.#rangeInt(0, 0xffff);
    }

    getInt32 = function() {
      return this.#rangeInt(-0x80000000, 0x7fffffff);
    }

    getUint32 = function() {
      return this.#rangeInt(0, 0xffffffff);
    }

    getString = function() {
      return this.#checkTypeAndGetValue(CBOR.String);
    }

    getDateTime = function() {
      let iso = this.getString();
      // Fails on https://www.rfc-editor.org/rfc/rfc3339.html#section-5.8
      // Leap second 1990-12-31T15:59:60-08:00
      if (iso.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(\.\d+)?((\-|\+)\d{2}:\d{2}|Z)$/m)) {
        let dateTime = new Date(iso);
        if (Number.isFinite(dateTime.getTime())) {
          return dateTime;
        }
      }
      CBOR.#error("Invalid ISO date string: " + iso);
    }

    getEpochTime = function() {
      let time = this instanceof CBOR.Int ?
                   this.getInt53() * 1000 : Math.round(this.getFloat64() * 1000);
      let epochTime = new Date();
      epochTime.setTime(time);
      return epochTime;
    }

    getBytes = function() {
      return this.#checkTypeAndGetValue(CBOR.Bytes);
    }

    #rangeFloat = function(max) {
      let value = this.getFloat64();
      if (this.length > max) {
        CBOR.#error("Value out of range: " + this.toString());
      }
      return value;
    }

    getFloat16 = function() {
      return this.#rangeFloat(2);
    }

    getFloat32 = function() {
      return this.#rangeFloat(4);
    }

    getFloat64 = function() {
      return this.#checkTypeAndGetValue(CBOR.Float);
    }

    getNonFinite64 = function() {
      return this.#checkTypeAndGetValue(CBOR.NonFinite);
    }

    getExtendedFloat64 = function() {
      if (this instanceof CBOR.NonFinite) {
        switch (this.getNonFinite()) {
          case 0x7e00n:
            return Number.NaN;
          case 0x7c00n:
            return Number.POSITIVE_INFINITY;
          case 0xfc00n:
            return Number.NEGATIVE_INFINITY;
          default:
            CBOR.#error('getExtendedFloat64() only supports the "basic" NaN (7e00)');
        }
      }
      return this.getFloat64();
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
        return BigInt(this.getInt53());
      }
      return this.#checkTypeAndGetValue(CBOR.BigInt);
    }

    #rangeBigInt(min, max) {
      let value = this.getBigInt();
      if (value < min || value > max) {
        CBOR.#error("Value out of range: " + value);
      }
      return value;
    }

    getInt64 = function() {
      return this.#rangeBigInt(-0x8000000000000000n, 0x7fffffffffffffffn);
    }

    getUint64 = function() {
      return this.#rangeBigInt(0n, 0xffffffffffffffffn);
    }

    getSimple = function() {
      return this.#checkTypeAndGetValue(CBOR.Simple);
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

    #noSuchMethod = function(method) {
      CBOR.#error(method + '() not available in: CBOR.' + this.constructor.name); 
    }

    get = function() {
      this.#noSuchMethod("get");
    }

    toDiag = function(prettyPrint) {
      let cborPrinter = new CBOR.#CborPrinter(CBOR.#typeCheck(prettyPrint, 'boolean'));
      this.internalToString(cborPrinter);
      return cborPrinter.buffer;
    }

    toString = function() {
      return this.toDiag(true);
    }

    _immutableTest = function() {
      if (this._immutableFlag) {
        CBOR.#error('Map keys are immutable'); 
      }
    }

    _markAsRead = function() {
      this.#readFlag = true;
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
          this.get().#traverse(this, check);
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
        CBOR.#error("Expected CBOR." + className.name + ", got: CBOR." + this.constructor.name);
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
  static #MT_SIMPLE       = 0xe0;
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
  //  0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F
      1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 , 'b', 't', 'n',  1 , 'f', 'r',  1 ,  1 ,
      1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,
      0 ,  0 , '"',  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,
      0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,
      0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,
      0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 , '\\'];

  static #F64_NAN = new Uint8Array([0x7f, 0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);

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
    // JavaScript "BigInt" object is used for maintaining lossless represention of bignums.
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

    constructor(value) {
      super();
      this.#value = CBOR.#typeCheck(value, 'number');
      // Get the full F64 binary.
      const f64b = new Uint8Array(8);
      new DataView(f64b.buffer, 0, 8).setFloat64(0, value, false);
      // Begin catching the forbidden cases.
      if (!Number.isFinite(value)) {
        CBOR.#error('Use CBOR.NonFinite for "NaN" and "Infinity" support');    
      }
      if (value == 0) { // True for -0.0 as well! 
        this.#encoded = f64b.slice(0, 2);
      } else {
        // It is apparently a genuine (non-zero) number.
        let f32exp;
        let f32signif;
        while (true) {  // "goto" surely beats quirky loop/break/return/flag constructs...
          // The following code depends on that Math.fround works as expected.
          if (value == Math.fround(value)) {
            // Nothing was lost during the conversion, F32 or F16 is on the menu.
            f32exp = ((f64b[0] & 0x7f) << 4) + (f64b[1] >> 4) - 0x380;
            f32signif = ((f64b[1] & 0x0f) << 19) + (f64b[2] << 11) + (f64b[3] << 3) + (f64b[4] >> 5);
            // Very small F32 numbers may require subnormal representation.
            if (f32exp <= 0) {
              // The implicit "1" becomes explicit using subnormal representation.
              f32signif += 0x800000;
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
            let f16exp = f32exp - 0x70;
            // Too small or too big for F16, or running into F16 NaN/Infinity space.
            if (f16exp <= -10 || f16exp > 30) {
              break;
            }
            let f16signif = f32signif >> 13;
            // Finally, check if we need to denormalize F16.
            if (f16exp <= 0) {
              if (f16signif & (1 << (1 - f16exp)) - 1) {
                // Losing bits is not an option, stick to F32.
                break;
              }
              // The implicit "1" becomes explicit using subnormal representation.
              f16signif += 0x400;
              // Put significand in position.
              f16signif >>= (1 - f16exp);
              // Valid and denormalized F16 have exponent = 0.
              f16exp = 0;
            }
            // A rarity, 16 bits turned out being sufficient for representing value.
            this.#encoded = CBOR.#int16ToByteArray( 
                // Put sign bit in position.
                ((f64b[0] & 0x80) << 8) +
                // Exponent.  Put it in front of significand.
                (f16exp << 10) +
                // Significand.
                f16signif);
          } else {
            // Converting value to F32 returned a truncated result.
            // Full 64-bit representation is required.
            this.#encoded = f64b;
          }
          // Common F16 and F64 return point.
          return;
        }
        // Broken loop: 32 bits are apparently needed for maintaining magnitude and precision.
        let f32bin = 
            // Put sign bit in position. Why not << 24?  JS shift doesn't work above 2^31...
            ((f64b[0] & 0x80) * 0x1000000) +
            // Exponent.  Put it in front of significand (<< 23).
            (f32exp * 0x800000) +
            // Significand.
            f32signif;
            this.#encoded = CBOR.addArrays(CBOR.#int16ToByteArray(f32bin / 0x10000), 
                                           CBOR.#int16ToByteArray(f32bin % 0x10000));
      }
    }
    
    encode = function() {
      return CBOR.addArrays(new Uint8Array([(this.#encoded.length >> 2) + CBOR.#MT_FLOAT16]),
                            this.#encoded);
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

    static createExtendedFloat = function(value) {
      if (Number.isFinite(CBOR.#typeCheck(value, 'number'))) {
        return CBOR.Float(value);
      }
      let f64b = new Uint8Array(8);
      new DataView(f64b.buffer, 0, 8).setFloat64(0, value, false);
      let nf = CBOR.NonFinite(CBOR.toBigInt(f64b));
      if (!nf.isSimple()) {
        CBOR.#error("createExtendedFloat() does not support non-trivial NaNs");
      }
      return nf;
    }
  }

///////////////////////////
//     CBOR.String       //
///////////////////////////
 
  static String = class extends CBOR.#CborObject {

    #textString;

    constructor(textString) {
      super();
      this.#textString = CBOR.#typeCheck(textString, 'string');
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
              cborPrinter.append('u00').append(CBOR.#twoHex(c));
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
      this.#value = CBOR.#typeCheck(value, 'boolean');
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
      CBOR.#checkArgs(arguments, 1);
      this._immutableTest();
      this.#objects.push(CBOR.#cborArgumentCheck(object));
      return this;
    }

    get = function(index) {
      CBOR.#checkArgs(arguments, 1);
      this._markAsRead();
      index = CBOR.#intCheck(index);
      if (index < 0 || index >= this.#objects.length) {
        CBOR.#error("Array index out of range: " + index);
      }
      return this.#objects[index];
    }

    update = function(index, object) {
      CBOR.#checkArgs(arguments, 2);
      this._immutableTest();
      index = CBOR.#intCheck(index);
      if (index < 0 || index >= this.#objects.length) {
        CBOR.#error("Array index out of range: " + index);
      } 
      return this.#objects.splice(index, 1, CBOR.#cborArgumentCheck(object))[0]; 
    }

    toArray = function() {
      let array = [];
      this.#objects.forEach(object => array.push(object));
      return array;
    }

    #encodeBody = function(header) {
      this.#objects.forEach(object => {
        header = CBOR.addArrays(header, object.encode());
      });
      return header;
    }

    encodeAsSequence = function() {
      return this.#encodeBody(new Uint8Array());
    }

    encode = function() {
      return this.#encodeBody(CBOR.#encodeTagAndN(CBOR.#MT_ARRAY, this.#objects.length));
    }

    internalToString = function(cborPrinter) {
      cborPrinter.append('[');
      let notFirst = false;
      this.#objects.forEach(object => {
        if (notFirst) {
          cborPrinter.append(',').space();
        }
        notFirst = true;
        object.internalToString(cborPrinter);
      });
      cborPrinter.append(']');
    }

    _getLength = function() {
      return this.#objects.length;
    }
  }

///////////////////////////
//       CBOR.Map        //
///////////////////////////

  static Map = class extends CBOR.#CborObject {

    #entries = [];
    #preSortedKeys = false;
    #lastLookup = 0;

    static Entry = class {

      constructor(key, object) {
        this.key = key;
        this.object = object;
        this.encodedKey = key.encode();
      }

      compare = function(encodedKey) {
        return CBOR.compareArrays(this.encodedKey, encodedKey);
      }

      compareAndTest = function(entry) {
        let diff = this.compare(entry.encodedKey);
        if (diff == 0) {
          CBOR.#error("Duplicate key: " + this.key);
        }
        return diff > 0;
      }
    }

    set = function(key, object) {
      CBOR.#checkArgs(arguments, 2);
      this._immutableTest();
      let newEntry = new CBOR.Map.Entry(this.#getKey(key), CBOR.#cborArgumentCheck(object));
      this.#makeImmutable(key);
      let insertIndex = this.#entries.length;
      if (insertIndex) {
        let endIndex = insertIndex - 1;
        if (this.#preSortedKeys) {
          // Normal case for deterministic decoding.
          if (this.#entries[endIndex].compareAndTest(newEntry)) {
            CBOR.#error("Non-deterministic order for key: " + key);
          }
        } else {
          // Programmatically created key or the result of unconstrained decoding.
          // Then we need to test and sort (always produce deterministic CBOR).
          // The algorithm is based on binary sort and insertion.
          insertIndex = 0;
          let startIndex = 0;
          while (startIndex <= endIndex) {
            let midIndex = (endIndex + startIndex) >> 1;
            if (newEntry.compareAndTest(this.#entries[midIndex])) {
              // New key is bigger than the looked up entry.
              // Preliminary assumption: this is the one, but continue.
              insertIndex = startIndex = midIndex + 1;
            } else {
              // New key is smaller, search lower parts of the array.
              endIndex = midIndex - 1;
            }
          }
        }
      }
      // If insertIndex == this.#entries.length, the key will be appended.
      // If insertIndex == 0, the key will be first in the list.
      this.#entries.splice(insertIndex, 0, newEntry);
      return this;
    }

    setDynamic = function(dynamic) {
      return dynamic(this);
    }

    #getKey = function(key) {
      return CBOR.#cborArgumentCheck(key);
    }

    #lookup(key, mustExist) {
      let encodedKey = this.#getKey(key).encode();
      let startIndex = 0;
      let endIndex = this.#entries.length - 1;
      while (startIndex <= endIndex) {
        let midIndex = (endIndex + startIndex) >> 1;
        let entry = this.#entries[midIndex];
        let diff = entry.compare(encodedKey);
        if (diff == 0) {
          this.#lastLookup = midIndex;
          return entry;
        }
        if (diff < 0) {
          startIndex = midIndex + 1;
        } else {
          endIndex = midIndex - 1;
        }
      }
      if (mustExist) {
        CBOR.#error("Missing key: " + key);
      }
      return null;
    }

    update = function(key, object, existing) {
      CBOR.#checkArgs(arguments, 3);
      this._immutableTest();
      let entry = this.#lookup(key, existing);
      let previous;
      if (entry) {
        previous = entry.object;
        entry.object = CBOR.#cborArgumentCheck(object);
      } else {
        previous = null;
        this.set(key, object);
      }
      return previous;
    }

    merge = function(map) {
      CBOR.#checkArgs(arguments, 1);
      this._immutableTest();
      if (!(map instanceof CBOR.Map)) {
        CBOR.#error("Argument must be of type CBOR.Map");
      }
      map.#entries.forEach(entry => {
        this.set(entry.key, entry.object);
      });
      return this;
    }

    get = function(key) {
      CBOR.#checkArgs(arguments, 1);
      this._markAsRead();
      return this.#lookup(key, true).object;
    }

    getConditionally = function(key, defaultObject) {
      CBOR.#checkArgs(arguments, 2);
      let entry = this.#lookup(key, false);
      // Note: defaultValue may be 'null'
      defaultObject = defaultObject ? CBOR.#cborArgumentCheck(defaultObject) : null;
      return entry ? entry.object : defaultObject;
    }

    getKeys = function() {
      let keys = [];
      this.#entries.forEach(entry => {
        keys.push(entry.key);
      });
      return keys;
    }

    remove = function(key) {
      CBOR.#checkArgs(arguments, 1);
      this._immutableTest();
      let targetEntry = this.#lookup(key, true);
      this.#entries.splice(this.#lastLookup, 1);
      return targetEntry.object;
    }

    _getLength = function() {
      return this.#entries.length;
    }

    containsKey = function(key) {
      CBOR.#checkArgs(arguments, 1);
      return this.#lookup(key, false) != null;
    }

    encode = function() {
      let encoded = CBOR.#encodeTagAndN(CBOR.#MT_MAP, this.#entries.length);
      this.#entries.forEach(entry => {
        encoded = CBOR.addArrays(encoded, 
                                 CBOR.addArrays(entry.encodedKey, entry.object.encode()));
      });
      return encoded;
    }

    internalToString = function(cborPrinter) {
      let notFirst = false;
      cborPrinter.beginMap();
      this.#entries.forEach(entry => {
        if (notFirst) {
          cborPrinter.append(',');
        }
        notFirst = true;
        cborPrinter.newlineAndIndent();
        entry.key.internalToString(cborPrinter);
        cborPrinter.append(':').space();
        entry.object.internalToString(cborPrinter);
      });
      cborPrinter.endMap(notFirst);
    }

    setSortingMode = function(preSortedKeys) {
      CBOR.#checkArgs(arguments, 1);
      this.#preSortedKeys = preSortedKeys;
      return this;
    }

    #makeImmutable = function(object) {
      object._immutableFlag = true;
      if (object instanceof CBOR.Map) {
        object.getKeys().forEach(key => {
          this.#makeImmutable(object.get(key));
        });
      } else if (object instanceof CBOR.Array) {
        object.toArray().forEach(value => {
          this.#makeImmutable(value);
        });
      }
    }
  }

///////////////////////////
//       CBOR.Tag        //
///////////////////////////

  static Tag = class extends CBOR.#CborObject {

    static TAG_DATE_TIME  = 0n;
    static TAG_EPOCH_TIME = 1n;
    static TAG_COTX       = 1010n;
  
    static TAG_BIGINT_POS = 2n;
    static TAG_BIGINT_NEG = 3n;

    static ERR_COTX       = "Invalid COTX object: ";
    static ERR_DATE_TIME  = "Invalid ISO date/time object: ";
    static ERR_EPOCH_TIME = "Invalid Epoch time object: ";

    #tagNumber;
    #object;

    #dateTime;
    #epochTime;

    constructor(tagNumber, object) {
      super();
      this.#tagNumber = CBOR.#typeCheck(tagNumber, 'bigint');
      this.#object = CBOR.#cborArgumentCheck(object);
      if (tagNumber < 0n || tagNumber >= 0x10000000000000000n) {
        CBOR.#error("Tag number is out of range");
      }
      if (tagNumber == CBOR.Tag.TAG_BIGINT_POS || tagNumber == CBOR.Tag.TAG_BIGINT_NEG) {
        CBOR.#error("Tag number reserved for 'bigint'");
      }
      if (tagNumber == CBOR.Tag.TAG_DATE_TIME) {
        // Note: clone() because we have mot read it really.
        this.#dateTime = object.clone().getDateTime();
      } else if (tagNumber == CBOR.Tag.TAG_EPOCH_TIME) {
        // Note: clone() because we have mot read it really.
        this.#epochTime = object.clone().getEpochTime();
      } else if (tagNumber == CBOR.Tag.TAG_COTX) {
        if (!(object instanceof CBOR.Array) || object.length != 2 ||
            !(object.get(0) instanceof CBOR.String)) {
          this.#errorInObject(CBOR.Tag.ERR_COTX);
        }
      }
    }

    getDateTime = function() {
      if (!this.#dateTime) {
        this.#errorInObject(CBOR.Tag.ERR_DATE_TIME);
      }
      this.#object.scan();
      return this.#dateTime;
    }

    getEpochTime = function() {
      if (!this.#epochTime) {
        this.#errorInObject(CBOR.Tag.ERR_EPOCH_TIME);
      }
      this.#object.scan();
      return this.#epochTime;
    }

    #errorInObject = function(message) {
      CBOR.#error(message + this.toDiag(false));
    }

    encode = function() {
      return CBOR.addArrays(CBOR.#finishBigIntAndTag(CBOR.#MT_TAG, this.#tagNumber),
                            this.#object.encode());
    }

    internalToString = function(cborPrinter) {
      cborPrinter.append(this.#tagNumber.toString()).append('(');
      this.#object.internalToString(cborPrinter);
      cborPrinter.append(')');
    }

    getTagNumber = function() {
      return this.#tagNumber;
    }

    update = function(object) {
      CBOR.#checkArgs(arguments, 1);
      this._immutableTest();
      let previous = this.#object;
      this.#object = CBOR.#cborArgumentCheck(object);
      return previous;
    }

    get = function() {
      CBOR.#checkArgs(arguments, 0);
      this._markAsRead();
      return this.#object;
    }
  }

///////////////////////////
//      CBOR.Simple      //
///////////////////////////

  static Simple = class extends CBOR.#CborObject {

    #value;

    constructor(value) {
      super();
      this.#value = CBOR.#intCheck(value);
      if (value < 0 || value > 255 || (value > 23 && value < 32)) {
        CBOR.#error("Simple value out of range: " + value);
      }
    }

    encode = function() {
      return CBOR.#encodeTagAndN(CBOR.#MT_SIMPLE, this.#value);
    }

    internalToString = function(cborPrinter) {
      cborPrinter.append('simple(' + this.#value.toString() + ')');
    }

    _get = function() {
      return this.#value;
    }
  }

///////////////////////////
//    CBOR.NonFinite     //
///////////////////////////

  static NonFinite = class extends CBOR.#CborObject {

    #value;
    #original;
    #encoded;

    constructor(value) {
      super();
      this.#createDetermnisticEncoding(value);
    }

    #createDetermnisticEncoding = function(value) {
      this.#original = CBOR.#typeCheck(value, 'bigint');
      if (value > 0xffffffffffffffffn) {
        CBOR.#error("Argument out of range: " + value);
      }
      while (true) {
        this.#value = value;
        this.#encoded = CBOR.fromBigInt(value);
        let pattern;
        switch (this.#encoded.length) {
          case 2:
            pattern = 0x7c00n;
            break;
          case 4:
            pattern = 0x7f800000n;
            break;
          case 8:
            pattern = 0x7ff0000000000000n;
            break;
          default:
            this.#badValue();
        }
        let signed = this.#encoded[0] > 0x7f;
        if ((value & pattern) != pattern) {
          this.#badValue();
        }
        switch (this.#encoded.length) {
          case 4:
            if (value & ((1n << 13n) - 1n)) {
              break;
            }
            value >>= 13n;
            value &= 0x7fffn;
            if (signed) {
              value |= 0x8000n;
            }
            continue;
          case 8:
            if (value & ((1n << 29n) - 1n)) {
              break;
            }
            value >>= 29n;
            value &= 0x7fffffffn;
            if (signed) {
              value |= 0x80000000n;
            }
            continue;
        }
        return;
      }
    }

    isSimple = function() {
      if (this.#encoded.length == 2) {
        switch (this.#value) {
          case 0x7e00n:
          case 0x7c00n:
          case 0xfc00n:
            return true;
        }
      }
      return false;
    }

    setSign = function(sign) {
      let mask = 1n << BigInt((this.#encoded.length * 8) - 1);
      this.#createDetermnisticEncoding((this.#value & (mask - 1n)) | (sign ? mask : 0n));
      return this;
    }

    isNaN = function() {
      let mask;
      switch (this.#encoded.length) {
        case 2:
          mask = 0x3ffn;
          break;
        case 4:
          mask = 0x7fffffn;
          break;
        default:
          mask = 0xfffffffffffffn;
      }
      return (mask & this.#value) != 0n;
    }

    getSign = function() {
      return this.#encoded[0] > 0x7f;
    }

    static createPayloadObject = function(payload) {
      CBOR.#typeCheck(payload, 'bigint');
      if ((payload & 0xfffffffffffffn) != payload) {
        CBOR.#error("Payload out of range: " + payload);
      }
      return CBOR.NonFinite(0x7ff0000000000000n + CBOR.#reverseBits(payload, 52));
    }

    getNonFinite = function() {
      this.scan();
      return this.#value;
    }

    #toNonFinite64 = function(significandLength) {
      let value64 = this.#value;
      value64 &= (1n << significandLength) - 1n;
      value64 = 0x7ff0000000000000n | (value64 << (52n - significandLength));
      if (this.getSign()) {
        value64 |= 0x8000000000000000n;
      }
      return value64;       
    }

    getPayload = function() {
      return CBOR.#reverseBits(this.getNonFinite64() & 0xfffffffffffffn, 52);
    }

    #badValue = function() {
      CBOR.#error("Not a non-finite number: " + this.#original);
    }

    encode = function() {
      return CBOR.addArrays(new Uint8Array([0xf9 + (this.#encoded.length >> 2)]), this.#encoded);
    }

    internalToString = function(cborPrinter) {  
      if (this.isSimple()) {
        cborPrinter.append(this.isNaN() ? "NaN" : this.getSign() ? "-Infinity" : "Infinity");
      } else {
        cborPrinter.append("float'").append(CBOR.toHex(this.#encoded)).append("'");
      }
    }
  
    _getLength = function() {
      return this.#encoded.length;
    }
  
    _get = function() {
      switch (this.#encoded.length) {
        case 2:
          return this.#toNonFinite64(10n);
        case 4:
          return this.#toNonFinite64(23n);
      }
      return this.#value;
    }

    _getValue = function() {
      return this.#value;
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
  static Simple = new Proxy(CBOR.Simple, new CBOR.#handler(1));
  static NonFinite = new Proxy(CBOR.NonFinite, new CBOR.#handler(1));


///////////////////////////
//     Decoder Core      //
///////////////////////////

  static get SEQUENCE_MODE() {
    return 0x1;
  }

  static get LENIENT_MAP_DECODING() {
    return 0x2;
  }

  static get LENIENT_NUMBER_DECODING() {
    return 0x4;
  }

  static Decoder = class {

    constructor(cbor, options) {
      this.cbor = CBOR.#bytesCheck(cbor);
      this.maxLength = cbor.length;
      this.byteCount = 0;
      this.sequenceMode = options & CBOR.SEQUENCE_MODE;
      this.strictMaps = !(options & CBOR.LENIENT_MAP_DECODING);
      this.strictNumbers = !(options & CBOR.LENIENT_NUMBER_DECODING);
    }

    eofError = function() {
      CBOR.#error("Reading past end of buffer");
    }

    readByte = function() {
      if (this.byteCount >= this.maxLength) {
        if (this.sequenceMode && this.atFirstByte) {
          return 0;
        }
        this.eofError();
      }
      this.atFirstByte = false;
      return this.cbor[this.byteCount++];
    }
        
    readBytes = function(length) {
      if (this.byteCount + length  > this.maxLength) {
        this.eofError();
      }
      let result = new Uint8Array(length);
      let q = -1; 
      while (++q < length) {
        result[q] = this.cbor[this.byteCount++];
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

    returnFloat = function(decoded, f64) {
      let cborFloat = CBOR.Float(f64);
      if (this.strictNumbers && cborFloat._compare(decoded)) {
        CBOR.#error("Non-deterministic encoding of floating-point value: " + f64);
      }
      return cborFloat;
    }

    returnNonFinite = function (decoded) {
      let value = CBOR.toBigInt(decoded);
      let nonFinite = CBOR.NonFinite(value);
      if (this.strictNumbers && nonFinite._getValue() != value) {
        CBOR.#error("Non-deterministic encoding of non-finite value: " + 
          CBOR.toHex(CBOR.fromBigInt(value)));
      }
      return nonFinite;
    }

    // Interesting algorithm...
    // 1. Read the F16 byte string.
    // 2. Convert the F16 byte string to its F64 IEEE 754 equivalent (JavaScript Number).
    // 3. Create a CBOR.Float object using the F64 Number as input. This causes CBOR.Float to
    //    create an '#encoded' byte string holding the deterministic IEEE 754 representation.
    // 4. Optionally verify that '#encoded' is equal to the byte string read at step 1.
    // Maybe not the most performant solution, but hey, this is a "Reference Implementation" :)
    decodeF16 = function() {
      let decoded = this.readBytes(2);
      let value = CBOR.toBigInt(decoded);
      let exponent = Number(value & 0x7c00n);
      let significand = Number(value & 0x3ffn);
      // Is it a non-finite number?
      if (exponent == 0x7c00) {
        // Yes, deal with it separately.
        return this.returnNonFinite(decoded);
      }
      // It is a "regular" number.
      if (exponent) {
        // Normal representation, add the implicit "1.".
        significand += 0x400;
        // -1: Keep fractional point in line with subnormal numbers.
        significand *= (1 << ((exponent / 0x400) - 1));
      }
      // Divide with: 2 ^ (Exponent offset + Size of significand - 1).
      let f64 = significand / 0x1000000;
      return this.returnFloat(decoded, decoded[0] < 128 ? f64 : -f64);
    }

    decodeF32 = function() {
      let decoded = this.readBytes(4);
      let value = CBOR.toBigInt(decoded);
      // Is it a non-finite number?
      if ((decoded[0] & 0x7f) == 0x7f && (decoded[1] & 0x80) == 0x80) {
        // Yes, deal with it separately.
        return this.returnNonFinite(decoded);
      }
      // It is a "regular" number.
      return this.returnFloat(decoded, new DataView(decoded.buffer, 0, 4).getFloat32(0, false));
    }

    decodeF64 = function() {
      let decoded = this.readBytes(8);
      // Is it a non-finite number?
      if ((decoded[0] & 0x7f) == 0x7f && (decoded[1] & 0xf0) == 0xf0) {
        // Yes, deal with it separately.
        return this.returnNonFinite(decoded);
      }
      // It is a "regular" number.
      return this.returnFloat(decoded, new DataView(decoded.buffer, 0, 8).getFloat64(0, false));
    }

    selectInteger = function(value) {
      if (value > BigInt(Number.MAX_SAFE_INTEGER) || value < BigInt(Number.MIN_SAFE_INTEGER)) {
        return CBOR.BigInt(value);
      } 
      return CBOR.Int(Number(value));
    }

    getObject = function() {
      let tag = this.readByte();

      // Begin with CBOR types that are uniquely defined by the tag byte.
      switch (tag) {
        case CBOR.#MT_BIG_NEGATIVE:
        case CBOR.#MT_BIG_UNSIGNED:
          let byteArray = this.getObject().getBytes();
          if (this.strictNumbers && (byteArray.length <= 8 || !byteArray[0])) {
            CBOR.#error("Non-deterministic bignum encoding");
          }
          let value = CBOR.toBigInt(byteArray);
          return this.selectInteger(tag == CBOR.#MT_BIG_NEGATIVE ? ~value : value);

        case CBOR.#MT_FLOAT16:
           return this.decodeF16();

        case CBOR.#MT_FLOAT32:
           return this.decodeF32();

        case CBOR.#MT_FLOAT64:
           return this.decodeF64();

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
        if (this.strictNumbers && (bigN < 24n || !(mask & bigN))) {
          CBOR.#error("Non-deterministic N encoding for tag: 0x" + CBOR.#twoHex(tag));
        }
      }
      // N successfully decoded, now switch on major type (upper three bits).
      switch (tag & 0xe0) {
        case CBOR.#MT_SIMPLE:
          return CBOR.Simple(this.rangeLimitedBigInt(bigN));

        case CBOR.#MT_TAG:
          return CBOR.Tag(bigN, this.getObject());

        case CBOR.#MT_UNSIGNED:
          return this.selectInteger(bigN);

        case CBOR.#MT_NEGATIVE:
          return this.selectInteger(~bigN);
    
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
          let cborMap = CBOR.Map().setSortingMode(this.strictMaps);
          for (let q = this.rangeLimitedBigInt(bigN); --q >= 0;) {
            cborMap.set(this.getObject(), this.getObject());
          }
          // Programmatically added elements sort automatically. 
          return cborMap.setSortingMode(false);
    
        default:
          this.unsupportedTag(tag);
      }
    }

    //////////////////////////////
    // Decoder.* public methods //
    //////////////////////////////

    decodeWithOptions = function() {
      this.atFirstByte = true;
      let object = this.getObject();
      if (this.sequenceMode) {
        if (this.atFirstByte) {
          return null;
        }
      } else if (this.byteCount < this.maxLength) {
        CBOR.#error("Unexpected data encountered after CBOR object");
      }
      return object;
    }

    getByteCount = function() {
      return this.byteCount;
    }
  }

///////////////////////////
//     CBOR.decode()     //
///////////////////////////

  static decode = function(cbor) {
    return CBOR.initDecoder(cbor, 0).decodeWithOptions();
  }

///////////////////////////
//  CBOR.initDecoder()  //
///////////////////////////

  static initDecoder = function(cbor, options) {
    return new CBOR.Decoder(cbor, options);
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
  
    constructor(cborText, sequenceMode) {
      this.cborText = cborText;
      this.sequenceMode = sequenceMode;
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
        this.scanNonSignficantData();
        while (this.index < this.cborText.length) {
          if (sequence.length) {
            if (this.sequenceMode) {
              this.scanFor(",");
            } else {
              this.readChar();
              this.parserError("Unexpected data after token");
            }
          }
          sequence.push(this.getObject());
        }
        if (!sequence.length && !this.sequenceMode) {
          this.readChar();
        }
        return sequence;
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
      let actual = this.readChar();
      if (actual != validStop) {
        this.parserError(
          "Expected: ',' or '" + validStop + "' actual: " + this.toReadableChar(actual));
      }
      this.index--;
      return false;
    }
  
    getRawObject = function() {
      switch (this.readChar()) {
    
        case '<':
          this.scanFor("<");
          let sequence = new Uint8Array();
          this.scanNonSignficantData();
          while (this.readChar() != '>') {
            this.index--;
            do {
              sequence = CBOR.addArrays(sequence, this.getObject().encode());
            } while (this.continueList('>'));
          }
          this.scanFor(">");
          return CBOR.Bytes(sequence);
  
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
          if (this.nextChar() == 'a') {
            this.scanFor("alse");
            return CBOR.Boolean(false);
          }
          this.scanFor('loat');
          let floatBytes = this.getBytes(false).getBytes();
          switch (floatBytes.length) {
            case 2:
            case 4:
            case 8:
              break;
            default:
              this.parserError("Argument must be a 16, 32, or 64-bit floating-point number");
          }
          return CBOR.initDecoder(
            CBOR.addArrays(new Uint8Array([0xf9 + (floatBytes.length >> 2)]), floatBytes),
            CBOR.LENIENT_NUMBER_DECODING).decodeWithOptions();
     
        case 'n':
          this.scanFor("ull");
          return CBOR.Null();

        case 's':
            this.scanFor("imple(");
            return this.simpleType();

        case '-':
          if (this.readChar() == 'I') {
            this.scanFor("nfinity");
            return CBOR.NonFinite(0xfc00n);
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
          return CBOR.NonFinite(0x7e00n);

        case 'I':
          this.scanFor("nfinity");
          return CBOR.NonFinite(0x7c00n);
        
        default:
          this.index--;
          this.parserError("Unexpected character: " + this.toReadableChar(this.readChar()));
      }
    }

    simpleType = function() {
      let token = '';
      while (true)  {
        switch (this.nextChar()) {
          case ')':
            break;

          case '+':
          case '-':
          case 'e':
          case '.':
            this.parserError("Syntax error");

          default:
            token += this.readChar();
            continue;
          }
          break;
      }
      this.readChar();
      return CBOR.Simple(Number(token.trim())).clone();
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
          case 'e':
            if (!prefix) {
              floatingPoint = true;
            }
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

    toReadableChar = function(c) {
      let charCode = c.charCodeAt(0); 
      return charCode < 0x20 ? "\\u00" + CBOR.#twoHex(charCode) : "'" + c + "'";
    }

    scanFor = function(expected) {
      [...expected].forEach(c => {
        let actual = this.readChar(); 
        if (c != actual) {
          this.parserError("Expected: '" + c + "' actual: " + this.toReadableChar(actual));
        }
      });
    }

    getString = function(byteString) {
      let s = '';
      while (true) {
        let c;
        switch (c = this.readChar()) {
          // Control character handling
          case '\r':
            if (this.nextChar() == '\n') {
              continue;
            }
            c = '\n';
            break;

          case '\n':
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
                  u16 = (u16 << 4) + CBOR.#decodeOneHex(this.readChar().charCodeAt(0));
                }
                c = String.fromCharCode(u16);
                break;
  
              default:
                this.parserError("Invalid escape character " + this.toReadableChar(c));
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
              this.parserError("Unexpected control character: " + this.toReadableChar(c));
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
            while (this.readChar() != '/') {
            }
            continue;

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
    if (typeof object != type) {
      CBOR.#error("Argument is not a '" + type + "'");
    }
    return object;
  }

  static #intCheck = function(value) {
    CBOR.#typeCheck(value, 'number');
    if (Number.isSafeInteger(value)) {
      return value;
    } else {
      CBOR.#error("Invalid integer: " + value.toString());
    }
  }

  static #finishBigIntAndTag = function(tag, value) {
    // Convert BigInt to Uint8Array (but with a twist).
    let byteArray = CBOR.fromBigInt(value);
    let length = byteArray.length;
    // Prepare for "integer" encoding (1, 2, 4, 8).  Only 3, 5, 6, and 7 need an action.
    while (length < 8 && length > 2 && length != 4) {
      byteArray = CBOR.addArrays(new Uint8Array([0]), byteArray);
      length++;
    }
    // Does this number qualify as a "bignum"?
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
    // It is a "bignum".
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
      return this;
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

  static #checkArgs(list, expected)  {
    if (list.length != expected) {
      CBOR.#error('Expected number of arguments: ' + expected);
    }
  }

  static #reverseBits(bits, fieldWidth) {
    let reversed = 0n;
    let bitCount = 0;
    while (bits > 0n) {
      bitCount++;
      reversed <<= 1n;
      if ((bits & 1n) == 1n)
        reversed |= 1n;
      bits >>= 1n;
    }
    if (bitCount > fieldWidth) {
      CBOR.#error("Field exceeds fieldWidth");
    }
    return reversed << BigInt(fieldWidth - bitCount);
  }

//================================//
//     Public Support Methods     //
//================================//

  static addArrays = function(a, b) {
    let result = new Uint8Array(a.length + b.length);
    result.set(a);
    result.set(b, a.length);
    return result;
  }

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
  
  static toHex = function(byteArray) {
    let result = '';
    byteArray.forEach((element) => {
      result += CBOR.#twoHex(element);
    });
    return result;
  }

  static fromHex = function(hexString) {
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

  static toBigInt = function(array) {
    let value = 0n;
    array.forEach(byte => {
      value <<= 8n;
      value += BigInt(byte);
    });
    return value;
  }

  static fromBigInt = function(bigint) {
    if (bigint < 0n) {
      CBOR.#error("Argument out of range: " + bigint);
    }
    let array = [];
    do {
      array.push(Number(bigint & 0xffn));
    } while (bigint >>= 8n);
    return new Uint8Array(array.reverse());
  }

  static get version() {
    return "1.0.15";
  }
}

module.exports = CBOR;
