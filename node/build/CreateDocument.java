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

    static final String W_GETINT_DESCR = 
  """
  Reads CBOR integer.
  See also <a href='#cbor.bigint.getbigint'>getBigInt()</a>.""";
  
  static final String W_GETINT_RETURN_DESCR = 
  """
  Decoded integer.""";

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
  Reads CBOR big integer.
  Note that this method is also supported by
  <a href='#wrapper.cbor.int'>CBOR.Int</a>.  This is necessary since
  the CBOR decoder does not know the preferred integer type of a specific element;
  it uses the <i>value</i> as the sole selection mechanism.""";
  
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
  Reads CBOR floating point object.""";
  
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
  Reads CBOR text string.""";
  
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
  Reads CBOR byte string.""";
  
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
  Reads CBOR boolean.""";
  
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
  Adds CBOR wrapper object to the array.""";

  static final String W_ARRAY_ADD_P1_DESCR = 
  """
  Object to be appended to the current array.""";
  
  static final String W_ARRAY_ADD_RETURN_DESCR = 
  """
  Current object.""";


  static final String W_ARRAY_GET_DESCR = 
  """
  Fetches CBOR wrapper object.
  If <code><i>index</i></code> is out of range, an exception is thrown.""";

  static final String W_ARRAY_GET_P1_DESCR = 
  """
  Index <code>(0..length-1)</code> of object.""";
  
  static final String W_ARRAY_GET_RETURN_DESCR = 
  """
  Retrieved object.""";    
  

  static final String W_ARRAY_TOARR_DESCR = 
  """
  Copies array.""";

  static final String W_ARRAY_TOARR_RETURN_DESCR = 
  "Shallow array copy of current <code>" + DataTypes.CBOR_Any + "</code> objects";   
  

  static final String W_ARRAY_GETARR_DESCR = 
  """
  Get array object.
  Note: this method is redundant due to the dynamic nature of the JavaScript
  typing system.  However, if you intend using
  <a href='#common.checkforunread'>checkForUnread()</a>,
  this method must be called <i>before</i> accessing array elements.""";

  static final String W_ARRAY_GETARR_RETURN_DESCR = 
  "Handle to array wrapper.";   
  
  
  static final String W_ARRAY_PROP_DESCR = 
  """
  Number of objects in the array."""; 

  // CBOR.Map

  static final String W_MAP_DESCR = 
  """
  Constructor.  Creates a CBOR map wrapper object.""";


  static final String W_MAP_SET_DESCR = 
  """
  Sets map entry.
  If <code><i>key</i></code> is already defined, an exception is thrown.
  <div style='margin-top:0.5em'>Note that <code><i>key</i></code> order is of no importance since
  <a href='#main.deterministic'>Deterministic&nbsp;Encoding</a>
  performs the required map sorting <i>automatically</i>.</div>""";

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
  Gets map entry.
  If <code><i>key</i></code> is undefined, an exception is thrown.""";
;

  static final String W_MAP_GET_P1_DESCR = 
  """
  Key (name) wrapper object.""";

  static final String W_MAP_GET_RETURN_DESCR = 
  """
  Retrieved object.""";


  static final String W_MAP_REMOVE_DESCR = 
  """
  Removes map entry.
  If <code><i>key</i></code> is undefined, an exception is thrown.""";

  static final String W_MAP_REMOVE_P1_DESCR = 
  """
  Key (name) wrapper object.""";

  static final String W_MAP_REMOVE_RETURN_DESCR = 
  """
  Removed object (value component).""";


  static final String W_MAP_GETCOND_DESCR = 
  """
  Gets map entry conditionally.""";
;

  static final String W_MAP_GETCOND_P1_DESCR = 
  """
  Key (name) wrapper object.""";

  static final String W_MAP_GETCOND_P2_DESCR = 
  """
  Value to return if <code><i>key</i></code> does not exist.
  <code><i>defaultValue</i></code> may be <code>null</code>.""";

  static final String W_MAP_GETCOND_RETURN_DESCR = 
  """
  Retrieved or default object.""";  

  
  static final String W_MAP_CONTAINS_DESCR = 
  """
  Checks map for key presence.""";

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
  "Shallow array copy of current <code>" + DataTypes.CBOR_Any + "</code> map keys";   


  static final String W_MAP_GETMAP_DESCR = 
  """
  Get map object.
  Note: this method is redundant due to the dynamic nature of the JavaScript
  typing system.  However, if you intend using
  <a href='#common.checkforunread'>checkForUnread()</a>,
  this method must be called <i>before</i> accessing map keys.""";

  static final String W_MAP_GETMAP_RETURN_DESCR = 
  "Handle to map wrapper.";   

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
  Reads CBOR tag number.""";
  
  static final String W_TAG_GETNUM_RETURN_DESCR = 
  """
  Decoded tag number.""";


  static final String W_TAG_GETOBJ_DESCR = 
  """
  Reads tagged CBOR object.""";
  
  static final String W_TAG_GETOBJ_RETURN_DESCR = 
  """
  Retrieved object.""";


  static final String W_TAG_GETTAG_DESCR = 
  """
  Get tag object.
  Note: this method is redundant due to the dynamic nature of the JavaScript
  typing system.  However, if you intend using
  <a href='#common.checkforunread'>checkForUnread()</a>,
  this method must be called <i>before</i> accessing tag objects.""";

  static final String W_TAG_GETTAG_RETURN_DESCR = 
  "Handle to map wrapper.";   

  // encode()

  static final String ENCODE_DESCR = 
  """
  Encodes this object.
  Note: this method always return CBOR data using 
  <a href='#main.deterministic'>Deterministic Encoding</a>.""";

  static final String ENCODE_RETURN_DESCR = 
  """
  CBOR encoded data.""";

  // clone()

  static final String CLONE_DESCR = 
  """
  Creates a new instance of this object, initialized
  with the original CBOR content.""";

  static final String CLONE_RETURN_DESCR = 
  """
  Copy of object.""";

  // equals()

  static final String EQUALS_DESCR = 
  """
  Compares this object with another object with respect to CBOR data.""";
  
  static final String EQUALS_P1_DESCR = 
  """
  The object to compare with.""";

  static final String EQUALS_RETURN_DESCR = 
  """
  <code>true</code> if this object is equal to <code><i>object</i></code>,
  otherwise <code>false</code>.""";

  // isNull()
      
  static final String ISNULL_DESCR = 
  """
  Checks for CBOR <code>null</code>.
  Note that if <a href='#common.checkforunread'>checkForUnread()</a>
  is used, the current object will only be regarded as &quot;read&quot;
  if it actually is a CBOR <code>null</code> item.
  See also <a href='#wrapper.cbor.null'>CBOR.Null()</a>.""";
  
  static final String ISNULL_RETURN_DESCR = 
  """
  Returns <code>true</code> if the current object
  holds a CBOR <code>null</code> item, otherwise <code>false</code>
  is returned.""";

  // scan()

   static final String SCAN_DESCR = 
  """
  Scans current object as well as possible child objects
  in order to make them appear as &quot;read&quot;.
  This is only meaningful in conjunction with
  <a href='#common.checkforunread'>checkForUnread()</a>.""";

  static final String SCAN_RETURN_DESCR = 
  """
  Current object.""";  

  // checkForUnread()

   static final String CHECK4_DESCR = 
  """
   Checks if the current object including possible child objects has been read
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
   Also see
   <a href='#cbor.array.getarray'>getArray()</a>,
   <a href='#cbor.map.getmap'>getMap()</a>,
   <a href='#cbor.tag.gettag'>getTag()</a>, and
   <a href='#common.scan'>scan()</a>.""";
  static final String CHECK4_RETURN_DESCR = 
  """
  Current object.""";  

  // toDiag()

  static final String TODIAG_DESCR = 
  """
  Renders this object in <a href='#main.diagnostic'>Diagnostic Notation</a>.
  In similarity to <a href='#common.encode'>encode()</a>, this method always produce
  data in <a href='#main.deterministic'>Deterministic Encoding</a>, irrespective to how 
  the data was created.
  See also: <a href='#common.tostring'>toString()</a>.""";
  
  static final String TODIAG_P1_DESCR = 
  """
  If <code><i>prettyPrint</i></code> is <code>true</code>,
  additional white space is inserted between elements to make the result
  easier to read.""";

  static final String TODIAG_RETURN_DESCR = 
  """
  Textual version of the wrapped CBOR content.""";

  static final String TOSTRING_DESCR = 
  """
  Renders this object in <a href='#main.diagnostic'>Diagnostic Notation</a>.
  Equivalent to calling <a href='#common.todiag'>toDiag()</a>
  with a <code>true</code> argument.""";

   // CBOR.addArrays()

  static final String ADDARRAYS_DESCR = 
  """
  Adds two arrays.""";
  
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
  Compares two arrays lexicographically.""";
  
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
  Encodes binary data to hexadecimal.""";
  
  static final String TOHEX_P1_DESCR = 
  """
  Zero or more bytes to be encoded.""";

  static final String TOHEX_RETURN_DESCR = 
  """
  Hexadecimal encoded data.""";

  // CBOR.fromHex()

  static final String FROMHEX_DESCR = 
  """
  Decodes hexadecimal data into binary.""";
  
  static final String FROMHEX_P1_DESCR = 
  """
  String with zero or more hexadecimal pairs. Each pair represents one byte.""";

  static final String FROMHEX_RETURN_DESCR = 
  """
  The resulting binary (bytes).""";

  // CBOR.toBase64Url()

  static final String TOB64U_DESCR = 
  """
  Encodes binary data to base64Url.""";
  
  static final String TOB64U_P1_DESCR = 
  """
  Zero or more bytes to be encoded.""";

  static final String TOB64U_RETURN_DESCR = 
  """
  Base64Url encoded data.""";

  // CBOR.fromBase64Url()

  static final String FROMB64U_DESCR = 
  """
  Decodes base64Url encoded data into binary.
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
  Decodes a CBOR object.
  This method assumes that the CBOR data adheres to
  <a href='#main.deterministic'>Deterministic Encoding</a>,
  otherwise exceptions will be thrown.
  Any additional data after the CBOR object will also cause
  exceptions to be thrown.""";
  
  static final String DECODE_P1_DESCR = 
  """
  The data (bytes) to be decoded.""";

  static final String DECODE_RETURN_DESCR = 
  """
  CBOR wrapper object.""";

  // CBOR.initExtended()

  static final String INITEXT_DESCR = 
  """
  Initiates an extended CBOR decoder.
  This decoding method presumes that the actual
  decoding is performed by one or more (for sequences only) calls to
  <a href='#decoder.cbor.decodeextended'>CBOR.decodeExtended()</a>.""";
  
  static final String INITEXT_P1_DESCR = 
  """
  The data (bytes) to be decoded.""";

  static final String INITEXT_P2_DESCR = 
  """
  If <code>true</code>, <a href='#decoder.cbor.decodeextended'>CBOR.decodeExtended()</a>
  will return immediately after decoding a CBOR object, otherwise 
  any additional data after the CBOR object will cause exceptions to be thrown.""";

  static final String INITEXT_P3_DESCR = 
  """
  If <code>true</code> the decoder will accept CBOR code
  which violates the <a href='#main.deterministic'>Deterministic Encoding</a> rules.
  This option may be needed for dealing with &quot;legacy&quot;
  CBOR implementations.""";

  static final String INITEXT_RETURN_DESCR = 
  """
  Internal decoder object for usage with
  <a href='#decoder.cbor.decodeextended'>CBOR.decodeExtended()</a>.""";

  // CBOR.decodeExtended()

  static final String DECODEEXT_DESCR = 
  """
  Decodes a CBOR object.
  If the <code>sequenceFlag</code> in the call to
  <a href='#decoder.cbor.initextended'>CBOR.initExtended()</a>
  is <code>true</code>, each call to 
  <a href='#decoder.cbor.decodeextended'>CBOR.decodeExtended()</a>
  causes the internal decoder to move to the next (possible but unprocessed) CBOR object.
  When there is no more data to decode, this method returns <code>null</code>.""";

  static final String DECODEEXT_P1_DESCR = 
  """
  Internal decoder object.""";
  
  static final String DECODEEXT_RETURN_DESCR = 
  """
  CBOR wrapper object or <code>null</code>.""";

    // CBOR.diagDecode()

  static final String DIAGDEC_DESCR = 
  """
  Decodes a CBOR object provided in <a href='#main.diagnostic'>Diagnostic&nbsp;Notation</a>.
  See also <a href='#decoder.cbor.diagdecodesequence'>CBOR.diagDecodeSequence()</a>.""";
  
  static final String DIAGDEC_P1_DESCR = 
  """
  CBOR in textual format.""";

  static final String DIAGDEC_RETURN_DESCR = 
  """
  CBOR wrapper object.""";

    // CBOR.diagDecodeSequence()

  static final String DIAGDECSEQ_DESCR = 
  """
  Decodes a CBOR object provided in <a href='#main.diagnostic'>Diagnostic&nbsp;Notation</a>.
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
    CBOR_BOOL("CBOR.Bool"),
    CBOR_ARRAY("CBOR.Array"),
    CBOR_MAP("CBOR.Map"),
    CBOR_TAG("CBOR.Tag"),

    JS_THIS("this"),

    JS_NUMBER("Number"),
    JS_ARRAY("Array"),
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
     .append("' style='background-color:white; font-size:0.6em'></td>");
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
    s.append(printSubHeader((prefix + "." + method.name).toLowerCase(),  method.name + 
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
    for (TOCEntry tocEntry : tocEntries) {
      s.append("<div style='margin:0 0 0.4em ")
       .append((tocEntry.indent * 2) + 2)
       .append("em'><a href='#")
       .append(tocEntry.link)
       .append("'>")
       .append(tocEntry.title)
       .append("</a></div>\n");
    }
    return s.toString();
  }

  void replace(String handle, String with) {
    template = template.replace(handle, with);
  }

  CreateDocument(String templateFileName, String documentFileName) {
    template = UTF8.decode(IO.readFile(templateFileName));

    // CBOR.Int

    addWrapper(DataTypes.CBOR_INT, W_INT_DESCR)
      .addWrapperParameter("value", DataTypes.JS_NUMBER, W_INT_P1_DESCR)

      .addMethod("getInt", W_GETINT_DESCR)
      .setReturn(DataTypes.JS_NUMBER, W_GETINT_RETURN_DESCR);

    // CBIR.BigInt

    addWrapper(DataTypes.CBOR_BIGINT, W_BIGINT_DESCR)
      .addWrapperParameter("value", DataTypes.JS_BIGINT, W_BIGINT_P1_DESCR)

      .addMethod("getBigInt", W_GETBIGINT_DESCR)
      .setReturn(DataTypes.JS_BIGINT, W_GETBIGINT_RETURN_DESCR);

     // CBOR.Float

    addWrapper(DataTypes.CBOR_FLOAT, W_FLOAT_DESCR)
      .addWrapperParameter("value", DataTypes.JS_NUMBER, W_FLOAT_P1_DESCR)

      .addMethod("getFloat", W_GETFLOAT_DESCR)
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

    addWrapper(DataTypes.CBOR_BOOL, W_BOOLEAN_DESCR)
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

      .addMethod("getArray", W_ARRAY_GETARR_DESCR)
      .setReturn(DataTypes.CBOR_ARRAY, W_ARRAY_GETARR_RETURN_DESCR)

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
      
      .addMethod("getMap", W_MAP_GETMAP_DESCR)
      .setReturn(DataTypes.CBOR_MAP, W_MAP_GETMAP_RETURN_DESCR)

      .setProperty("length", DataTypes.JS_NUMBER, W_MAP_PROP_DESCR);

      // CBOR.Tag

    addWrapper(DataTypes.CBOR_TAG, W_TAG_DESCR)
      .addWrapperParameter("tagNumber", DataTypes.JS_BIGINT, W_TAG_P1_DESCR)
      .addWrapperParameter("object", DataTypes.CBOR_Any, W_TAG_P2_DESCR)

      .addMethod("getTagNumber", W_TAG_GETNUM_DESCR)
      .setReturn(DataTypes.JS_BIGINT, W_TAG_GETNUM_RETURN_DESCR)

      .addMethod("getTaggedObject", W_TAG_GETOBJ_DESCR)
      .setReturn(DataTypes.CBOR_Any, W_TAG_GETOBJ_RETURN_DESCR)

      .addMethod("getTag", W_TAG_GETTAG_DESCR)
      .setReturn(DataTypes.CBOR_MAP, W_TAG_GETTAG_RETURN_DESCR);

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

      // CBOR.initExtended()

    addDecoderMethod("CBOR.initExtended", INITEXT_DESCR)
      .addParameter("cbor", DataTypes.JS_UINT8ARRAY, INITEXT_P1_DESCR)
      .addParameter("sequenceFlag", DataTypes.JS_BOOLEAN, INITEXT_P2_DESCR)
      .addParameter("nonDeterministic", DataTypes.JS_BOOLEAN, INITEXT_P3_DESCR)
      .setReturn(DataTypes.ExtendedDecoder, INITEXT_RETURN_DESCR);

      // Decoder.decodeExtended()

    addDecoderMethod("CBOR.decodeExtended", DECODEEXT_DESCR)
      .addParameter("decoder", DataTypes.ExtendedDecoder, DECODEEXT_P1_DESCR)
      .setReturn(DataTypes.CBOR_Any, DECODEEXT_RETURN_DESCR);

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

    replace(VERSION_INFO, printMainHeader("version", "Version"));
    outline.increment();

    replace(TOC, printTableOfContents());

    IO.writeFile(documentFileName, template);
  }
  public static void main(String[] args) {
    System.out.println("HI");
    new CreateDocument(args[0], args[1]);
  }
}