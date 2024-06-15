// Simple "encoder" API
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

class XYZEncoder {

  static COUNTER     = CBOR.Int(1);
  static TEMPERATURE = CBOR.Int(2);
  static GREETING    = CBOR.Int(3);

  #map;

  constructor() {
    this.#map = CBOR.Map();
  }

  setCounter = function(intVal) {
    this.#map.set(XYZEncoder.COUNTER, CBOR.Int(intVal));
    return this;
  }

  setTemperature = function(floatVal) {
    this.#map.set(XYZEncoder.TEMPERATURE, CBOR.Float(floatVal));
    return this;
  }

  setGreeting = function(stringVal) {
    this.#map.set(XYZEncoder.GREETING, CBOR.String(stringVal));
    return this;
  }

  encode = function() {
    assertTrue("incomplete", this.#map.length == 3);
    return this.#map.encode();
  }
}

let cbor = new XYZEncoder()
    .setCounter(2)
    .setGreeting('Hi!')
    .setTemperature(53.0001)
    .encode();

assertTrue("bad code", CBOR.toHex(cbor) == 'a3010202fb404a800346dc5d640363486921');

success();
