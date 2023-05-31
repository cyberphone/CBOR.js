/*
  *  Copyright 2006-2021 WebPKI.org (http://webpki.org).
  *
  *  Licensed under the Apache License, Version 2.0 (the "License");
  *  you may not use this file except in compliance with the License.
  *  You may obtain a copy of the License at
  *
  *    https://www.apache.org/licenses/LICENSE-2.0
  *
  *  Unless required by applicable law or agreed to in writing, software
  *  distributed under the License is distributed on an "AS IS" BASIS,
  *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  *  See the License for the specific language governing permissions and
  *  limitations under the License.
  *
  */

/**
  * Class for converting diagnostic CBOR to CBOR.
  */
class CBORDiagnosticNotation {

  cborText;
  index;
  sequence;
  
  constructor(cborText, sequence) {
    this.cborText = cborText.toCharArray();
    this.sequence = sequence;
    this.index = 0;
  }
  
  /**
    * Decodes diagnostic notation CBOR to CBOR.
    * 
    * @param cborText String holding diagnostic (textual) CBOR
    * @return {@link CBORObject}
    */
  static decode = function(cborText) {
    return new CBORDiagnosticNotation(cborText, false).readToEOF();
  }

  /**
    * Decodes diagnostic notation CBOR sequence to CBOR.
    * 
    * @param cborText String holding diagnostic (textual) CBOR
    * @return {@link CBORObject}[] Non-empty array of CBOR objects
    */
  static decodeSequence = function(cborText) {
    return new CBORDiagnosticNotation(cborText, true).readSequenceToEOF();
  }

  preportError = function(error) {
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
    throw SyntaxError(complete + "^\n\nError in line " + lineNumber + ". " + error);
  }
  
  readToEOF = function() {
    let cborObject = this.getObject();
    if (this.index < this.cborText.length) {
      this.readChar();
      this.reportError("Unexpected data after token");
    }
    return cborObject;
  }

  readSequenceToEOF = function() {
    let sequence = [];
    while (true) {
      sequence.push(this.getObject());
      if (this.index < this.cborText.length) {
        this.scanFor(",");
      } else {
        return sequence;
      }
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
    try {
      if (floatingPoint) {
        this.testForNonDecimal(prefix);
        let value = Number(token);
        // Implicit overflow is not permitted
        if (value.isInfinite()) {
          this.reportError("Floating point value out of range");
        }
        return CBOR.Float(negative ? -value : value);
      }
      if (this.nextChar() == '(') {
        // Do not accept '-', 0xhhh, or leading zeros
        this.testForNonDecimal(prefix);
        if (negative || (token.length() > 1 && token.charAt(0) == '0')) {
          this.reportError("Tag syntax error");
        }
        this.readChar();
        let tagNumber = BigInt(token);
        let taggedbject = this.getObject();
        if (tagNumber == CBOR.Tag.RESERVED_TAG_COTX) {
            if (!taggedbject instanceof CBOR.Array || taggedbject.size() != 2 ||
                !taggedbject.get(0) instanceof CBOR.String) {
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
    } catch (error) {
      this.reportError(error.toString());
    }
  }

  testForNonDecimal = function(nonDecimal) {
    if (nonDecimal) {
      this.reportError("Hexadecimal not permitted here");
    }
  }

  nextChar = function() {
    if (index == this.cborText.length) return String.fromCharCode(0);
    c = this.readChar();
    index--;
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
            return CBOR.Bytes(UTF8.encode(s));
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

  hexCharToChar = function(c) {

    if (c >= '0' && c <= '9') {
      return (char) (c - '0');
    }
    if (c >= 'a' && c <= 'f') {
      return (char) (c - 'a' + 10);
    }
    if (c >= 'A' && c <= 'F') {
      return (char) (c - 'A' + 10);
    }
    reportError(String.format("Bad hex character: %s", toChar(c)));
    return 0; // For the compiler...
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
