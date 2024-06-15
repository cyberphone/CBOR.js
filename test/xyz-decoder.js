// simple "encoder" API
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
    let map = CBOR.decode(cbor).getMap();
    this.#counter = map.get(XYZDecoder.COUNTER).getInt();
    this.#temperature = map.get(XYZDecoder.TEMPERATURE).getFloat();
    this.#greeting = map.get(XYZDecoder.GREETING).getString();
    // We got more than we asked for?
    map.checkForUnread();
  }

  getCounter = function() {
    return this.#counter;
  }

  getTemperature = function() {
    return this.#temperature;
  }

  getGreeting = function() {
    return this.#greeting;
  }

}

let cbor = CBOR.fromHex('a3010202fb404a800346dc5d640363486921');

let xyz = new XYZDecoder(cbor);

assertTrue("counter", xyz.getCounter() == 2);
assertTrue("temperature", xyz.getTemperature() == 53.0001);
assertTrue("greeting", xyz.getGreeting() == 'Hi!');

success();
