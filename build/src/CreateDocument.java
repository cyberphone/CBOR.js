import java.util.ArrayList;

import org.webpki.util.IO;
import org.webpki.util.UTF8;

public class CreateDocument {
  
  static final String WRAPPER_RETURN_DESCR = 
  """
  Wrapper object.""";

  // CBOR.Int

  static final String W_INT_DESCR = 
  """
  Constructor.  Creates a CBOR integer wrapper object.
  See also <a href='#jsnumbers.int'>Integer Numbers</a>.""";
  
  static final String W_INT_P1_DESCR = 
  """
  Integer to be wrapped.""";

  // CBOR.BigInt

  static final String W_BIGINT_DESCR = 
  """
  Constructor.  Creates a CBOR big integer wrapper object.
  See also <a href='#jsnumbers.int'>Integer Numbers</a>.""";
 
  
  static final String W_BIGINT_P1_DESCR = 
  """
  Big integer to be wrapped.""";

  static final String W_GETBIGINT_DESCR = 
  """
  Get CBOR integer of any size.
  See also <a href='#jsnumbers.int'>Integer Numbers</a>.""";
  
  static final String W_GETBIGINT_RETURN_DESCR = 
  """
  Decoded big integer.""";

  // CBOR.Float

  static final String W_FLOAT_DESCR = 
  """
  Constructor.  Creates a CBOR floating point wrapper object.
  See also <a href='#jsnumbers.fp'>Floating Point Numbers</a>.""";
    
  static final String W_FLOAT_P1_DESCR = 
  """
  Floating point number to be wrapped.""";


  static final String W_GETFLOAT_DESCR = 
  """
  Get CBOR floating point value.""";
  
  static final String W_GETFLOAT_RETURN_DESCR = 
  """
  Decoded floating point number.""";

  static final String W_FLOAT_PROP_DESCR = 
  """
  Length in bytes of the underlying CBOR IEEE 754 type."""; 

  // CBOR.String

  static final String W_STRING_DESCR = 
  """
  Constructor.  Creates a CBOR text string wrapper object.""";
    
  static final String W_STRING_P1_DESCR = 
  """
  String to be wrapped.""";


  static final String W_GETSTRING_DESCR = 
  """
  Get CBOR text string.""";
  
  static final String W_GETSTRING_RETURN_DESCR = 
  """
  Decoded text string.""";

  // CBOR.Bytes

  static final String W_BYTES_DESCR = 
  """
  Constructor.  Creates a CBOR byte string wrapper object.""";
    
  static final String W_BYTES_P1_DESCR = 
  """
  Binary data to be wrapped.""";


  static final String W_GETBYTES_DESCR = 
  """
  Get CBOR byte string.""";
  
  static final String W_GETBYTES_RETURN_DESCR = 
  """
  Decoded byte string.""";

  // CBOR.Boolean

  static final String W_BOOLEAN_DESCR = 
  """
  Constructor.  Creates a CBOR boolean wrapper object.""";
    
  static final String W_BOOLEAN_P1_DESCR = 
  """
  Boolean to be wrapped.""";


  static final String W_GETBOOLEAN_DESCR = 
  """
  Get CBOR boolean.""";
  
  static final String W_GETBOOLEAN_RETURN_DESCR = 
  """
  Decoded boolean.""";

  // CBOR.Null

  static final String W_NULL_DESCR = 
  """
  Constructor.  Creates a CBOR <code>null</code> wrapper object.
  See also <a href='#common.isnull'>isNull()</a>.""";

  // CBOR.Array

  static final String W_ARRAY_DESCR = 
  """
  Constructor.  Creates a CBOR array wrapper object.""";
  

  static final String W_ARRAY_ADD_DESCR = 
  """
  Add CBOR wrapper object to the array.""";

  static final String W_ARRAY_ADD_P1_DESCR = 
  """
  Object to be appended to the array.""";
  
  static final String W_ARRAY_ADD_RETURN_DESCR = 
  """
  Current object.""";


  static final String W_ARRAY_GET_DESCR = 
  """
  Get CBOR wrapper object from array.
  If <code><i>index</i></code> is out of range, an exception is thrown.""";

  static final String W_ARRAY_GET_P1_DESCR = 
  """
  Index <code>(0..length-1)</code> of object.""";
  
  static final String W_ARRAY_GET_RETURN_DESCR = 
  """
  Retrieved object.""";    
  

  static final String W_ARRAY_TOARR_DESCR = 
  """
  Copy array.""";

  static final String W_ARRAY_TOARR_RETURN_DESCR = 
  "JavaScript array holding a copy of current <code>" + DataTypes.CBOR_Any + "</code> objects.";  
  
  
  static final String W_ARRAY_PROP_DESCR = 
  """
  Number of objects in the array."""; 

  // CBOR.Map

  static final String W_MAP_DESCR = 
  """
  Constructor.  Creates a CBOR map wrapper object.""";


  static final String W_MAP_SET_DESCR = 
  """
  Set map entry.
  If <code><i>key</i></code> entry is already defined, an exception is thrown.
  <div style='margin-top:0.5em'>Note: <code><i>key</i></code> order is of no importance since
  <a href='#main.deterministic'>Deterministic&nbsp;Encoding</a>
  performs the required map sorting <i>automatically</i>.
  See also <a href='#cbor.map.setsortingmode'>setSortingMode()</a>
  and <a href='#decoder.cbor.initdecoder'>CBOR.initDecoder()</a>.</div>""";

  static final String W_MAP_SET_P1_DESCR = 
  """
  Key (name) wrapper object.""";

  static final String W_MAP_SET_P2_DESCR = 
  """
  Value wrapper object.""";

  static final String W_MAP_SET_RETURN_DESCR = 
  """
  Current object.""";  


  static final String W_MAP_GET_DESCR = 
  """
  Get map entry.
  If <code><i>key</i></code> entry is undefined, an exception is thrown.""";
;

  static final String W_MAP_GET_P1_DESCR = 
  """
  Key (name) wrapper object.""";

  static final String W_MAP_GET_RETURN_DESCR = 
  """
  Retrieved object.""";


  static final String W_MAP_REMOVE_DESCR = 
  """
  Remove map entry.
  If <code><i>key</i></code> entry is undefined, an exception is thrown.""";

  static final String W_MAP_REMOVE_P1_DESCR = 
  """
  Key (name) wrapper object.""";

  static final String W_MAP_REMOVE_RETURN_DESCR = 
  """
  Removed object (value component).""";


  static final String W_MAP_GETCOND_DESCR = 
  """
  Get map entry conditionally.""";
;

  static final String W_MAP_GETCOND_P1_DESCR = 
  """
  Key (name) wrapper object.""";

  static final String W_MAP_GETCOND_P2_DESCR = 
  """
  Value to return if <code><i>key</i></code> entry is undefined.
  <code><i>defaultValue</i></code> may be <code>null</code>.""";

  static final String W_MAP_GETCOND_RETURN_DESCR = 
  """
  Retrieved or default object.""";  

  
  static final String W_MAP_CONTAINS_DESCR = 
  """
  Check map for key presence.""";

  static final String W_MAP_CONTAINS_P1_DESCR = 
  """
  Key (name) wrapper object.""";

  static final String W_MAP_CONTAINS_RETURN_DESCR = 
  """
  <code>true</code> or <code>false</code>.""";   


  static final String W_MAP_GETKEYS_DESCR = 
  """
  Get map keys.""";
  
  static final String W_MAP_GETKEYS_RETURN_DESCR = 
  "JavaScript array holding a copy of current <code>" + DataTypes.CBOR_Any + "</code> map keys.";   

  static final String W_MAP_SET_SORTING_MODE_DESCR =
  """
  Set the sorting mode of the
  <a href='#wrapper.cbor.map'>CBOR.Map()</a> object during
  <a href='#cbor.map.set'>set()</a> operations.
  <div style='margin:0.5em 0'>Typical usage:<br>
  <code>let map = CBOR.Map().setSortingMode(true)</code></div>
  This method may be called multiple times which could be
  useful if you have a moderate set of unsorted meta data keys
  combined with a sorted large table-like set of keys.
  Note that this method has no effect on decoding operations.""";

  static final String W_MAP_SET_SORTING_MODE_P1_DESCR =
  """
  If <code>true</code>,
  keys must be provided in (CBOR wise) ascending order 
  which can improve performance for maps having a huge number of keys.
  Improper key order will cause an exception to be thrown.
  By default map keys are sorted <i>internally</i>.""";

  static final String W_MAP_SET_SORTING_MODE_RETURN_DESCR = "Current object.";;
  

  static final String W_MAP_PROP_DESCR = 
  """
  Number of map entries.""";
  
  // CBOR.Tag

  static final String W_TAG_DESCR = 
  """
  Constructor.  Creates a CBOR tag wrapper object.""";

  static final String W_TAG_P1_DESCR = 
  """
  Tag number.""";

  static final String W_TAG_P2_DESCR = 
  """
  Object to be wrapped in a tag.""";


  static final String W_TAG_GETNUM_DESCR = 
  """
 Get CBOR tag number.""";
  
  static final String W_TAG_GETNUM_RETURN_DESCR = 
  """
  Decoded tag number.""";


  static final String W_TAG_GETOBJ_DESCR = 
  """
  Get tagged CBOR object.""";
  
  static final String W_TAG_GETOBJ_RETURN_DESCR = 
  """
  Retrieved object.""";

  // encode()

  static final String ENCODE_DESCR = 
  """
  Encode <code>this</code> object.
  <div style='margin-top:0.5em'>Note: this method always return CBOR data using 
  <a href='#main.deterministic'>Deterministic Encoding</a>.</div>""";

  static final String ENCODE_RETURN_DESCR = 
  """
  CBOR encoded data.""";

  // clone()

  static final String CLONE_DESCR = 
  """
  Create a new instance of <code>this</code> object, initialized
  with the original CBOR content.""";

  static final String CLONE_RETURN_DESCR = 
  """
  Deep copy of <code>this</code> object.""";

  // equals()

  static final String EQUALS_DESCR = 
  """
  Compare <code>this</code> object with another object with respect to CBOR data.""";
  
  static final String EQUALS_P1_DESCR = 
  """
  The object to compare with.""";

  static final String EQUALS_RETURN_DESCR = 
  """
  <code>true</code> if <code>this</code> object is equal to <code><i>object</i></code>,
  otherwise <code>false</code>.""";

  // isNull()
      
  static final String ISNULL_DESCR = 
  """
  Check for CBOR <code>null</code>.
  <div style='margin:0.5em 0'>Note: if <a href='#common.checkforunread'>checkForUnread()</a>
  is used, <code>this</code> object will only be regarded as &quot;read&quot;
  if it actually is a CBOR <code>null</code> item.</div>
  See also <a href='#wrapper.cbor.null'>CBOR.Null()</a>.""";
  
  static final String ISNULL_RETURN_DESCR = 
  """
  Returns <code>true</code> if <code>this</code> object
  holds a CBOR <code>null</code> item, otherwise <code>false</code>
  is returned.""";

  // scan()

   static final String SCAN_DESCR = 
  """
  Scan <code>this</code> object as well as possible child objects
  in order to make them appear as &quot;read&quot;.
  This is only meaningful in conjunction with
  <a href='#common.checkforunread'>checkForUnread()</a>.""";

  static final String SCAN_RETURN_DESCR = 
  """
  Current object.""";  

  // checkForUnread()

   static final String CHECK4_DESCR = 
  """
   Check if <code>this</code> object including possible child objects has been read
   (like calling <a href='#cbor.int.getint'>getInt()</a>).
   If any of the associated objects have not been read, an exception will be thrown.
   <div style='margin:0.5em 0'>
   The purpose of this method is to detect possible misunderstandings between parties
   using CBOR based protocols.  Together with the strict type checking performed
   by the CBOR.js API, a programmatic counterpart to schema based processing
   can be achieved.
   </div>
   Note that array <a href='#cbor.array.get'>get()</a>,
   map <a href='#cbor.map.get'>get()</a>, and
   tag <a href='#cbor.tag.gettaggedobject'>getTaggedObject()</a>
   only <i>locate</i> objects,
   and thus do not count as &quot;read&quot;.
   <div style='margin:0.5em 0'>
   Note that <i>empty</i> array and map objects are <i>excluded</i> from
   this check.
   </div>
   See also <a href='#common.scan'>scan()</a>.""";
  static final String CHECK4_RETURN_DESCR = 
  """
  Current object.""";  

  // toDiag()

  static final String TODIAG_DESCR = 
  """
  Render <code>this</code> object in <a href='#main.diagnostic'>Diagnostic Notation</a>.
  In similarity to <a href='#common.encode'>encode()</a>, this method always produce
  data in <a href='#main.deterministic'>Deterministic Encoding</a>, irrespective to how 
  the data was created.
  See also: <a href='#common.tostring'>toString()</a>.""";
  
  static final String TODIAG_P1_DESCR = 
  """
  If <code><i>prettyPrint</i></code> is <code>true</code>,
  additional white space is inserted between individual objects
  in maps and arrays, to make the result easier to read.""";

  static final String TODIAG_RETURN_DESCR = 
  """
  Textual version of the wrapped CBOR content.""";

  static final String TOSTRING_DESCR = 
  """
  Render <code>this</code> object in <a href='#main.diagnostic'>Diagnostic Notation</a>.
  Equivalent to calling <a href='#common.todiag'>toDiag()</a>
  with a <code>true</code> argument.""";

   // CBOR.addArrays()

  static final String ADDARRAYS_DESCR = 
  """
  Add two arrays.""";
  
  static final String ADDARRAYS_P1_DESCR = 
  """
  First array.""";

  static final String ADDARRAYS_P2_DESCR = 
  """
  Second array.""";

  static final String ADDARRAYS_RETURN_DESCR = 
  """
  Concatenation of array <code><i>a</i></code> and <code><i>b</i></code>.""";

   // CBOR.compareArrays()

  static final String CMPARRAYS_DESCR = 
  """
  Compare two arrays lexicographically.""";
  
  static final String CMPARRAYS_P1_DESCR = 
  """
  First array.""";

  static final String CMPARRAYS_P2_DESCR = 
  """
  Second array.""";

  static final String CMPARRAYS_RETURN_DESCR = 
  """
  If <code><i>a</i></code> and <code><i>b</i></code> are identical,
  <code>0</code> is retuned. 
  If <code><i>a</i>&nbsp;&gt;&nbsp;<i>b</i></code>,
  a positive number is returned.
  If <code><i>a</i>&nbsp;&lt;&nbsp;<i>b</i></code>,
  a negative number is returned.""";

  // CBOR.toHex()

  static final String TOHEX_DESCR = 
  """
  Encode binary data to hexadecimal.""";
  
  static final String TOHEX_P1_DESCR = 
  """
  Zero or more bytes to be encoded.""";

  static final String TOHEX_RETURN_DESCR = 
  """
  Hexadecimal encoded data.""";

  // CBOR.fromHex()

  static final String FROMHEX_DESCR = 
  """
  Decode hexadecimal data into binary.""";
  
  static final String FROMHEX_P1_DESCR = 
  """
  String with zero or more hexadecimal pairs. Each pair represents one byte.""";

  static final String FROMHEX_RETURN_DESCR = 
  """
  The resulting binary (bytes).""";

  // CBOR.toBase64Url()

  static final String TOB64U_DESCR = 
  """
  Encode binary data to base64Url.""";
  
  static final String TOB64U_P1_DESCR = 
  """
  Zero or more bytes to be encoded.""";

  static final String TOB64U_RETURN_DESCR = 
  """
  Base64Url encoded data.""";

  // CBOR.fromBase64Url()

  static final String FROMB64U_DESCR = 
  """
  Decode base64Url encoded data into binary.
  Note that this method is <i>permissive</i>; it accepts
  base64 encoded data as well as data with or without
  <code>'='</code> padding.""";
  
  static final String FROMB64U_P1_DESCR = 
  """
  String in base64Url notation.  The string may be empty.""";

  static final String FROMB64U_RETURN_DESCR = 
  """
  The resulting binary (bytes).""";

  // CBOR.decode()

  static final String DECODE_DESCR = 
  """
  Decode a CBOR object.
  <div style='margin-top:0.5em'>This method is equivalent to
  <code style='white-space:nowrap'>CBOR.initDecoder(<i>cbor</i>).decodeWithOptions()</code></div>""";
  
  static final String DECODE_P1_DESCR = 
  """
 CBOR binary data <i>holding exactly one CBOR object</i>.""";

  static final String DECODE_RETURN_DESCR = 
  """
  CBOR wrapper object.""";

  // CBOR.initDecoder()

  static final String INITEXT_DESCR = 
  """
  Create a CBOR decoder supporting options.
  This decoding method presumes that the actual
  decoding is performed by one or more (for sequences only) calls to
  <a href='#decoder.decoder.decodewithoptions'><i>Decoder</i>.decodeWithOptions()</a>.
  <div style='margin-top:0.5em'>
  See also 
  <a href='#decoder.decoder.setdeterministicmode'><i>Decoder</i>.setDeterministicMode()</a>,
  <a href='#decoder.decoder.setsequencemode'><i>Decoder</i>.setSequenceMode()</a>, and
  <a href='#decoder.decoder.setnansupport'><i>Decoder</i>.setNaNSupport()</a>.</div>""";
  
  static final String INITEXT_P1_DESCR = 
  """
  The CBOR data (bytes) to be decoded.""";

  static final String INITEXT_RETURN_DESCR = 
  """
  Decoder object for <i>optional</i> use by the 
  <code style='white-space:nowrap'><i>Decoder</i>.set*()</code>
  methods and finally used by
  <a href='#decoder.decoder.decodewithoptions'><i>Decoder</i>.decodeWithOptions()</a>.""";

  // Decoder.setDeterministicMode()

  static final String SET_DET_MODE_DESCR =
  """
  Set CBOR decoder deterministic mode.
  <div style='margin-top:0.5em'>
  By default the decoder assumes that CBOR data conforms to the
  <a href='#main.deterministic'>Deterministic&nbsp;Encoding</a> rules.
  This method enables overriding the default.
  </div>
  """;

  static final String SET_DET_MODE_P1_DESCR =
  """
  If the <code>enforce</code> flag is set to <code>false</code>,
  the decoder will accept CBOR data that does not adhere to the map sorting
  and preferred number serialization requirements.
  This option may be needed for dealing with &quot;legacy&quot; CBOR implementations.
  Note: duplicate keys and other invalid (or not supported) CBOR constructs
  will still cause an exception to be thrown.
  """;

  static final String SET_METHOD_RETURN_DESCR = 
  """
  Updated <code><i>Decoder</i></code> object.""";

    // Decoder.setSequenceMode()

  static final String SET_SEQ_MODE_DESCR =
  """
  Set CBOR decoder sequence mode.
  <div style='margin-top:0.5em'>
  By default the decoder assumes that CBOR data constitutes
  of a single CBOR object.
  This method enables overriding the default.
  </div>
  """;

  static final String SET_SEQ_MODE_P1_DESCR =
  """
  If the <code>sequence</code> flag is set to <code>true</code>,
  the following apply:
  <ul style='padding:0;margin:0 0 0 2em'>
  <li style='margin-top:0'>Immediately return after decoding a CBOR object, while preparing the 
  decoder for the next item.
  See also <a href='#decoder.decoder.getbytecount'><i>Decoder</i>.getByteCount()</a>.</li>
  <li>If no data is found (EOF), <code>null</code> is returned
  (<i>empty</i> sequences are permitted).</li>
  <li>Note that data <i>succeeding</i> a just decoded CBOR object 
  is not verified for correctness.</li>  
  </ul>  
  """;

    // Decoder.setNaNSupport()

  static final String SET_NAN_SUPP_DESCR =
  """
  Set CBOR decoder <code>NaN/Infinity</code> support.
  <div style='margin-top:0.5em'>
  By default the decoder supports 
  <code>NaN</code>, <code>Infinity</code>, 
  and <code style='white-space:nowrap'>-Infinity</code>. 
  In case these variants are not applicable for the application in question,
  this method enables overriding the default.
  </div>
  """;

  static final String SET_NAN_SUPP_P1_DESCR =
  """
  If the <code>accept</code> flag is set to <code>false</code>,
  the mentioned exceptional floating point values will
  cause an exception to be thrown.  
  """;

  // Decoder.decodeWithOptions()

  static final String DECODEEXT_DESCR = 
  """
  Decode CBOR data with options.""";
  
  static final String DECODEEXT_RETURN_DESCR = 
  """
  CBOR wrapper object or <code>null</code> (for EOF sequences only).""";

  // Decoder.getByteCount()

  static final String GETBYTECOUNT_DESCR = 
  """
  Get decoder byte count.
  <div style='margin-top:0.5em'>
  This is equivalent to the position of the next item to be read.</div>""";

  static final String GETBYTECOUNT_RETURN_DESCR = 
  """
  The number of bytes read so far.""";

  // CBOR.diagDecode()

  static final String DIAGDEC_DESCR = 
  """
  Decode a CBOR object provided in <a href='#main.diagnostic'>Diagnostic&nbsp;Notation</a>.
  See also <a href='#decoder.cbor.diagdecodesequence'>CBOR.diagDecodeSequence()</a>.
  <div style='margin-top:0.5em'>Note: this method always returns CBOR data using 
  <a href='#main.deterministic'>Deterministic Encoding</a>.</div>""";
  
  static final String DIAGDEC_P1_DESCR = 
  """
  CBOR in textual format.""";

  static final String DIAGDEC_RETURN_DESCR = 
  """
  CBOR wrapper object.""";

  // CBOR.diagDecodeSequence()

  static final String DIAGDECSEQ_DESCR = 
  """
  Decode a CBOR object provided in <a href='#main.diagnostic'>Diagnostic&nbsp;Notation</a>.
  Unlike <a href='#decoder.cbor.diagdecode'>CBOR.diagDecode()</a>,
  this method also accepts CBOR sequences, using a comma
  character (<code>','</code>) as a separator.""";
  
  static final String DIAGDECSEQ_P1_DESCR = DIAGDEC_P1_DESCR;

  static final String DIAGDECSEQ_RETURN_DESCR = 
  """
  Array holding one or more CBOR wrapper objects.""";


  static final String INTRO = "${INTRO}";

  static final String WRAPPER_INTRO = "${WRAPPER_INTRO}";

  static final String COMMON_INTRO = "${COMMON_INTRO}";

  static final String DECODING_INTRO = "${DECODING_INTRO}";

  static final String UTILITY_INTRO = "${UTILITY_INTRO}";

  static final String JS_NUMBER_CONS = "${JS_NUMBER_CONS}"; 

  static final String DIAGNOSTIC_NOTATION = "${DIAGNOSTIC_NOTATION}"; 

  static final String DETERMINISTIC_ENCODING = "${DETERMINISTIC_ENCODING}";

  static final String EXAMPLES = "${EXAMPLES}";

  static final String EXAMPLES_ENC = "${EXAMPLES_ENC}";

  static final String EXAMPLES_DEC = "${EXAMPLES_DEC}";

  static final String EXAMPLES_DN_DEC = "${EXAMPLES_DN_DEC}";

  static final String VERSION_INFO = "${VERSION_INFO}"; 

  static final String JS_NUMBER_CONS_INT = "${JS_NUMBER_CONS_INT}"; 

  static final String JS_NUMBER_CONS_FP = "${JS_NUMBER_CONS_FP}"; 

  static final String TOC = "${TOC}";

  static final String COMMON_METHODS = "${COMMON_METHODS}";

  static final String DECODING_METHODS = "${DECODING_METHODS}";

  static final String UTILITY_METHODS = "${UTILITY_METHODS}";

  static final String CBOR_WRAPPERS = "${CBOR_WRAPPERS}";

  String template;

  ArrayList<TOCEntry> tocEntries = new ArrayList<>();

  static class Outline implements Cloneable {
    int[] header = {1,1,1,1};
    int ind = 0;

    String getHeader() {
      StringBuilder h = new StringBuilder();
      for (int q = 0; q <= ind; q++) {
        h.append(header[q]).append('.');
      }
      return h.toString();
    }

    void increment() {
      header[ind]++;
    }

    void indent() {
      header[++ind] = 1;
    }

    void undent() {
      --ind;
    }
  }

  Outline outline = new Outline();

  static class TOCEntry {
    String title;
    String link;
    int indent;
  }

  TOCEntry addTocEntry(String title, String link) {
    TOCEntry tocEntry = new TOCEntry();
    tocEntry.title = title;
    tocEntry.link = link;
    tocEntry.indent = outline.ind;
    tocEntries.add(tocEntry);
    return tocEntry;
  }

  enum DataTypes {
    ExtendedDecoder("<i>Decoder</i>"),

    CBOR_Any("CBOR.<i>Wrapper</i>"),

    CBOR_INT("CBOR.Int"),
    CBOR_BIGINT("CBOR.BigInt"),
    CBOR_FLOAT("CBOR.Float"),
    CBOR_STRING("CBOR.String"),
    CBOR_BYTES("CBOR.Bytes"),
    CBOR_NULL("CBOR.Null"),
    CBOR_BOOLEAN("CBOR.Boolean"),
    CBOR_ARRAY("CBOR.Array"),
    CBOR_MAP("CBOR.Map"),
    CBOR_TAG("CBOR.Tag"),

    JS_THIS("this"),

    JS_NUMBER("Number"),
    JS_ARRAY("[...]"),
    JS_BIGINT("BigInt"),
    JS_BOOLEAN("Boolean"),
    JS_STRING("String"),
    JS_UINT8ARRAY("Uint8Array");

    String text;

    DataTypes(String text) {
      this.text = text;
    }

    @Override
    public String toString() {
      return text;
    }
  }

  enum JSType {

  }

  StringBuilder s;

  void beginTable() {
    s.append("<div class='webpkifloat'>\n<table class='webpkitable'" +
             " style='margin-left:2em;width:50em'>\n");
  }

  void endTable() {
    s.append("</table></div>\n");
  }

  void rowBegin() {
    s.append("<tr>");
  }

  void rowEnd() {
    s.append("</tr>\n");
  }

  void tableHeader(String text, int columns) {
    s.append("<th");
    if (columns > 1) {
      s.append(" colspan='").append(columns).append('\'');
    }
    s.append(">").append(text).append("</th>");
  }

  void tableHeader(String text) {
    tableHeader(text, 1);
  }

  void separator(int columns) {
    rowBegin();
    s.append("<td colspan='")
     .append(columns)
     .append("' class='webpkidiv'></td>");
    rowEnd();
  }
  
  void tableCell(String text, int columns) {
    s.append("<td");
    if (columns > 1) {
      s.append(" colspan='").append(columns).append('\'');
    }
    s.append(" style='width:100%'>").append(text).append("</td>");
  }

  void tableCell(String text) {
    tableCell(text, 1);
  }

  void centeredTableCell(String text) {
    s.append("<td style='text-align:center'>").append(text).append("</td>");
  }

  String printSubHeader(String link, String name) {
    String title = outline.getHeader() + "&nbsp;&nbsp;" + name;
    String header = "<h5 id='" + link + "'>" + title + "</h5>\n";
    addTocEntry(title, link);
    return header;
  }

  String printMainHeader(String suffix, String title) {
    String link = "main." + suffix;
    title = outline.getHeader() + "&nbsp;&nbsp;" + title;
    String header = "<h3 id='" + link + "'>" + title + "</h3>\n";
    addTocEntry(title, link);
    return header;
  }

  void printMethod(String prefix, Method method) {
    String iFix = method.name.replace("<i>","").replace("</i>", "");
    s.append(printSubHeader((prefix + "." + iFix).toLowerCase(),  method.name + 
        (method instanceof Wrapper ? "" : "()")));
    beginTable();
    rowBegin();
    tableHeader("Syntax");
    StringBuilder syntax = new StringBuilder("<code>")
        .append(method.name)
        .append("(");
    int columns = method.parameters.isEmpty() ? 2 : 3;
    if (!method.parameters.isEmpty()) {
      boolean notFirst = false;
      for (Parameter parameter : method.parameters) {
        if (notFirst) {
          syntax.append(", ");
        }
        notFirst = true;
        syntax.append("<i>").append(parameter.name).append("</i>");
      }
    }
    syntax.append(")</code>");
    tableCell(syntax.toString(), columns - 1);
    rowEnd();
    rowBegin();
    tableHeader("Description");
    tableCell(method.description, columns - 1);
    rowEnd();
    if (!method.parameters.isEmpty()) {
      separator(columns);
      rowBegin();
      tableHeader("Parameter");
      tableHeader("Type");
      tableHeader("Description");
      rowEnd();
      for (Parameter parameter : method.parameters) {
        rowBegin();
        centeredTableCell("<code><i>" + parameter.name + "</i></code>");
        centeredTableCell("<code>" + parameter.dataType + "</code>");
        tableCell(parameter.description);
        rowEnd();
      }
    }
    if (method.optionalReturnValue != null) {
      separator(columns);
      rowBegin();
      tableHeader("Returns");
      tableHeader("Description", columns - 1);
      rowEnd();
      rowBegin();
      centeredTableCell("<code>" + method.optionalReturnValue.dataType + "</code>");
      tableCell(method.optionalReturnValue.description, columns - 1);
      rowEnd();
    }
    endTable();
  }

  String printCommonMethods() {
    s = new StringBuilder();
    outline.indent();
    for (Method method : commonMethods) {
      printMethod("common", method);
      outline.increment();
    }
    outline.undent();
    return s.toString();
  }

  String printDecoderMethods() {
    s = new StringBuilder();
    outline.indent();
    for (Method method : decoderMethods) {
      printMethod("decoder", method);
      outline.increment();
    }
    outline.undent();
    return s.toString();
  }

  String printUtilityMethods() {
    s = new StringBuilder();
    outline.indent();
    for (Method method : utilityMethods) {
      printMethod("utility", method);
      outline.increment();
    }
    outline.undent();
    return s.toString();
  }

  String printCborWrappers() {
    s = new StringBuilder();
    outline.indent();
    for (Wrapper wrapper : wrappers) {
      printMethod("wrapper", wrapper);
      outline.indent();
      String suffix = wrapper.name.toLowerCase();
      if (!wrapper.methods.isEmpty()) {
        s.append(printSubHeader("methods." + suffix, wrapper.name + " Methods"));
        outline.indent();
        for (Method method : wrapper.methods) {
          printMethod(wrapper.name, method);
          outline.increment();
        }
        outline.undent();
      }
      if (wrapper.property != null) {
        outline.increment();
        s.append(printSubHeader("properties." + suffix, wrapper.name + " Properties"));
        outline.indent();
        printProperty(wrapper.name, wrapper.property);
        outline.undent();
      }
      outline.undent();
      outline.increment();
    }
    outline.undent();
    return s.toString();
  }

  void printProperty(String prefix, Property property) {
    s.append(printSubHeader((prefix + "." + property.name).toLowerCase(), property.name));
    beginTable();
    rowBegin();
    tableHeader("Name");
    tableHeader("Type");
    tableHeader("Description");
    rowEnd();
    rowBegin();
    centeredTableCell("<code><i>" + property.name + "</i></code>");
    centeredTableCell("<code>" + property.dataType + "</code>");
    tableCell(property.description);
    rowEnd();
    endTable();
    outline.increment();
  }

  static class Parameter {
    String name;
    DataTypes dataType;
    String description;
  }

  static class ReturnValue {
    DataTypes dataType;
    String description;
  }

  static class Method {
    String name;
    String description;
    ArrayList<Parameter> parameters = new ArrayList<>();
    ReturnValue optionalReturnValue;

    Method setReturn(DataTypes dataType, String description) {
      optionalReturnValue = new ReturnValue();
      optionalReturnValue.dataType = dataType;
      optionalReturnValue.description = description;
      return this;
    }
  
    Method addParameter(String name, DataTypes dataType, String description) {
      Parameter parameter = new Parameter();
      parameter.name = name;
      parameter.dataType = dataType;
      parameter.description = description;
      parameters.add(parameter);
      return this;
    }
    
  }

  ArrayList<Method> commonMethods = new ArrayList<>();

  Method addCommonMethod(String name, String description) {
    Method method = new Method();
    method.name = name;
    method.description = description;
    commonMethods.add(method);
    return method;
  }

  ArrayList<Method> decoderMethods = new ArrayList<>();

  Method addDecoderMethod(String name, String description) {
    Method method = new Method();
    method.name = name;
    method.description = description;
    decoderMethods.add(method);
    return method;
  }

  ArrayList<Method> utilityMethods = new ArrayList<>();

  Method addUtilityMethod(String name, String description) {
    Method method = new Method();
    method.name = name;
    method.description = description;
    utilityMethods.add(method);
    return method;
  }

  static class Property {
    String name;
    DataTypes dataType;
    String description;
  }

  ArrayList<Wrapper> wrappers = new ArrayList<>();

  static class Wrapper extends Method {

    Property property;

    ArrayList<Method> methods = new ArrayList<>();

    Wrapper addWrapperParameter(String name, DataTypes dataType, String description) {
      super.addParameter(name, dataType, description);
      return this;
    }

    Wrapper addMethod(String name, String description) {
      Method method = new Method();
      method.name = name;
      method.description = description;
      methods.add(method);
      return this;
    }

    Method last() {
      return methods.get(methods.size() - 1);
    }

    Wrapper setReturn(DataTypes dataType, String description) {
      last().setReturn(dataType, description);
      return this;
    }

    Wrapper addParameter(String name, DataTypes dataType, String description) {
      last().addParameter(name, dataType, description);
      return this;
    }

    Wrapper setProperty(String name, DataTypes dataType, String description) {
      property = new Property();
      property.name = name;
      property.dataType = dataType;
      property.description = description;
      return this;
    }
  } 

  Wrapper addWrapper(DataTypes dataType, String description) {
    Wrapper wrapper = new Wrapper();
    wrapper.name = dataType.toString();
    wrapper.description = description;

    wrapper.optionalReturnValue = new ReturnValue();
    wrapper.optionalReturnValue.dataType = dataType;
    wrapper.optionalReturnValue.description = WRAPPER_RETURN_DESCR;
    
    wrappers.add(wrapper);

    return wrapper;
  }

  String printTableOfContents() {
    s = new StringBuilder();
    int length = tocEntries.size();
    for (int i = 0; i < length; i++) {
      TOCEntry tocEntry = tocEntries.get(i);
      int next = tocEntries.get((i < length - 1) ? i + 1 : i).indent;
      boolean startOf = false;
      String image = "empty.svg' style='height:1em;margin-right:1em";
      if (next > tocEntry.indent && next < 3) {
        startOf = true;
        image = "closed.svg' onclick='tocSwitch(this)' " +
        "style='height:1em;margin-right:1em;cursor:pointer";
      }
      s.append("<div style='margin:0 0 0.4em ")
       .append((tocEntry.indent * 2) + 2)
       .append("em'><img alt='n/a' src='")
       .append(image)
       .append("'><a href='#")
       .append(tocEntry.link)
       .append("'>")
       .append(tocEntry.title)
       .append("</a></div>");
      if (startOf) {
        s.append("<div style='display:none'>");
      }
      s.append('\n');
      if (next < tocEntry.indent) {
        int q = tocEntry.indent - next;
        if (tocEntry.indent == 3) {
          q--;
        }
        while (q-- > 0) {
          s.append("</div>\n");
        }
      }
    }
    return s.toString();
  }

  String htmlize(String text) {
    return text.replace("&", "&amp;")
               .replace("\"", "&quot;")
               .replace("<", "&lt;")
               .replace(">", "&gt;")
               .replace(" ", "&nbsp;")
               .replace("\n", "<br>");
  }

  String codeBlock(String rawCode) {
    return 
    "<div class='webpkifloat'><div class='webpkibox' style='margin-left:2em;width:50em'>" + 
    htmlize(rawCode) +
    "</div></div>";
  }

  String exampleEncode() {
    return 
      """
      The following code shows how you can <i>create</i> CBOR-encoded data:
      """ +
      codeBlock("""
let cbor = CBOR.Map()
               .set(CBOR.Int(1), CBOR.Float(45.7))
               .set(CBOR.Int(2), CBOR.String("Hi there!")).encode();

console.log(CBOR.toHex(cbor));
--------------------------------------------
a201fb4046d9999999999a0269486920746865726521
      """);
  }

  String exampleDecode() {
    return 
      """
      The following code shows how you can <i>decode</i> CBOR-encoded data,
      here using the result of the <i>encoding</i> example:
      """ +
      codeBlock("""
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
      """);
  }

  String exampleDNDecode() {
    return 
      """
      The following code shows how you can <i>decode</i> CBOR specified in
      <a href='#main.diagnostic'>Diagnostic&nbsp;Notation</a>:
      """ +
      codeBlock("""
let cbor = CBOR.diagDecode(`{
# Comments are also permitted
  1: 45.7,
  2: "Hi there!"
}`).encode();

console.log(CBOR.toHex(cbor));
------------------------------
a201fb4046d9999999999a0269486920746865726521
      """);
  }

  void replace(String handle, String with) {
    template = template.replace(handle, with);
  }

  void rangedIntMethod(Wrapper wrapper, String method, String min, String max, String optionalText) {
    StringBuilder description = 
      new StringBuilder("Get CBOR integer.<div style='margin-top:0.5em'>Values outside of <kbd>")
        .append(min).append(" </kbd>to<kbd> ")
        .append(max).append("</kbd> will cause an exception to be thrown.");
    if (optionalText != null) {
      description.append(" ").append(optionalText);
    }
    description.append("</div>");
    wrapper.addMethod(method, description.toString())
           .setReturn(DataTypes.JS_NUMBER, "Decoded integer.");
  }

  void rangedBigIntMethod(Wrapper wrapper, String method, String min, String max) {
    StringBuilder description = 
      new StringBuilder("Get CBOR integer.<div style='margin-top:0.5em'>Values outside of <kbd>")
        .append(min).append(" </kbd>to<kbd> ")
        .append(max).append("</kbd> will cause an exception to be thrown.</div>");
    wrapper.addMethod(method, description.toString())
           .setReturn(DataTypes.JS_BIGINT, W_GETBIGINT_RETURN_DESCR);
  }

  void bigIntMethods(Wrapper wrapper) {

    rangedBigIntMethod(wrapper,"getInt64", 
                   "-0x8000000000000000", 
                  "0x7fffffffffffffff");

    rangedBigIntMethod(wrapper,"getUint64", 
                   "0", 
                   "0xffffffffffffffff");

    wrapper.addMethod("getBigInt", W_GETBIGINT_DESCR)
           .setReturn(DataTypes.JS_BIGINT, W_GETBIGINT_RETURN_DESCR);
  }

  void intMethods(Wrapper wrapper) {

    rangedIntMethod(wrapper,"getInt", 
                    "-2<sup>53</sup>+1", 
                    "2<sup>53</sup>-1", 
                    " See also <a href='#cbor.int.getbigint'>getBigInt()</a>.");
    
    rangedIntMethod(wrapper,"getInt8", 
                    "-0x80", 
                    "0x7f", 
                    null);

    rangedIntMethod(wrapper,"getUint8", 
                    "0", 
                    "0xff", 
                    null);
                    
    rangedIntMethod(wrapper,"getInt16", 
                    "-0x8000", 
                    "0x7fff", 
                    null);
                    
    rangedIntMethod(wrapper,"getUint16", 
                    "0", 
                    "0xffff", 
                    null);
                    
    rangedIntMethod(wrapper,"getInt32", 
                    "-0x80000000", 
                    "0x7fffffff", 
                    null);
                    
    rangedIntMethod(wrapper,"getUint32", 
                    "0", 
                    "0xffffffff", 
                    null);

    bigIntMethods(wrapper);    
  }

  CreateDocument(String templateFileName, String documentFileName) {
    template = UTF8.decode(IO.readFile(templateFileName));

      // CBOR.Int

  intMethods(addWrapper(DataTypes.CBOR_INT, W_INT_DESCR)
      .addWrapperParameter("value", DataTypes.JS_NUMBER, W_INT_P1_DESCR));

      // CBIR.BigInt

    bigIntMethods(addWrapper(DataTypes.CBOR_BIGINT, W_BIGINT_DESCR)
      .addWrapperParameter("value", DataTypes.JS_BIGINT, W_BIGINT_P1_DESCR));

      // CBOR.Float

    addWrapper(DataTypes.CBOR_FLOAT, W_FLOAT_DESCR)
      .addWrapperParameter("value", DataTypes.JS_NUMBER, W_FLOAT_P1_DESCR)

      .addMethod("getFloat16", W_GETFLOAT_DESCR + 
          "<div style='margin-top:0.5em'>" +
          "Note: the CBOR object must be a 16-bit IEEE-754 item, " +
          "otherwise an exception will be thrown.</div>")
      .setReturn(DataTypes.JS_NUMBER, W_GETFLOAT_RETURN_DESCR)

      .addMethod("getFloat32", W_GETFLOAT_DESCR + 
          "<div style='margin-top:0.5em'>" +
          "Note: the CBOR object must be a 16-bit or 32-bit IEEE-754 item, " +
          "otherwise an exception will be thrown.</div>")
      .setReturn(DataTypes.JS_NUMBER, W_GETFLOAT_RETURN_DESCR)

      .addMethod("getFloat64", W_GETFLOAT_DESCR)
      .setReturn(DataTypes.JS_NUMBER, W_GETFLOAT_RETURN_DESCR)
 
      .setProperty("length", DataTypes.JS_NUMBER, W_FLOAT_PROP_DESCR);

      // CBOR.String

    addWrapper(DataTypes.CBOR_STRING, W_STRING_DESCR)
      .addWrapperParameter("textString", DataTypes.JS_STRING, W_STRING_P1_DESCR)

      .addMethod("getString", W_GETSTRING_DESCR)
      .setReturn(DataTypes.JS_STRING, W_GETSTRING_RETURN_DESCR);

      // CBOR.Bytes

    addWrapper(DataTypes.CBOR_BYTES, W_BYTES_DESCR)
      .addWrapperParameter("byteString", DataTypes.JS_UINT8ARRAY, W_BYTES_P1_DESCR)

      .addMethod("getBytes", W_GETBYTES_DESCR)
      .setReturn(DataTypes.JS_UINT8ARRAY, W_GETBYTES_RETURN_DESCR);

      // CBOR.Boolean

    addWrapper(DataTypes.CBOR_BOOLEAN, W_BOOLEAN_DESCR)
      .addWrapperParameter("value", DataTypes.JS_BOOLEAN, W_BOOLEAN_P1_DESCR)

      .addMethod("getBoolean", W_GETBOOLEAN_DESCR)
      .setReturn(DataTypes.JS_BOOLEAN, W_GETBOOLEAN_RETURN_DESCR);

      // CBOR.Null

    addWrapper(DataTypes.CBOR_NULL, W_NULL_DESCR);

      // CBOR.Array

    addWrapper(DataTypes.CBOR_ARRAY, W_ARRAY_DESCR)

      .addMethod("add", W_ARRAY_ADD_DESCR)
      .addParameter("object", DataTypes.CBOR_Any, W_ARRAY_ADD_P1_DESCR)
      .setReturn(DataTypes.JS_THIS, W_ARRAY_ADD_RETURN_DESCR)

      .addMethod("get", W_ARRAY_GET_DESCR)
      .addParameter("index", DataTypes.JS_NUMBER, W_ARRAY_GET_P1_DESCR)
      .setReturn(DataTypes.CBOR_Any, W_ARRAY_GET_RETURN_DESCR)

      .addMethod("toArray", W_ARRAY_TOARR_DESCR)
      .setReturn(DataTypes.JS_ARRAY, W_ARRAY_TOARR_RETURN_DESCR)

      .setProperty("length", DataTypes.JS_NUMBER, W_ARRAY_PROP_DESCR);

      // CBOR.Map

    addWrapper(DataTypes.CBOR_MAP, W_MAP_DESCR)

      .addMethod("set", W_MAP_SET_DESCR)
      .addParameter("key", DataTypes.CBOR_Any, W_MAP_SET_P1_DESCR)
      .addParameter("value", DataTypes.CBOR_Any, W_MAP_SET_P2_DESCR)
      .setReturn(DataTypes.JS_THIS, W_MAP_SET_RETURN_DESCR)

      .addMethod("get", W_MAP_GET_DESCR)
      .addParameter("key", DataTypes.CBOR_Any, W_MAP_GET_P1_DESCR)
      .setReturn(DataTypes.CBOR_Any, W_MAP_GET_RETURN_DESCR)

      .addMethod("getConditional", W_MAP_GETCOND_DESCR)
      .addParameter("key", DataTypes.CBOR_Any, W_MAP_GETCOND_P1_DESCR)
      .addParameter("defaultValue", DataTypes.CBOR_Any, W_MAP_GETCOND_P2_DESCR)
      .setReturn(DataTypes.CBOR_Any, W_MAP_GETCOND_RETURN_DESCR)

      .addMethod("containsKey", W_MAP_CONTAINS_DESCR)
      .addParameter("key", DataTypes.CBOR_Any, W_MAP_CONTAINS_P1_DESCR)
      .setReturn(DataTypes.JS_BOOLEAN, W_MAP_CONTAINS_RETURN_DESCR)

      .addMethod("remove", W_MAP_REMOVE_DESCR)
      .addParameter("key", DataTypes.CBOR_Any, W_MAP_REMOVE_P1_DESCR)
      .setReturn(DataTypes.CBOR_Any, W_MAP_REMOVE_RETURN_DESCR)

      .addMethod("getKeys", W_MAP_GETKEYS_DESCR)
      .setReturn(DataTypes.JS_ARRAY, W_MAP_GETKEYS_RETURN_DESCR)

      .addMethod("setSortingMode", W_MAP_SET_SORTING_MODE_DESCR)
      .addParameter("preSortedKeys", DataTypes.JS_BOOLEAN, W_MAP_SET_SORTING_MODE_P1_DESCR)
      .setReturn(DataTypes.JS_THIS, W_MAP_SET_SORTING_MODE_RETURN_DESCR)

      .setProperty("length", DataTypes.JS_NUMBER, W_MAP_PROP_DESCR);

      // CBOR.Tag

    addWrapper(DataTypes.CBOR_TAG, W_TAG_DESCR)
      .addWrapperParameter("tagNumber", DataTypes.JS_BIGINT, W_TAG_P1_DESCR)
      .addWrapperParameter("object", DataTypes.CBOR_Any, W_TAG_P2_DESCR)

      .addMethod("getTagNumber", W_TAG_GETNUM_DESCR)
      .setReturn(DataTypes.JS_BIGINT, W_TAG_GETNUM_RETURN_DESCR)

      .addMethod("getTaggedObject", W_TAG_GETOBJ_DESCR)
      .setReturn(DataTypes.CBOR_Any, W_TAG_GETOBJ_RETURN_DESCR);

    // Common

    addCommonMethod("encode", ENCODE_DESCR)
      .setReturn(DataTypes.JS_UINT8ARRAY, ENCODE_RETURN_DESCR);

    addCommonMethod("clone", CLONE_DESCR)
      .setReturn(DataTypes.CBOR_Any, CLONE_RETURN_DESCR);

    addCommonMethod("equals", EQUALS_DESCR)
      .addParameter("object", DataTypes.CBOR_Any, EQUALS_P1_DESCR)
      .setReturn(DataTypes.JS_BOOLEAN, EQUALS_RETURN_DESCR);
 
    addCommonMethod("toDiag", TODIAG_DESCR)
      .addParameter("prettyPrint", DataTypes.JS_BOOLEAN, TODIAG_P1_DESCR)
      .setReturn(DataTypes.JS_STRING, TODIAG_RETURN_DESCR);
   
    addCommonMethod("toString", TOSTRING_DESCR)
      .setReturn(DataTypes.JS_STRING, TODIAG_RETURN_DESCR);

    addCommonMethod("isNull", ISNULL_DESCR)
      .setReturn(DataTypes.JS_BOOLEAN, ISNULL_RETURN_DESCR);

    addCommonMethod("checkForUnread", CHECK4_DESCR)
      .setReturn(DataTypes.JS_THIS, CHECK4_RETURN_DESCR);

    addCommonMethod("scan", SCAN_DESCR)
      .setReturn(DataTypes.JS_THIS, SCAN_RETURN_DESCR);

      // CBOR.decode()

    addDecoderMethod("CBOR.decode", DECODE_DESCR)
      .addParameter("cbor", DataTypes.JS_UINT8ARRAY, DECODE_P1_DESCR)
      .setReturn(DataTypes.CBOR_Any, DECODE_RETURN_DESCR);

      // CBOR.initDecoder()

    addDecoderMethod("CBOR.initDecoder", INITEXT_DESCR)
      .addParameter("cbor", DataTypes.JS_UINT8ARRAY, INITEXT_P1_DESCR)
      .setReturn(DataTypes.ExtendedDecoder, INITEXT_RETURN_DESCR);
      
      // Decoder.setDeterministicMode()

    addDecoderMethod("<i>Decoder</i>.setDeterministicMode", SET_DET_MODE_DESCR)
      .addParameter("enforce", DataTypes.JS_BOOLEAN, SET_DET_MODE_P1_DESCR)
      .setReturn(DataTypes.JS_THIS, SET_METHOD_RETURN_DESCR);

      // Decoder.setSequenceMode()

    addDecoderMethod("<i>Decoder</i>.setSequenceMode", SET_SEQ_MODE_DESCR)
      .addParameter("sequence", DataTypes.JS_BOOLEAN, SET_SEQ_MODE_P1_DESCR)
      .setReturn(DataTypes.JS_THIS, SET_METHOD_RETURN_DESCR);
      
      // Decoder.setNaNSupport()

    addDecoderMethod("<i>Decoder</i>.setNaNSupport", SET_NAN_SUPP_DESCR)
      .addParameter("accept", DataTypes.JS_BOOLEAN, SET_NAN_SUPP_P1_DESCR)
      .setReturn(DataTypes.JS_THIS, SET_METHOD_RETURN_DESCR);

      // Decoder.decodeWithOptions()

    addDecoderMethod("<i>Decoder</i>.decodeWithOptions", DECODEEXT_DESCR)
      .setReturn(DataTypes.CBOR_Any, DECODEEXT_RETURN_DESCR);

      // Decoder.getByteCount()

    addDecoderMethod("<i>Decoder</i>.getByteCount", GETBYTECOUNT_DESCR)
      .setReturn(DataTypes.JS_NUMBER, GETBYTECOUNT_RETURN_DESCR);

      // CBOR.diagDecode()

    addDecoderMethod("CBOR.diagDecode", DIAGDEC_DESCR)
      .addParameter("cborText", DataTypes.JS_STRING, DIAGDEC_P1_DESCR)
      .setReturn(DataTypes.CBOR_Any, DIAGDEC_RETURN_DESCR);

      // CBOR.diagDecodeSequence()

    addDecoderMethod("CBOR.diagDecodeSequence", DIAGDECSEQ_DESCR)
      .addParameter("cborText", DataTypes.JS_STRING, DIAGDECSEQ_P1_DESCR)
      .setReturn(DataTypes.JS_ARRAY, DIAGDECSEQ_RETURN_DESCR);

       // CBOR.addArrays()

    addUtilityMethod("CBOR.addArrays", ADDARRAYS_DESCR)
      .addParameter("a", DataTypes.JS_UINT8ARRAY, ADDARRAYS_P1_DESCR)
      .addParameter("b", DataTypes.JS_UINT8ARRAY, ADDARRAYS_P2_DESCR)
      .setReturn(DataTypes.JS_UINT8ARRAY, ADDARRAYS_RETURN_DESCR);

       // CBOR.compareArrays()

    addUtilityMethod("CBOR.compareArrays", CMPARRAYS_DESCR)
      .addParameter("a", DataTypes.JS_UINT8ARRAY, CMPARRAYS_P1_DESCR)
      .addParameter("b", DataTypes.JS_UINT8ARRAY, CMPARRAYS_P2_DESCR)
      .setReturn(DataTypes.JS_NUMBER, CMPARRAYS_RETURN_DESCR);

      // CBOR.toHex()

    addUtilityMethod("CBOR.toHex", TOHEX_DESCR)
      .addParameter("byteArray", DataTypes.JS_UINT8ARRAY, TOHEX_P1_DESCR)
      .setReturn(DataTypes.JS_STRING, TOHEX_RETURN_DESCR);

      // CBOR.fromHex()

    addUtilityMethod("CBOR.fromHex", FROMHEX_DESCR)
      .addParameter("hexString", DataTypes.JS_STRING, FROMHEX_P1_DESCR)
      .setReturn(DataTypes.JS_UINT8ARRAY, FROMHEX_RETURN_DESCR);

      // CBOR.toBase64Url()

    addUtilityMethod("CBOR.toBase64Url", TOB64U_DESCR)
      .addParameter("byteArray", DataTypes.JS_UINT8ARRAY, TOB64U_P1_DESCR)
      .setReturn(DataTypes.JS_STRING, TOB64U_RETURN_DESCR);

      // CBOR.fromBase64Url()

    addUtilityMethod("CBOR.fromBase64Url", FROMB64U_DESCR)
      .addParameter("base64", DataTypes.JS_STRING, FROMB64U_P1_DESCR)
      .setReturn(DataTypes.JS_UINT8ARRAY, FROMB64U_RETURN_DESCR);

    replace(INTRO, printMainHeader("intro", "Introduction"));
    outline.increment();
    
    replace(WRAPPER_INTRO, printMainHeader("wrappers", "CBOR Wrapper Objects"));
    replace(CBOR_WRAPPERS, printCborWrappers());
    outline.increment();
 
    replace(COMMON_INTRO, printMainHeader("common", "Common Wrapper Methods"));
    replace(COMMON_METHODS, printCommonMethods());
    outline.increment();

    replace(DECODING_INTRO, printMainHeader("decoding", "Decoding CBOR"));
    replace(DECODING_METHODS, printDecoderMethods());
    outline.increment();

    replace(UTILITY_INTRO, printMainHeader("utility", "Utility Methods"));
    replace(UTILITY_METHODS, printUtilityMethods());
    outline.increment();

    replace(JS_NUMBER_CONS, printMainHeader("jsnumbers", "JavaScript Number Considerations"));
    outline.indent();
    replace(JS_NUMBER_CONS_INT, printSubHeader("jsnumbers.int", "Integer Numbers"));
    outline.increment();
    replace(JS_NUMBER_CONS_FP, printSubHeader("jsnumbers.fp", "Floating Point Numbers"));
    outline.undent();
    outline.increment();

    replace(DIAGNOSTIC_NOTATION, printMainHeader("diagnostic", "Diagnostic Notation"));
    outline.increment();

    replace(DETERMINISTIC_ENCODING, printMainHeader("deterministic", "Deterministic Encoding"));
    outline.increment();

    replace(EXAMPLES, printMainHeader("examples", "Using the CBOR API"));
    outline.indent();
    replace(EXAMPLES_ENC, printSubHeader("examples.encoding", "Encode CBOR") +
                          exampleEncode());
    outline.increment();
    replace(EXAMPLES_DEC, printSubHeader("examples.decoding", "Decode CBOR") +
                          exampleDecode());
    outline.increment();
    replace(EXAMPLES_DN_DEC, printSubHeader("examples.dn-decoding", "Using Diagnostic Notation") +
                             exampleDNDecode());
    outline.undent();
    outline.increment();

    replace(VERSION_INFO, printMainHeader("version", "Version"));
    outline.increment();

    replace(TOC, printTableOfContents());

    IO.writeFile(documentFileName, template);
  }
  public static void main(String[] args) {
    new CreateDocument(args[0], args[1]);
  }
}