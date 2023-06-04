// Testing alterntives

'use strict';


class CBOR {

static CBORRoot = class {
  yy = function() {
     return this.getNumber();
  }
}

static _Array = class extends CBOR.CBORRoot {
   static legs = 5;
   constructor() {
       super();
       console.log('woof');
   }

   getNumber = function() {return 6}
}
// progmatic use of `new` via .construct
// preload the first argument with the class we want to call;
// proxy the actual Reflect.construct method but point all gets and sets to the static Class constructor, in english: makes static available NOTE this does not mess with Reflect.construct
static Int = new Proxy(
  Reflect.construct.bind(null, CBOR._Array),
  {
    get(tar, prop, val) {
      // access static 
      return Reflect.get(CBOR._Array, prop, val);
    },
    set(tar, prop, val) {
      // access static 
      return Reflect.set(CBOR._Array, prop, val);
    },
    apply(target, thisArg, argumentsList) {
      // make the constructor work 
      return target({...argumentsList, length: argumentsList.length});
    }
  }
);

static hh= function() {
  return CBOR.Int().getNumber();
}

}
CBOR.Int().yy(); // calls constructor
CBOR.Int.legs; // 5
console.log(CBOR.hh());
console.log(CBOR.Int().yy());
