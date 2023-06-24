<a id="cborjs">![Saturn is great](https://cyberphone.github.io/CBOR.js/doc/cbor.js.svg)

This repository contains a
[CBOR JavaScript API](https://cyberphone.github.io/CBOR.js/doc/)
_in development_.  The API loosely mimics the "JSON" object by _exposing a single global object_,
unsurprisingly named "CBOR".  The core is based on wrapping CBOR data items
in type-specific objects.  These objects are used for encoding CBOR data,
as well as being the result of CBOR decoding.

To simplify adoption, the API utilizes a CBOR encoding scheme that is _backward compatible_
with the "CBOR&nbsp;Playground" (https://cbor.me), maintained by the
[RFC8949](https://www.rfc-editor.org/rfc/rfc8949.html) editor, Carsten&nbsp;Bormann.

### Design Rationale

The proposed API is intended to provide CBOR "baseline" functionality that can easily be implemented
in standard platforms with an emphasis on computationally advanced systems like 
_Web browsers_, _mobile phones_, and _Web servers_.
Due to the desire maintaining interoperability across different platforms,
the API "by design" does not address JavaScript specific
types like `undefined` and binary data beyond `Uint8Array`.
See also: [CBOR Everywhere](https://github.com/cyberphone/cbor-everywhere/).

### "CBOR" Components
- Self-encoding wrapping objects
- Decoder
- Diagnostic Notation decoder
- Utility functions

### Encoding Example

```javascript
let cbor = CBOR.Map()
               .set(CBOR.Int(1), CBOR.Float(45.7))
               .set(CBOR.Int(2), CBOR.String("Hi there!")).encode();

console.log(CBOR.toHex(cbor));
------------------------------
a201fb4046d9999999999a0269486920746865726521
```
Note: there are no requirments "chaining" objects as shown above; items
may be added to `CBOR.Map` and `CBOR.Array` objects in separate steps.

### Decoding Example

```javascript
let map = CBOR.decode(cbor);
console.log(map.toString());  // Diagnostic notation
----------------------------------------------------
{
  1: 45.7,
  2: "Hi there!"
}

console.log('Value=' + map.get(CBOR.Int(1)));
---------------------------------------------
Value=45.7
```

### On-line Testing

On https://cyberphone.github.io/CBOR.js/doc/playground.html you will find a simple Web application,
permitting testing the encoder, decoder, and diagnostic notation implementation.

### Deterministic Encoding Rules

The JavaScript API implements deterministic encoding based on section 4.2 of [RFC8949](https://www.rfc-editor.org/rfc/rfc8949.html).
For maximum interoperability, the API also depends on Rule&nbsp;2 of section 4.2.2, as well as interpreting Appendix&nbsp;A as
_bidirectional_.  For a more thorough description and rationale, turn to: https://cyberphone.github.io/android-cbor/distribution/apidoc/org/webpki/cbor/package-summary.html#deterministic-encoding.

### Diagnostic Notation Support

Diagnostic notation permits displaying CBOR data as human-readable text.  This is practical for _logging_,
_documentation_, and _debugging_ purposes.  Diagnostic notation is an intrinsic part of the API through the `toString()` method.
However, diagnostic notation can also be used as input for creating _test data_ and for
_configuration files_.  A preliminary description can be found here: https://cyberphone.github.io/android-cbor/distribution/apidoc/org/webpki/cbor/package-summary.html#diagnostic-notation.

Note: although possible, the _intention_ with diagnostic notation is not using it as a "wire" format.

### Implementation Note

The code represents a _Reference Implementation_, not code for inclusion in JavaScript engines.  The latter would (for _performance_ reasons), most certainly require parts to be rewritten in native code.

Updated: 2023-06-24
