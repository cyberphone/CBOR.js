// Simple "decoder" API
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

class XYZDecoder {

  static COUNTER     = CBOR.Int(1);
  static TEMPERATURE = CBOR.Int(2);
  static GREETING    = CBOR.Int(3);

  #counter;
  #temperature;
  #greeting;

  constructor(cbor) {
    // There MUST be exactly three key/value pairs.
    // CBOR data items are type-checked as well.
    let map = CBOR.decode(cbor);
    // If the top-level object is not a CBOR map, the next
    // JavaScript line will throw an exception because there is
    // only one get-method that has a CBOR wrapper as input parameter.
    this.#counter = map.get(XYZDecoder.COUNTER).getUint8();
    this.#temperature = map.get(XYZDecoder.TEMPERATURE).getFloat64();
    this.#greeting = map.get(XYZDecoder.GREETING).getString();
    // We got more than we asked for?
    map.checkForUnread();
  }

  get counter() {
    return this.#counter;
  }

  get temperature() {
    return this.#temperature;
  }

  get greeting() {
    return this.#greeting;
  }

}

let cbor = CBOR.fromHex('a3010202fb404a800346dc5d640363486921');

let xyz = new XYZDecoder(cbor);

assertTrue("counter", xyz.counter == 2);
assertTrue("temperature", xyz.temperature == 53.0001);
assertTrue("greeting", xyz.greeting == 'Hi!');

success();
