// JavaScript source code
import CBOR from '../node-cbor.js';
import promptSync from 'prompt-sync';
const prompt = promptSync();
'use strict';

while (true) {
  let text = prompt('Input BigInt (n or 0xn) : ').replace(/\ /g, '');
  let radix = text.startsWith('0x') ? 16 : 10;
  let encodedCbor = CBOR.BigInt(BigInt(text)).encode();
  console.log("Encoded: " + CBOR.toHex(encodedCbor));
  let decodedCbor =  CBOR.decode(encodedCbor);
  console.log("Decoded: " + 
              (radix == 10 ? '' : '0x') +
              decodedCbor.getBigInt().toString(radix) + 
              " type=CBOR." +  
              decodedCbor.constructor.name);
  try {
    console.log("getInt(): " + 
                (radix == 10 ? '' : '0x') +
                decodedCbor.getInt().toString(radix));
  } catch (error) {
    console.log(error.toString());
  }
}