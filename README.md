# CBOR JavaScript API

This repository contains a
[CBOR JavaScript API](https://cyberphone.github.io/cbor.js/doc/)
_in development_.  The API loosely mimics the "JSON" object by _exposing a single global object_,
unsurprisingly named "CBOR".  The core is based on wrapping CBOR data items
in type-specific objects.  These objects are used for encoding CBOR data,
as well as being the result of CBOR decoding.

To simplify adoption, the API utilizes a CBOR encoding scheme that is _backward compatible_ 
with the "CBOR&nbsp;Playground" (https://cbor.me), maintained by the
[RFC8949](https://www.rfc-editor.org/rfc/rfc8949.html) editor, Carsten&nbsp;Bormann.

<table align='center'><tr><td><i>Note that this API is not ready for external use!</i> 😏</td></tr></table>

### Design Rationale

The proposed API is intended to provide a "baseline" functionality that can easily be implemented
in standard platforms with an emphasis on advanced systems like _Web browsers_, _mobile phones_, and
_Web servers_.  This means that the API "by design" does not address JavaScript specific
constructs like typed arrays beyond `Uint8Array`.  There are also some limitations regarding
CBOR support: for constrained IoT applications, other solutions _may_ be required.
However, in _most_ cases, additional processing at the application layer can deal
with extensions.

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

On https://cyberphone.github.io/cbor.js/doc/playground.html you will find a simple Web application,
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

In the JavaScript API, diagnostic notation as input is tentatively supported by calling
the `CBOR.diagnosticNotation(`_string_`)` method.

Note: the intention with diagnostic notation is not using it as a "wire" format.

### Implementation Note

The code represents a _Reference Implementation_, not code for inclusion in JavaScript engines.  The latter would most certainly require parts to be rewritten in C/C++
since "bit-fiddling" using `Number` and `BigInt` have major limitations.

Updated: 2023-06-02

