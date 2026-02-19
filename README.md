<a id="cborjs"></a><br>![CBOR is great](https://cyberphone.github.io/CBOR.js/doc/cbor.js.svg)

This repository contains a
[CBOR JavaScript API](https://cyberphone.github.io/CBOR.js/doc/)
and an associated _reference implementation_.
The API loosely mimics the JavaScript "JSON" object by _exposing a single global object_,
unsurprisingly named "CBOR".  To shield application developers 
from low-level details like CBOR serialization, the API provides a set of high-level
[Wrapper&nbsp;Objects](https://cyberphone.github.io/CBOR.js/doc/#main.wrappers)
that serve as a "bridge" between CBOR and JavaScript.

The wrapper objects are used for _encoding_ CBOR objects,
as well as being the result of CBOR _decoding_. The wrapper concept also enables
strict _type-checking_.

### Design Rationale

The described API builds on the 
[CBOR::Core](https://www.ietf.org/archive/id/draft-rundgren-cbor-core-25.html)
cross-platform profile.

Due to a desire maintaining interoperability between different platforms,
the API "by design" does not address JavaScript specific
types like binary data beyond `Uint8Array`.
See also [CBOR&nbsp;Everywhere](https://github.com/cyberphone/cbor-everywhere/).

### "CBOR" Components
- Self-encoding wrapper objects
- Decoder
- Diagnostic Notation decoder
- Utility methods

### Encoding Example

```javascript
let cbor = CBOR.Map()
               .set(CBOR.Int(1), CBOR.Float(45.7))
               .set(CBOR.Int(2), CBOR.String("Hi there!")).encode();

console.log(CBOR.toHex(cbor));
------------------------------
a201fb4046d9999999999a0269486920746865726521
```
Note: there are no requirements "chaining" objects as shown above; items
may be added to [CBOR.Map](https://cyberphone.github.io/CBOR.js/doc/#wrapper.cbor.map)
and [CBOR.Array](https://cyberphone.github.io/CBOR.js/doc/#wrapper.cbor.array) objects in separate steps.

### Decoding Example

```javascript
let map = CBOR.decode(cbor);
console.log(map.toString());  // Diagnostic notation
----------------------------------------------------
{
  1: 45.7,
  2: "Hi there!"
}

console.log('Value=' + map.get(CBOR.Int(1)).getFloat64());
----------------------------------------------------------
Value=45.7
```

### On-line Testing

On https://cyberphone.github.io/CBOR.js/doc/playground.html you will find a simple Web application,
permitting testing the encoder, decoder, and diagnostic notation implementation.

### NPM Version

For usage with Node.js and Deno, an NPM version is available at https://npmjs.com/package/cbor-core 

### Deterministic Encoding

For maintaining cross-platform interoperability, CBOR.js implements
[Deterministic&nbsp;Encoding](https://cyberphone.github.io/CBOR.js/doc/index.html#main.deterministic).

To shield developers from having to know the inner workings of deterministic encoding, CBOR.js performs
all necessary transformations _automatically_.  This for example means that if the 
[set()](https://cyberphone.github.io/CBOR.js/doc/#cbor.map.set) operations
in the [Encoding&nbsp;Example](#encoding-example) were swapped, the generated CBOR would still be the same.

### Diagnostic Notation Support

To simplify _logging_, _documentation_, and _debugging_, CBOR.js includes support for
[Diagnostic&nbsp;Notation](https://cyberphone.github.io/CBOR.js/doc/index.html#main.diagnostic).

However, diagnostic notation can also be used as _input_ for creating CBOR based _test data_ and
_configuration files_ from text:
```javascript
let cbor = CBOR.fromDiagnostic(`{
# Comments are also permitted
  1: 45.7,
  2: "Hi there!"
}`).encode();

console.log(CBOR.toHex(cbor));
------------------------------
a201fb4046d9999999999a0269486920746865726521
```
Aided by the model used for deterministic encoding, diagnostic notation becomes _bidirectional,_
while remaining faithful to the native CBOR representation.

### Other Compatible Implementations

|Language|URL|
|-|-|
|JDK&nbsp;21+|https://github.com/cyberphone/openkeystore|
|Android/Java|https://github.com/cyberphone/android-cbor|

Updated: 2025-12-18









