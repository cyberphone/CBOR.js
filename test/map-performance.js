// Test program measuring map performance

import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

const TOTAL_SET_OPERATIONS = 200000;

const SMALL_MAP  = 10;
const MEDIUM_MAP = 50;
    
let SORTED_KEYS = [TOTAL_SET_OPERATIONS];
let VALUES = [TOTAL_SET_OPERATIONS];
    
for (let q = 0; q < TOTAL_SET_OPERATIONS; q++) {
  let key = CBOR.Int(q);
  SORTED_KEYS[q] = key;
  VALUES[q] = CBOR.Int(q); 
}
    
function printTime(label, mapSize, startTime, sortFlag) {
  console.log(`${label}(${mapSize}) ${sortFlag ? "sorted" : "unsorted"}\
 map execution time=${new Date().getTime() - startTime.getTime()} ms`);
}
    
function bigMap(sortFlag) {
  let startTime = new Date();
  let map = CBOR.Map().setSortingMode(sortFlag);
        
  for (let q = 0; q < TOTAL_SET_OPERATIONS; q++) {
    map.set(SORTED_KEYS[q], VALUES[q]);
  }
  printTime("SET", TOTAL_SET_OPERATIONS, startTime, sortFlag);

  startTime = new Date();
  for (let n = 0; n < TOTAL_SET_OPERATIONS ; n++) {
    if (map.get(SORTED_KEYS[n]).getInt32() != n) {
      throw Error("Big access");
    }
  }
  printTime("GET", TOTAL_SET_OPERATIONS, startTime, sortFlag);

  if (sortFlag) return;

  startTime = new Date();
  map = CBOR.Map();
  for (let n = TOTAL_SET_OPERATIONS; --n >= 0;) {
    map.set(SORTED_KEYS[n], VALUES[n]);
  }
  printTime("Reverse SET", TOTAL_SET_OPERATIONS, startTime, sortFlag);
}
    
function multipleSmallMaps(mapSize, sortFlag) {
  let map = null;
  let startTime = new Date();
  let maps = TOTAL_SET_OPERATIONS / mapSize;

  for (let q = 0; q < maps; q++) {
    // Creating a CBORMap object is a heavy operation
    map = CBOR.Map().setSortingMode(sortFlag);
    for (let n = 0; n < mapSize; n++) {
      map.set(SORTED_KEYS[n], VALUES[n]);
    }            
  }
  printTime("SET", mapSize, startTime, sortFlag);

  startTime = new Date();
  for (let q = 0; q < maps; q++) {
    for (let n = 0; n < mapSize; n++) {
      if (map.get(SORTED_KEYS[n]).getInt32() != n) {
          throw Error("Medium access");
      }
    }            
  }
  printTime("GET", mapSize, startTime, sortFlag);

  startTime = new Date();
  for (let q = 0; q < maps; q++) {
    map = [];
    for (let n = 0; n < mapSize; n++) {
      let key = SORTED_KEYS[n];
      let entry = {"key": key,
                   "value": VALUES[n],
                   "encoded": key.encode()};
      if (n) {
        if (CBOR.compareArrays(map[n - 1].encoded, entry.encoded) > 0) {
          throw Error("ordering or duplicate");
        }
      }
      map[n] = entry;
    }            
  }
  printTime("SET naked-map", mapSize, startTime, sortFlag);

  if (sortFlag) return;

  startTime = new Date();
  for (let q = 0; q < maps; q++) {
    // Creating a CBORMap object is a heavy operation
    map = CBOR.Map();
    for (let n = mapSize; --n >= 0;) {
      map.set(SORTED_KEYS[n], VALUES[n]);
    }            
  }
  printTime("Reverse SET", mapSize, startTime, sortFlag);
}

multipleSmallMaps(SMALL_MAP, true);
multipleSmallMaps(SMALL_MAP, false);

multipleSmallMaps(MEDIUM_MAP, true);
multipleSmallMaps(MEDIUM_MAP, false);

bigMap(true);
bigMap(false);

success();