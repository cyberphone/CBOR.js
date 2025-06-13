// Test program measuring map performance

import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

const TOTAL_SET_OPERATIONS = 200000;

const SMALL_MAP  = 10;
const MEDIUM_MAP = 50;
    
let SORTED_KEYS = [TOTAL_SET_OPERATIONS];
let REVERSE_KEYS = [TOTAL_SET_OPERATIONS];
let VALUES = [TOTAL_SET_OPERATIONS];
    
for (let q = 0; q < TOTAL_SET_OPERATIONS; q++) {
  let key = CBOR.String("prefix" + q);
  SORTED_KEYS[q] = key;
  REVERSE_KEYS[TOTAL_SET_OPERATIONS - 1 - q] = key;
  VALUES[q] = CBOR.Int(q); 
}
    
function printTime(label, mapSize, startTime, sortFlag) {
  console.log(`${label}(${mapSize}) ${sortFlag ? "sorted" : "unsorted"}\
 map execution time=${new Date().getTime() - startTime.getTime()} ms`);
}
    
function bigMap(sortFlag) {
  let startTime = new Date();
  let cborMap = CBOR.Map().setSortingMode(sortFlag);
        
  for (let q = 0; q < TOTAL_SET_OPERATIONS; q++) {
    cborMap.set(SORTED_KEYS[q], VALUES[q]);
  }
  printTime("SET", TOTAL_SET_OPERATIONS, startTime, sortFlag);
  startTime = new Date();
  for (let n = 0; n < TOTAL_SET_OPERATIONS ; n++) {
    if (cborMap.get(SORTED_KEYS[n]).getInt53() != n) {
      throw Error("Big access");
    }
  }
  printTime("GET", TOTAL_SET_OPERATIONS, startTime, sortFlag);
  startTime = new Date();
  if (sortFlag) return;
  cborMap = CBOR.Map();
  for (let q = 0; q < TOTAL_SET_OPERATIONS; q++) {
    cborMap.set(REVERSE_KEYS[q], VALUES[q]);
  }
  printTime("Reverse SET", TOTAL_SET_OPERATIONS, startTime, sortFlag);
  startTime = new Date();
  for (let n = 0; n < TOTAL_SET_OPERATIONS ; n++) {
    if (cborMap.get(REVERSE_KEYS[n]).getInt53() != n) {
      throw Error("Big access");
    }
  }
  printTime("Reverse GET", TOTAL_SET_OPERATIONS, startTime, sortFlag);
}
    
function multipleSmallMaps(mapSize, sortFlag) {
  let cborMap = null;
  let startTime = new Date();
  let maps = TOTAL_SET_OPERATIONS / mapSize;
  for (let q = 0; q < maps; q++) {
    // Creating a CBORMap object is a heavy operation
    cborMap = CBOR.Map().setSortingMode(sortFlag);
    for (let n = 0; n < mapSize; n++) {
      cborMap.set(SORTED_KEYS[n], VALUES[n]);
    }            
  }
  printTime("SET", mapSize, startTime, sortFlag);
  startTime = new Date();
  for (let q = 0; q < maps; q++) {
    for (let n = 0; n < mapSize; n++) {
      if (cborMap.get(SORTED_KEYS[n]).getInt53() != n) {
          throw Error("Medium access");
      }
    }            
  }
  printTime("GET", mapSize, startTime, sortFlag);
  if (sortFlag) return;
  startTime = new Date();
  for (let q = 0; q < maps; q++) {
    // Creating a CBORMap object is a heavy operation
    cborMap = CBOR.Map();
    for (let n = 0; n < mapSize; n++) {
      cborMap.set(REVERSE_KEYS[n], VALUES[n]);
    }            
  }
  printTime("Reverse SET", mapSize, startTime, sortFlag);
  startTime = new Date();
  for (let q = 0; q < maps; q++) {
    for (let n = 0; n < mapSize; n++) {
      if (cborMap.get(REVERSE_KEYS[n]).getInt53() != n) {
          throw Error("Medium access");
      }
    }            
  }
  printTime("Reverse GET", mapSize, startTime, sortFlag);
}
    
multipleSmallMaps(SMALL_MAP, false);
multipleSmallMaps(SMALL_MAP, true);
multipleSmallMaps(MEDIUM_MAP, false);
multipleSmallMaps(MEDIUM_MAP, true);
bigMap(false);
bigMap(true);

success();