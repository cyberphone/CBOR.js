// Test program for the "preSortedKeys" CBOR.Map option
import CBOR from '../npm/mjs/index.mjs';
import { assertTrue, assertFalse, success } from './assertions.js';

let TOTAL_SET_OPERATIONS = 100000;

let SMALL_MAP  = 10;
let MEDIUM_MAP = 250;
    
let SORTED_KEYS = new Array(TOTAL_SET_OPERATIONS);
let REVERSE_KEYS = new Array(TOTAL_SET_OPERATIONS);
let VALUES = new Array(TOTAL_SET_OPERATIONS);
    
for (let q = 0; q < TOTAL_SET_OPERATIONS; q++) {
  let key = CBOR.String("prefix" + q);
  SORTED_KEYS[q] = key;
  REVERSE_KEYS[TOTAL_SET_OPERATIONS - 1 - q] = key;
  VALUES[q] = CBOR.Int(q); 
}

function printTime(label, mapSize, startTime, sortFlag) {
  console.log(label + '(' + mapSize + ') ' + 
    (sortFlag ? "sorted" : "unsorted") + ' map execution time=' +
    (Date.now() - startTime) + ' ms');        
}
      
function multipleSmallMaps(mapSize, sortFlag) {
  let cborMap = null;
  let startTime = Date.now();
  let maps = TOTAL_SET_OPERATIONS / mapSize;
  for (let q = 0; q < maps; q++) {
    // Creating a CBOR.Map object is a heavy operation
    cborMap = CBOR.Map().setSortingMode(sortFlag);
    for (let n = 0; n < mapSize; n++) {
      cborMap.set(SORTED_KEYS[n], VALUES[n]);
    }            
  }
  printTime("SET", mapSize, startTime, sortFlag);
  startTime = Date.now();
  for (let q = 0; q < maps; q++) {
    for (let n = 0; n < mapSize; n++) {
      if (cborMap.get(SORTED_KEYS[n]).getInt() != n) {
        CBORObject.cborError("Medium access");
      }
    }            
  }
  printTime("GET", mapSize, startTime, sortFlag);
  if (sortFlag) return;
  startTime = Date.now();
  for (let q = 0; q < maps; q++) {
    // Creating a CBORMap object is a heavy operation
    cborMap = CBOR.Map();
    for (let n = 0; n < mapSize; n++) {
      cborMap.set(REVERSE_KEYS[n], VALUES[n]);
    }            
  }
  printTime("Reverse SET", mapSize, startTime, sortFlag);
  startTime = Date.now();
  for (let q = 0; q < maps; q++) {
    for (let n = 0; n < mapSize; n++) {
      if (cborMap.get(REVERSE_KEYS[n]).getInt() != n) {
          CBORObject.cborError("Medium access");
      }
    }            
  }
  printTime("Reverse GET", mapSize, startTime, sortFlag);
}
    
multipleSmallMaps(SMALL_MAP, false);
multipleSmallMaps(SMALL_MAP, true);
multipleSmallMaps(MEDIUM_MAP, false);
multipleSmallMaps(MEDIUM_MAP, true);
