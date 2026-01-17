# Application note: Combining CBOR and Large Files
This note shows how you can combine CBOR with large files without embedding the files in CBOR.  The primary goal is to use as little RAM as possible.

Prerequisite: a CBOR decoder being able to read a CBOR object from an _input stream_, while leaving the remaing part of the stream _untouched_.  Using the Java implementation of [CBOR::Core](https://www.ietf.org/archive/id/draft-rundgren-cbor-core-24.html), this works out of the box.

CBOR file in diagnostic notation:
```cbor
# Minimalist document metadata
{
  "file": "shanty-the-cat.jpg",
  "sha256": h'08d1440f4bf1e12b6e6815eaa636a573f1cac6d046a8bd517c32e22b6df0ec96'
}
```
Encoded, this is furnished in the file `metadata.cbor`

The concatnation of `metadata.cbor` and `shanty-the-cat.jpg` is subsequently stored in a file called `payload.bin`:
```
|--------------------|
|   CBOR meta-data   |
|--------------------|
|   attached file    |
|--------------------|
```

The sample code below shows how `payload.bin` could be processed by a receiver:
```java
// test.java

import java.io.IOException;
import java.io.InputStream;

import java.net.URI;

import java.util.HexFormat;
import java.util.Arrays;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;

import java.security.MessageDigest;

import org.webpki.cbor.CBORDecoder;
import org.webpki.cbor.CBORMap;
import org.webpki.cbor.CBORString;


public class test {

  static final CBORString FILE_KEY = new CBORString("file");
  static final CBORString SHA256_KEY = new CBORString("sha256");

  static final int BUFFER_SIZE = 1024;

  public static void main(String[] args) {
    try {
      // Perform an HTTP request and get a stream to the returned body.
      HttpRequest request = HttpRequest.newBuilder()
        .uri(new URI("https://cyberphone.github.io/javaapi/app-notes/cbor-large-payloads/payload.bin"))
        .GET()
        .build();
      HttpResponse<InputStream> response = HttpClient.newBuilder()
        .build()
        .send(request, BodyHandlers.ofInputStream());
      InputStream inputStream = response.body();

      // Begin by reading and decoding the CBOR metadata.
      // Note: the SEQUENCE_MODE makes decoding stop after reading a CBOR object.
      CBORMap metaData = new CBORDecoder(inputStream, 
                                         CBORDecoder.SEQUENCE_MODE,
                                         10000).decodeWithOptions().getMap();

      // The rest of the payload is assumed to hold the attached file.
      // Initialize the SHA256 digest system.
      MessageDigest hashFunction = MessageDigest.getInstance("SHA256");

      // Now read (in modest chunks), the potentially large attached file.
      byte[] buffer = new byte[BUFFER_SIZE];
      int byteCount = 0;
      for (int n; (n = inputStream.read(buffer)) > 0; byteCount += n) {
        // Each chunk updates the SHA256 calculation.
        hashFunction.update(buffer, 0, n);
        /////////////////////////////////////////////////////
        // Store the chunk in an application-specific way. //
        /////////////////////////////////////////////////////
      }
      inputStream.close();
    
      // All is read, now get the completed digest.
      byte[] calculatedSha256 = hashFunction.digest();
      // Verify the hash.
      if (Arrays.compare(calculatedSha256, metaData.get(SHA256_KEY).getBytes()) != 0) {
        throw new IOException("Failed on SHA256");
      }

      // We actually did it!
      System.out.printf("\nSuccessfully received: %s (%d)\n", metaData.get(FILE_KEY).getString(), byteCount);

    } catch (Exception e) {
      // Something is wrong...
      e.printStackTrace();
    }
  }
}

```
If all is good the result should be:
```
Successfully received: shanty-the-cat.jpg (2239423)
```

## Other solutions
Server-based attachments may also be be provided as URLs.
