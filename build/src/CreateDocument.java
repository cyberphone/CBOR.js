
import java.util.ArrayList;

import java.util.regex.Pattern;

import org.webpki.util.IO;
import org.webpki.util.UTF8;

public class CreateDocument {

  static final String NR = """
    <b style='color:red'>NOT READY NOT READY NOT READY</b>
    """;
  static final String WRAPPER_RETURN_DESCR = """
      Object.""";

  static final String CURRENT_RETURN_DESCR = """
      Current object.""";

  static final String KEY_PARAMETER_DESCR = """
      Key (name).""";

  static final String OBJECT_PARAMETER_DESCR = """
      Object (value).""";

  static final String ARRAY_INDEX_P1_DESCR = """
      Array index <code>(0..length-1)</code>.""";

  // CBOR.Int

  static final String W_INT_DESCR = """
      Constructor.  Creates a CBOR integer object.
      <div style='margin-top:0.5em'>
      If <kbd><i>value</i></kbd> is outside the range <code>-0x8000000000000000</code> to <code>0xffffffffffffffff</code>,
      a <a href='#main.errors'>CborException</a> is thrown.</div>
      <div style='margin-top:0.5em'>
      See also <a href='#jsnumbers.int'>Integer Numbers</a>.</div>
      <div style='margin-top:0.5em'>
      For fine-grained control of programmatically created integers, a set of <code>CBOR.Int.create*()</code>
      methods are provided as an <i>alternative</i> to the constructor.
      Note that these methods <i>do not change data</i>; they
      only verify that data is within expected limits, and if that is the case,
      finish the operation using the standard constructor.</div>""";

  static final String W_INT_P1_DESCR = """
      Integer to be wrapped.""";

  // CBOR.BigInt

  static final String W_BIGINT_DESCR = """
      Constructor.  Creates a CBOR big integer object.
      <div style='margin-top:0.5em'>
      See also <a href='#jsnumbers.int'>Integer Numbers</a>.</div>""";

  static final String W_BIGINT_P1_DESCR = """
      Big integer to be wrapped.""";

  static final String W_GETBIGINT_DESCR = """
      Get CBOR integer of any size.
      <div style='margin-top:0.5em'>
      See also <a href='#jsnumbers.int'>Integer Numbers</a>.</div>""";

  static final String W_GETBIGINT_RETURN_DESCR = """
      Decoded big integer.""";

  // CBOR.Float

  static final String W_FLOAT_DESCR = """
      Constructor.  Creates a CBOR <code>float</code> object.
      <div style='margin-top:0.5em'>
      See also <a href='#jsnumbers.fp'>Floating-Point Numbers</a>.</div>
      <div style='margin-top:0.5em'>
      For supporting <code>NaN</code> and <code>Infinity</code>, see also
      <a href='non-finite-numbers.html'>Non-Finite Numbers</a>.</div>""";

  static final String W_FLOAT_P1_DESCR = """
      Floating-point number to be wrapped.""";

  static final String W_CREEXTFLOAT_DESCR = """
      Creates a CBOR <code>float</code> object.
      <div style='margin-top:0.5em'>
      Unlike <a href='#wrapper.cbor.float'>CBOR.Float()</a>,
      this method also supports one of
      the non-finite values, <kbd>Number.NaN</kbd>,
      <kbd>Number.POSITIVE_INFINITY</kbd>,
      and <kbd>Number.NEGATIVE_INFINITY</kbd>.</div>
      <div style='margin-top:0.5em'>
      See also <a href='non-finite-numbers.html'>Non-Finite Numbers</a>.</div>""";

  static final String W_CREEXTFLOAT_P1_DESCR = """
      Floating-point number to be wrapped.""";

  static final String W_CREEXTFLOAT_RETURN_DESCR = """
      Instantiated <a href='#wrapper.cbor.float'>CBOR.Float</a> or
      <a href='#wrapper.cbor.nonfinite'>CBOR.NonFinite</a>
      object.""";

  static final String W_CREFLOAT16_DESCR = """
      Creates a <a href='#wrapper.cbor.float'>CBOR.Float</a> object,
      where the value is converted to fit CBOR <code>float16</code> representation.
      <div style='margin-top:0.5em'>
      If <kbd><i>value</i></kbd> (after applying
      <span style='white-space:nowrap'><code>IEEE</code> <code>754</code></span> conversion rules),
      is out of range, or is <i>non-finite</i>, a <a href='#main.errors'>CborException</a> is thrown.</div>
      <div style='margin-top:0.5em'>
      See also <a href='#cbor.float.getfloat16'>getFloat16()</a>.</div>""";

  static final String W_CREFLOAT16_P1_DESCR = """
      Floating-point number to be wrapped.""";

  static final String W_CREFLOAT16_RETURN_DESCR = """
      Instantiated <a href='#wrapper.cbor.float'>CBOR.Float</a> object.""";

  static final String W_CREFLOAT32_DESCR = """
      Creates a <a href='#wrapper.cbor.float'>CBOR.Float</a> object,
      where the value is converted to fit CBOR <code>float32</code> representation.
      <div style='margin-top:0.5em'>
      If <kbd><i>value</i></kbd> (after applying
      <span style='white-space:nowrap'><code>IEEE</code> <code>754</code></span> conversion rules),
      is out of range, or is <i>non-finite</i>, a <a href='#main.errors'>CborException</a> is thrown.</div>
      <div style='margin-top:0.5em'>
      Note that this method returns a <code>float16</code> compatible object
      If <kbd><i>value</i></kbd> and precision is <i>equivalent</i> to the <code>float32</code>
      representation (e.g. <code>2.5</code>).</div>
      <div style='margin-top:0.5em'>
      See also <a href='#cbor.float.getfloat32'>getFloat32()</a>.</div>""";

  static final String W_CREFLOAT32_P1_DESCR = """
      Floating-point number to be wrapped.""";

  static final String W_CREFLOAT32_RETURN_DESCR = """
      Instantiated <a href='#wrapper.cbor.float'>CBOR.Float</a> object.""";

  static final String W_GETFLOAT_DESCR = """
      Get CBOR floating-point value.""";

  static final String W_GETFLOAT_RETURN_DESCR = """
      Decoded floating-point number.""";

  static final String W_GETEXTFLOAT_DESCR = """
      Get CBOR floating-point value.
      <div style='margin-top:0.5em'>
      See also <a href='#cbor.float.createextendedfloat'>CBOR.Float.createExtendedFloat()</a>.</div>
      <div style='margin-top:0.5em'>
      Note that this method makes it transparent for applications if the returned
      value is a "regular" <code>float</code>, or one of
      the non-finite values, <kbd>Number.NaN</kbd>,
      <kbd>Number.POSITIVE_INFINITY</kbd>,
      or <kbd>Number.NEGATIVE_INFINITY</kbd>.</div>""";

  static final String W_GETEXTFLOAT_RETURN_DESCR = """
      Decoded floating-point number.""";

  static final String W_FLOAT_PROP_DESCR = """
      Length in bytes of the underlying CBOR <span style='white-space:nowrap'><code>IEEE</code> <code>754</code></span> type.""";

  // CBOR.NonFinite

  static final String W_NONFIN_DESCR = """
      Constructor.  Creates a CBOR <i>non-finite</i> <code>float</code> object.
      <div style='margin-top:0.5em'>
      The argument must be a valid <code>16</code>, <code>32</code>, or <code>64</code>-bit
      non-finite number in <span style='white-space:nowrap'><code>IEEE</code> <code>754</code></span> encoding.</div>
      <div style='margin-top:0.5em'>
      See also <a href='non-finite-numbers.html'>Non-Finite Numbers</a>.</div>""";

  static final String W_NONFIN_P1_DESCR = """
      Non-finite floating-point number to be wrapped.""";

  static final String W_GET_NONFIN_DESCR = """
      Get <i>actual</i> non-finite object (value).
      <div style='margin-top:0.5em'>
      This method returns the value of a non-finite object. The value is
      provided in the most compact form based on CBOR serialization rules.</div>""";

  static final String W_GET_NONFIN_RETURN_DESCR = """
      Decoded <i>non-finite</i> number as a <code>BigInt</code>.""";

  static final String W_GET_NONFIN64_DESCR = """
      Get <i>expanded</i> non-finite object (value).
      <div style='margin-top:0.5em'>
      This method returns the value of a non-finite object after it has been
      expanded to 64 bits.  That is, a received <code>7c01</code> will be
      returned as <code>7ff0040000000000</code>.</div>""";

  static final String W_GET_NONFIN64_RETURN_DESCR = """
      Decoded <i>non-finite</i> number as a <code>BigInt</code>.""";

  static final String W_ISNAN_NONFIN_DESCR = """
      Check if non-finite object is a <code>NaN</code>.
      <div style='margin-top:0.5em'>
      This method returns <code>true</code> for <i>all conformant</i> 
      <code>NaN</code> variants, else <code>false</code> is returned.</div>""";

  static final String W_ISNAN_NONFIN_RETURN_DESCR = "Result.";

  static final String W_ISSIMPLE_NONFIN_DESCR = """
      Check if non-finite object is simple.
      <div style='margin-top:0.5em'>
      This method returns <code>true</code> if the non-finite object is a 
      <kbd>Number.NaN</kbd>,
      <kbd>Number.POSITIVE_INFINITY</kbd>, or 
      <kbd>Number.NEGATIVE_INFINITY</kbd>,
      else <code>false</code> is returned.</div>""";

  static final String W_ISSIMPLE_NONFIN_RETURN_DESCR = "Result.";

  static final String W_GETSIGN_NONFIN_DESCR = """
      Get sign bit of non-finite object.
      <div style='margin-top:0.5em'>
      This method returns <code>true</code> if the sign bit is <code>1</code>,
      else <code>false</code> is returned.</div>
      <div style='margin-top:0.5em'>
      See also <a href='#cbor.nonfinite.setsign'>setSign()</a>.</div>""";

  static final String W_GETSIGN_NONFIN_RETURN_DESCR = "Result.";

  static final String W_SETSIGN_NONFIN_DESCR = """
      Set sign bit of non-finite object.
      <div style='margin-top:0.5em'>
      The sign bit is expressed as a <code>boolean</code>.
      <code>true</code> = <code>1</code>, <code>false</code> = <code>0</code>.</div>
      <div style='margin-top:0.5em'>
      See also <a href='#cbor.nonfinite.getsign'>getSign()</a>.</div>""";

  static final String W_SETSIGN_NONFIN_P1_DESCR = """
      Sign bit.""";

  static final String W_SETSIGN_NONFIN_RETURN_DESCR = "Current object.";

  static final String W_CREPAYLOAD_NONFIN_DESCR = """
      Creates a payload object.
      <div style='margin-top:0.5em'>
      For details turn to the <a href='non-finite-numbers.html#payload-option'>Payload Option</a>.</div>""";

  static final String W_CREPAYLOAD_NONFIN_P1_DESCR = """
      Payload data.""";

  static final String W_CREPAYLOAD_NONFIN_RETURN_DESCR = """
      Instantiated <a href='#wrapper.cbor.nonfinite'>CBOR.NonFinite</a>
      object.""";

  static final String W_GETPAYLOAD_NONFIN_DESCR = """
      Get payload data.
      <div style='margin-top:0.5em'>
      This method is the "consumer" counterpart to
      <a href='#cbor.nonfinite.createpayload'>\
CBOR.NonFinite.createPayload()</a>.</div>""";

  static final String W_GETPAYLOAD_NONFIN_RETURN_DESCR = "Payload.";
/* 
  static final String W_GETFLOAT_DESCR = """
      Get CBOR floating-point value.""";

  static final String W_GETFLOAT_RETURN_DESCR = """
      Decoded floating-point number.""";
*/

  static final String W_NONFIN_PROP_DESCR = """
      Length in bytes of the underlying CBOR <span style='white-space:nowrap'><code>IEEE</code> <code>754</code></span> type.""";

  // CBOR.String

  static final String W_STRING_DESCR = """
      Constructor.  Creates a CBOR text-string (<code>tstr</code>) object.""";

  static final String W_STRING_P1_DESCR = """
      String to be wrapped.""";

  static final String W_GETSTRING_DESCR = """
      Get CBOR text-string.""";

  static final String W_GETSTRING_RETURN_DESCR = """
      Decoded text-string.""";

  // Time Objects

  static final String W_GETDATETIME_DESCR = """
      Get <code>DateTime</code> object.
      <div style='margin-top:0.5em'>
      This method performs a
      <a href='#cbor.string.getstring'>getString()</a>.
      The returned string is subsequently used for initiating a JavaScript <kbd>Date</kbd> object.</div>
      <div style='margin-top:0.5em'>
      If not <i>all</i> of the following conditions are met, a 
      <a href='#main.errors'>CborException</a> is thrown:
      <ul style='padding:0;margin:0 0 0.5em 1.2em'>
      <li style='margin-top:0'>The underlying object is a
      <a href='#wrapper.cbor.string'>CBOR.String</a>.</li>
      <li>The string matches the ISO date/time format described
      in section&nbsp;5.6 of ${RFC3339}.</li>
      <li>The <i>optional</i> sub-second field (<code>.nnn</code>) features <i>less</i> than ten digits.</li>
      <li>The date/time object is within the range
      <code style='white-space:nowrap'>"0000-01-01T00:00:00Z"</code> to
      <code style='white-space:nowrap'>"9999-12-31T23:59:59Z"</code>.</li>
      </ul>
      </div><div style='margin-top:0.5em'>
      See also <a href='#utility.cbor.createdatetime'>CBOR.createDateTime()</a>.</div>""";

  static final String W_GETDATETIME_RETURN_DESCR = """
      Date object""";

  static final String W_GETEPOCHTIME_DESCR = """
      Get <code>EpochTime</code> object.
      <div style='margin-top:0.5em'>
      Depending on the type of the current object, this method performs a
      <a href='#cbor.int.getint53'>getInt53()</a> or a 
      <a href='#cbor.float.getfloat64'>getFloat64()</a>.
      The returned number is subsequently used for initiating a JavaScript <kbd>Date</kbd> object.</div>
      <div style='margin-top:0.5em'>
      If not <i>all</i> of the following conditions are met, a <a href='#main.errors'>CborException</a> is thrown:
      <ul style='padding:0;margin:0 0 0.5em 1.2em'>
      <li style='margin-top:0'>The underlying object
      is a <a href='#wrapper.cbor.int'>CBOR.Int</a> or
      <a href='#wrapper.cbor.float'>CBOR.Float</a>.</li>
      <li>The Epoch ${TIME} object is within the range
      <span style='white-space:nowrap'><code>0</code> (<code>"1970-01-01T00:00:00Z"</code>)</span> to
      <span style='white-space:nowrap'><code>253402300799</code> (<code>"9999-12-31T23:59:59Z"</code>)</span>.</li>
      </ul>
      </div>
      <div style='margin-top:0.5em'>
      See also <a href='#utility.cbor.createepochtime'>CBOR.createEpochTime()</a>.</div>""";
  
  static final String W_GETEPOCHTIME_RETURN_DESCR = """
      Date object""";

  // CBOR.Bytes

  static final String W_BYTES_DESCR = """
      Constructor.  Creates a CBOR byte-string (<code>bstr</code>) object.""";

  static final String W_BYTES_P1_DESCR = """
      Binary data to be wrapped.""";

  static final String W_GETBYTES_DESCR = """
      Get CBOR byte-string.""";

  static final String W_GETBYTES_RETURN_DESCR = """
      Decoded byte-string.""";

  // CBOR.Boolean

  static final String W_BOOLEAN_DESCR = """
      Constructor.  Creates a CBOR boolean (<code>bool</code>) object.""";

  static final String W_BOOLEAN_P1_DESCR = """
      Boolean to be wrapped.""";

  static final String W_GETBOOL_DESCR = """
      Get CBOR boolean.""";

  static final String W_GETBOOL_RETURN_DESCR = """
      Decoded boolean.""";

  // CBOR.Null

  static final String W_NULL_DESCR = """
      Constructor.  Creates a CBOR <code>null</code> object.
      See also <a href='#common.isnull'>isNull()</a>.""";

  // CBOR.Array

  static final String ARRAY_INDEX_INSERT_P1_DESCR = """
      Array index <code>(0..length)</code>.
      <div style='margin-top:0.5em'>If <kbd><i>index</i></kbd>
      is equal to <code>length</code>, <kbd><i>object</i></kbd> is <i>appended</i>.</div>""";


  static final String W_ARRAY_DESCR = """
      Constructor.  Creates an empty CBOR <code>array</code> object.""";

  static final String W_ARRAY_ADD_DESCR = """
      Add CBOR object to the array.""";

  static final String W_ARRAY_ADD_P1_DESCR = """
      Object to be appended to the array.""";

  static final String W_ARRAY_GET_DESCR = """
      Get CBOR object at a specific position in the array.""";

  static final String W_ARRAY_REMOVE_DESCR = """
      Remove CBOR object at a specific position in the array.""";

  static final String W_ARRAY_GET_RETURN_DESCR = """
      Retrieved object.""";

  static final String W_ARRAY_UPDATE_DESCR = """
      Update CBOR object at a specific position in the array.""";

  static final String W_ARRAY_INSERT_DESCR = """
      Insert CBOR object <i>before</i> an object at a specific position in the array.""";

  static final String W_ARRAY_UPDATE_P2_DESCR = """
      Update object.""";

  static final String W_ARRAY_UPDATE_RETURN_DESCR = """
      Previous object.""";

  static final String W_ARRAY_TOARR_DESCR = """
      Copy array.""";

  static final String W_ARRAY_TOARR_RETURN_DESCR = "JavaScript array holding a copy of current <kbd>"
      + DataTypes.CBOR_Any + "</kbd> objects.";

  static final String W_ARRAY_ENC_AS_SEQ_DESCR = """
      Return the objects in the array as a CBOR sequence
      using <a href='#main.deterministic'>Deterministic&nbsp;Encoding</a>.
      <div style='margin-top:0.5em'>See also
      <a href='#decoder.cbor.initdecoder'>CBOR.initDecoder()</a>.</div>""";

  static final String W_ARRAY_ENC_AS_SEQ_RETURN_DESCR = """
      CBOR encoded data.""";

  static final String W_ARRAY_PROP_DESCR = """
      Number of objects in the array.""";

  // CBOR.Map

  static final String W_MAP_DESCR = """
      Constructor.  Creates an empty CBOR <code>map</code> object.""";

  static final String W_MAP_SET_DESCR = """
      Set map entry.
      If <kbd><i>key</i></kbd> is already defined, a <a href='#main.errors'>CborException</a> is thrown.
      <div style='margin-top:0.5em'>Note: <kbd><i>key</i></kbd> order is of no importance since
      <a href='#main.deterministic'>Deterministic&nbsp;Encoding</a>
      performs the required map sorting <i>automatically</i>.
      See also <a href='#cbor.map.setsortingmode'>setSortingMode()</a>.</div>
      <div style='margin-top:0.5em'>Note: this implementation
      presumes that <kbd>key</kbd> objects are <i>immutable</i>.
      That is, the following code will throw a <a href='#main.errors'>CborException</a>:</div>
      <div style='margin:0.3em 0 0 1.2em'><code>let key = CBOR.Array();<br>
      let map = CBOR.Map().set(key, CBOR.Int(5));<br>
      key.add(CBOR.String("data"));  // Mutating key object</code></div>
      <div style='margin-top:0.3em'>By defining <kbd>key</kbd> objects inline
      (<i>chaining</i>) or by <i>preset variable declarations</i>, <kbd>key</kbd> objects
      of <i>any</i> complexity can be used.</div>""";

  static final String W_MAP_SET_DYN_DESCR = """
      Set map entries using a function or =>.
      <div style='margin-top:0.5em'>This method permits using
      chaining with dynamic or optional map elements.
      Consult test file <code>dynamic.js</code> for examples.</div>""";

  static final String W_MAP_SET_DYN_PARAMETER_DESCR = """
      Function or =&gt; operator with one parameter holding <kbd>this</kbd>.""";

  static final String W_MAP_MERGE_DESCR = """
      Merge maps.
      Performs a <a href='#cbor.map.set'>set()</a> operation
      for each member of the <kbd><i>map</i></kbd> argument.""";

  static final String W_MAP_MERGE_P1_DESCR = """
      CBOR <code>map</code> wrapper object.""";

  static final String W_MAP_UPDATE_DESCR = """
      Update map entry.""";

  static final String W_MAP_UPDATE_P3_DESCR = """
      If <kbd><i>existing</i></kbd> is <code>true</code>,
      <kbd><i>key</i></kbd> must be defined, else a <a href='#main.errors'>CborException</a> is thrown.
      <div style='margin-top:0.5em'>If <kbd><i>existing</i></kbd> is <code>false</code>,
      a <code>map</code> entry will be created for <kbd><i>key</i></kbd> if not already defined.</div>""";

  static final String W_MAP_UPDATE_RETURN_DESCR = """
      Previous object.  May be <code>null</code>.""";

  static final String W_MAP_GET_DESCR = """
      Get map entry.
      If <kbd><i>key</i></kbd> is undefined, a <a href='#main.errors'>CborException</a> is thrown.""";;

  static final String W_MAP_GET_RETURN_DESCR = """
      Retrieved object.""";

  static final String W_MAP_REMOVE_DESCR = """
      Remove map entry.
      If <kbd><i>key</i></kbd> is undefined, a <a href='#main.errors'>CborException</a> is thrown.""";

  static final String W_MAP_REMOVE_RETURN_DESCR = """
      Removed object (value).""";

  static final String W_MAP_GETCOND_DESCR = """
      Get map entry conditionally.""";

  static final String W_MAP_GETCOND_P2_DESCR = """
      Object to return if <kbd><i>key</i></kbd> is undefined.
      <div style='margin-top:0.5em'>Note:
      <kbd><i>defaultObject</i></kbd> may be <code>null</code>.</div>""";

  static final String W_MAP_GETCOND_RETURN_DESCR = """
      Retrieved or default object.""";

  static final String W_MAP_CONTAINS_DESCR = """
      Check map for key presence.""";

  static final String W_MAP_CONTAINS_RETURN_DESCR = """
      <code>true</code> or <code>false</code>.""";

  static final String W_MAP_GETKEYS_DESCR = """
      Get map keys.""";

  static final String W_MAP_GETKEYS_RETURN_DESCR = "JavaScript array holding a copy of current key objects.";

  static final String W_MAP_SET_SORTING_MODE_DESCR = """
      Set the sorting mode of the
      <a href='#wrapper.cbor.map'>CBOR.Map()</a> object during
      <a href='#cbor.map.set'>set()</a> operations.
      <div style='margin:0.5em 0'>Typical usage:</div>
      <div style='margin:0.3em 0 0.3em 1.2em'><code>let map = CBOR.Map().setSortingMode(true)</code></div>
      This method may be called multiple times which could be
      useful if you have a moderate set of unsorted meta data keys
      combined with a sorted large table-like set of keys.
      Note that this method has no effect on decoding operations.""";

  static final String W_MAP_SET_SORTING_MODE_P1_DESCR = """
      If <code>true</code>,
      keys must be provided in (CBOR wise) ascending order
      which can improve performance for maps having a huge number of keys.
      Improper key order causes a <a href='#main.errors'>CborException</a> to be thrown.
      By default, map keys are sorted <i>internally</i>.""";

  static final String W_MAP_PROP_DESCR = """
      Number of map entries.""";

  // CBOR.Tag

  static final String W_TAG_DESCR = """
      Constructor.  Creates a CBOR tag object.
      <div style='margin-top:0.5em'>
      The CBOR tag constructor accepts any valid parameters but performs
      thorough syntax checks on tag&nbsp;<code>0</code>
      (<a href='#time.getdatetime'>CBOR&nbsp;date/time</a>),
      tag&nbsp;<code>1</code>
      (<a href='#time.getepochtime'>CBOR&nbsp;epoch&nbsp;time</a>),
      and tag&nbsp;<code>1010</code> ${COTX}.
      </div>""";

  static final String W_TAG_P1_DESCR = """
      Tag number.""";

  static final String W_TAG_P2_DESCR = """
      Object to be wrapped in a tag.""";

  static final String W_TAG_GETNUM_DESCR = """
      Get CBOR tag number.""";

  static final String W_TAG_GETNUM_RETURN_DESCR = """
      Decoded tag number.""";

  static final String W_TAG_GET_DESCR = """
      Get tagged CBOR object.""";

  static final String W_TAG_GET_RETURN_DESCR = """
      Retrieved object.""";

  static final String W_TAG_PROP_COTX_ID_DESCR = """
      COTX ${COTX} support:
      object ID string.<div style='margin-top:0.5em'>
      Only valid for COTX tags.
      See also <a href='#cbor.tag.gettagnumber'>getTagNumber()</a>.</div>""";

  static final String W_TAG_PROP_COTX_OBJECT_DESCR = """
      COTX ${COTX} support:
      wrapped object.<div style='margin-top:0.5em'>
      Only valid for COTX tags.
      See also <a href='#cbor.tag.gettagnumber'>getTagNumber()</a>.</div>""";

  // CBOR.Simple

  static final String W_SIMPLE_DESCR = """
      Constructor.  Creates a CBOR simple value object.
      <div style='margin-top:0.5em'>If <kbd><i>value</i></kbd> is outside
      the range <code>0-23</code> and <code>32-255</code>,
      a <a href='#main.errors'>CborException</a> is thrown.</div>
      <div style='margin-top:0.5em'>A primary use case for <code>simple</code>
      types in the range of <code>0-19</code> and <code>32-255</code>,
      is serving as a limited set of <i>unique and reserved labels</i> (keys)
      in CBOR maps.</div>""";

  static final String W_SIMPLE_PARAM_DESCR = """
      Simple value.""";

  static final String W_SIMPLE_GETVAL_DESCR = """
      Get simple value.""";

  static final String W_SIMPLE_GETVAL_RETURN_DESCR = """
      Returned simple value.""";

  // encode()

  static final String ENCODE_DESCR = """
      Encode (aka &quot;serialize&quot;) <kbd>this</kbd> object.
      <div style='margin-top:0.5em'>Note: this method always return CBOR data using
      <a href='#main.deterministic'>Deterministic&nbsp;Encoding</a>.</div>
      <div style='margin-top:0.5em'>
      See also <a href='#cbor.array.encodeassequence'>encodeAsSequence()</a>.</div>""";

  static final String ENCODE_RETURN_DESCR = """
      CBOR encoded data.""";

  // clone()

  static final String CLONE_DESCR = """
      Create a new instance of <kbd>this</kbd> object, initialized
      with the original CBOR content.""";

  static final String CLONE_RETURN_DESCR = """
      Deep copy of <kbd>this</kbd> object.""";

  // equals()

  static final String EQUALS_DESCR = 
      "Compare <kbd>this</kbd> object with another CBOR object." +
      "<div style='margin-top:0.5em'>" +
      "The result is <code>true</code> if and only if <kbd>object</kbd> is not " +
      "<code>null</code> and is a <kbd>" +
      DataTypes.CBOR_Any.toString() + "</kbd>, and the associated binary encodings " +
      "(as provided by <a href='#common.encode'>encode()</a>) are equivalent.</div>";

  static final String EQUALS_P1_DESCR = """
      Argument to compare with.""";

  static final String EQUALS_RETURN_DESCR = """
      Returns <code>true</code> if <kbd>this</kbd> object is equal to <kbd><i>object</i></kbd>,
      else <code>false</code> is returned.""";

  // isNull()

  static final String ISNULL_DESCR = """
      Check for CBOR <code>null</code>.
      <div style='margin:0.5em 0'>Note: if <a href='#common.checkforunread'>checkForUnread()</a>
      is used, <kbd>this</kbd> object will only be regarded as &quot;read&quot;
      if it actually is a CBOR <code>null</code> item.</div>
      See also <a href='#wrapper.cbor.null'>CBOR.Null()</a>.""";

  static final String ISNULL_RETURN_DESCR = """
      Returns <code>true</code> if <kbd>this</kbd> object
      holds a CBOR <code>null</code> item, else <code>false</code> is returned.""";

  // scan()

  static final String SCAN_DESCR = """
      Scan <kbd>this</kbd> object as well as possible child objects
      in order to make them appear as &quot;read&quot;.
      This is only meaningful in conjunction with
      <a href='#common.checkforunread'>checkForUnread()</a>.""";

  // checkForUnread()

  static final String CHECK4_DESCR = """
       Check if <kbd>this</kbd> object including possible child objects has been read
       (like calling <a href='#cbor.int.getint32'>getInt32()</a>).
       If not <i>all</i> of the associated objects have been read, a <a href='#main.errors'>CborException</a> is thrown.
       <div style='margin:0.5em 0'>
       The purpose of this method is to detect possible misunderstandings between parties
       using CBOR based protocols.  Together with the strict type checking performed
       by the CBOR.js API, a programmatic counterpart to schema-based decoding
       can be achieved.
       </div>
       Note that array <a href='#cbor.array.get'>get()</a>,
       map <a href='#cbor.map.get'>get()</a>, and
       tag <a href='#cbor.tag.get'>get()</a>
       only <i>locate</i> objects,
       and thus do not count as &quot;read&quot;.
       <div style='margin-top:0.5em'>To cope with elements that are redundant,
       <a href='#common.scan'>scan()</a> can be used:</div>
      <div style='margin:0.3em 0 0 1.2em'><code>let array = CBOR.fromDiagnostic(`[3, {}]`);<br>
      let operation = array.get(0).getInt8();<br>
      array.get(1).scan();&nbsp;&nbsp;&nbsp;&nbsp;// mark array[1] as read<br>
      array.checkForUnread();</code></div>""";

  // toDiagnostic()

  static final String TODIAG_DESCR = """
      Render <kbd>this</kbd> object in <a href='#main.diagnostic'>Diagnostic Notation</a>.
      In similarity to <a href='#common.encode'>encode()</a>, this method always produce
      data in <a href='#main.deterministic'>Deterministic Encoding</a>, irrespective to how
      the data was created.
      See also <a href='#common.tostring'>toString()</a>.
      <div style='margin-top:0.5em'>If <kbd>this</kbd> object (as well as possible
      child objects), conforms to the subset of data types supported by JSON,
      this method can also be used to generate JSON data.</div>""";

  static final String TODIAG_P1_DESCR = """
      If <kbd><i>prettyPrint</i></kbd> is <code>true</code>,
      additional white space is inserted between individual objects
      in maps and arrays, to make the result easier to read.""";

  static final String TODIAG_RETURN_DESCR = """
      Textual version of the wrapped CBOR content.""";

  static final String TOSTRING_DESCR = """
      Render <kbd>this</kbd> object in <a href='#main.diagnostic'>Diagnostic Notation</a>.
      Equivalent to calling <a href='#common.todiagnostic'>toDiagnostic()</a>
      with a <code>true</code> argument.""";

  // CBOR.addArrays()

  static final String ADDARRAYS_DESCR = """
      Add two arrays.""";

  static final String ADDARRAYS_P1_DESCR = """
      First array.""";

  static final String ADDARRAYS_P2_DESCR = """
      Second array.""";

  static final String ADDARRAYS_RETURN_DESCR = """
      Concatenation of array <kbd><i>a</i></kbd> and <kbd><i>b</i></kbd>.""";

  // CBOR.compareArrays()

  static final String CMPARRAYS_DESCR = """
      Compare two arrays lexicographically.""";

  static final String CMPARRAYS_P1_DESCR = """
      First array.""";

  static final String CMPARRAYS_P2_DESCR = """
      Second array.""";

  static final String CMPARRAYS_RETURN_DESCR = """
      If <kbd><i>a</i></kbd> and <kbd><i>b</i></kbd> are identical,
      <kbd>0</kbd> is retuned.
      If <kbd><i>a</i>&nbsp;&gt;&nbsp;<i>b</i></kbd>,
      a positive number is returned.
      If <kbd><i>a</i>&nbsp;&lt;&nbsp;<i>b</i></kbd>,
      a negative number is returned.""";

  // CBOR.toHex()

  static final String TOHEX_DESCR = """
      Encode binary string to hexadecimal.""";

  static final String TOHEX_P1_DESCR = """
      Zero or more bytes to be encoded.""";

  static final String TOHEX_RETURN_DESCR = """
      Hexadecimal encoded data.""";

  // CBOR.fromHex()

  static final String FROMHEX_DESCR = """
      Decode hexadecimal data into binary.""";

  static final String FROMHEX_P1_DESCR = """
      String with zero or more hexadecimal pairs. Each pair represents one byte.""";

  static final String FROMHEX_RETURN_DESCR = """
      The resulting binary (bytes).""";

  // CBOR.toBase64Url()

  static final String TOB64U_DESCR = """
      Encode binary string to base64Url.""";

  static final String TOB64U_P1_DESCR = """
      Zero or more bytes to be encoded.""";

  static final String TOB64U_RETURN_DESCR = """
      Base64Url encoded data.""";

  // CBOR.fromBase64Url()

  static final String FROMB64U_DESCR = """
      Decode base64Url encoded data into binary.
      Note that this method is <i>permissive</i>; it accepts
      base64 encoded data as well as data with or without
      <kbd>'='</kbd> padding.""";

  static final String FROMB64U_P1_DESCR = """
      String in base64Url notation.  The string may be empty.""";

  static final String FROMB64U_RETURN_DESCR = """
      The resulting binary (bytes).""";

  // CBOR.toBigInt()

  static final String TOBIGINT_DESCR = """
      Convert binary string to BigInt.""";

  static final String TOBIGINT_P1_DESCR = """
      Zero or more bytes representing an <i>unsigned</i> number.""";

  static final String TOBIGINT_RETURN_DESCR = """
      Resulting BigInt number.""";

  // CBOR.fromBigInt()

  static final String FROMBIGINT_DESCR = """
      Convert BigInt into binary string.""";

  static final String FROMBIGINT_P1_DESCR = """
      Value to be converted must be greater or equal to zero.""";

  static final String FROMBIGINT_RETURN_DESCR = """
      The resulting binary (one or more bytes).""";

  // CBOR.createEpochTime()

  static final String CREATE_EPOCHTIME_DESCR = """
      Create <code>EpochTime</code> object.
      <div style='margin-top:0.5em'>
      This method creates an Epoch ${TIME} time stamp.</div>
      <div style='margin-top:0.5em'>
      If <kbd><i>instant</i></kbd> is outside the range
      <span style='white-space:nowrap'><code>0</code> (<code>"1970-01-01T00:00:00Z"</code>)</span> to
      <span style='white-space:nowrap'><code>253402300799</code> (<code>"9999-12-31T23:59:59Z"</code>)</span>,
      a <a href='#main.errors'>CborException</a> is thrown.</div>
      <div style='margin-top:0.5em'>
      If <kbd><i>millis</i></kbd> is <code>true</code> a <a href='#wrapper.cbor.float'>CBOR.Float</a>
      object holding seconds with a milliseconds fraction will be created,
      else a <a href='#wrapper.cbor.int'>CBOR.Int</a>
      object holding seconds will be created.</div>
      <div style='margin-top:0.5em'>Sample code:</div>
      <div style='margin:0.3em 0 0 1.2em'>
      <code>let epoch = CBOR.createEpochTime(new Date(), false);<br>
      console.log(epoch.toString());&nbsp;&nbsp;// Diagnostic notation<br>
      <span style='color:#007fdd'>1764939916</span></code></div>
      <div style='margin-top:0.5em'>
      See also <a href='#time.getepochtime'>getEpochTime()</a>.</div>""";

  static final String CREATE_TIME_P_DATE = """
      Time source object.""";

  static final String CREATE_TIME_P_MILLIS = """
      If <kbd><i>millis</i></kbd> is <code>true</code>,
      the milliseconds of the <kbd><i>instant</i></kbd> object will be
      featured in the created time object.  Note: if the millisecond
      part of the <kbd><i>instant</i></kbd> object is zero,
      <kbd><i>millis</i></kbd> is considered to be <code>false</code>.
      <div style='margin-top:0.5em'>If <kbd><i>millis</i></kbd> is
      <code>false</code>, the millisecond part of the <kbd><i>instant</i></kbd>
      object will not be used, but may after <i>rounding</i>,
      add a second to the created time object.</div>""";
  
  static final String CREATE_EPOCHTIME_RETURN_DESCR = """
      Wrapper holding an <code>EpochTime</code> object.""";

  static final String CREATE_TIME_P_UTC = """
      If <kbd><i>utc</i></kbd> is <code>true</code>,
      the <code>UTC</code> time zone (denoted by a terminating <code>Z</code>) will be used,
      else the local time followed by the <code>UTC</code> offset
      (<code>&plusmn;hh:mm</code>) will be used.""";
 
  // CBOR.createEpochTime()

  static final String CREATE_DATETIME_DESCR = """
      Create <code>DateTime</code> object.
      <div style='margin-top:0.5em'>
      This method creates a date/time string in the ISO format 
      described in section 5.6&nbsp;of ${RFC3339}. The string is subsequently wrapped
      in a <a href='#wrapper.cbor.string'>CBOR.String</a> object.</div>
      <div style='margin-top:0.5em'>
      If <kbd><i>instant</i></kbd> is outside
      the range <code style='white-space:nowrap'>"0000-01-01T00:00:00Z"</code> to
      <code style='white-space:nowrap'>"9999-12-31T23:59:59Z"</code>,
      a <a href='#main.errors'>CborException</a> is thrown.</div>
      <div style='margin-top:0.5em'>
      If <kbd><i>millis</i></kbd> is <code>true</code> the date/time string will feature
      milliseconds (<code>.nnn</code>) as well.</div>
      <div style='margin-top:0.5em'>Sample code:</div>
      <div style='margin:0.3em 0 0 1.2em'>
      <code>let dateTime = CBOR.createDateTime(new Date(), true, false);<br>
      console.log(dateTime.toString());&nbsp;&nbsp;// Diagnostic notation<br>
      <span style='color:#007fdd'>"2025-12-05T13:55:42.418+01:00"</span></code></div>
      <div style='margin-top:0.5em'>
      See also <a href='#time.getdatetime'>getDateTime()</a>.</div>""";
  
  static final String CREATE_DATETIME_RETURN_DESCR = """
      Wrapper holding a <code>DateTime</code> object.""";

  // CBOR.decode()

  static final String DECODE_DESCR = """
      Decode (aka &quot;deserialize&quot;) CBOR object.
      <div style='margin-top:0.5em'>This method is equivalent to:</div>
      <div style='margin:0.3em 0 0.5em 1.2em'>
      <code style='white-space:nowrap'>CBOR.initDecoder(<i>cbor</i>, 0).decodeWithOptions()</code></div>
      Unsupported or malformed CBOR data cause a <a href='#main.errors'>CborException</a> to be thrown.""";

  static final String DECODE_P1_DESCR = """
      CBOR binary data <i>holding exactly one CBOR object</i>.""";

  static final String DECODE_RETURN_DESCR = """
      Object.""";

  // CBOR.initDecoder()

  static final String INITEXT_DESCR = """
      Create a customized CBOR decoder.
      This decoding method presumes that the actual
      decoding is performed by one or more (for sequences only) calls to
      <a href='#decoder.decoder.decodewithoptions'><i>Decoder</i>.decodeWithOptions()</a>.
      <div style='margin-top:0.5em'>
      Note that irrespective of options, the decoder maintains parsed data in the form required for
      <a href='#main.deterministic'>Deterministic&nbsp;Encoding</a>.</div>
      <div style='margin-top:0.5em'>
      See also
      <a href='#decoder.decoder.getbytecount'><i>Decoder</i>.getByteCount()</a>.</div>""";

  static final String INITEXT_P1_DESCR = """
      The CBOR data (bytes) to be decoded.""";

  static final String INITEXT_P2_DESCR = """
      The decoder options.
      Multiple options can be combined using the binary OR-operator
      ("<code>|</code>").
      A zero (0) sets the decoder default mode.
      The options are defined by the following constants:
      <div id='CBOR.SEQUENCE_MODE' style='margin-top:0.5em'><kbd>CBOR.SEQUENCE_MODE</kbd>:</div>
      <div style='padding:0.2em 0 0 1.2em'>If the <kbd>CBOR.SEQUENCE_MODE</kbd>
      option is defined, the following apply:
      <ul style='padding:0;margin:0 0 0.5em 1.2em'>
      <li style='margin-top:0'>The decoder returns after having decoded
      a <i>single</i> CBOR object, while preparing for the next object.</li>
      <li>If no data is found (EOF), <code>null</code> is returned
      (<i>empty</i> sequences are permitted).</li>
      </ul>
      Note that data that has not yet been decoded, is not verified for correctness.
      <div style='margin-top:0.5em'>
      See also <a href='#cbor.array.encodeassequence'>encodeAsSequence()</a>.</div></div>
      <div id='CBOR.LENIENT_MAP_DECODING' style='margin-top:0.8em'>
      <kbd>CBOR.LENIENT_MAP_DECODING</kbd>:</div>
      <div style='padding:0.2em 0 0 1.2em'>By default, the decoder requires
      that CBOR maps conform to the
      <a href='#main.deterministic'>Deterministic&nbsp;Encoding</a>
      rules.
      <div>The <kbd>CBOR.LENIENT_MAP_DECODING</kbd> option makes the decoder
      accept CBOR maps with arbitrary key ordering.
      Note that duplicate keys still cause a <a href='#main.errors'>CborException</a> to be thrown.</div></div>
      <div id='CBOR.LENIENT_NUMBER_DECODING' style='margin-top:0.8em'>
      <kbd>CBOR.LENIENT_NUMBER_DECODING</kbd>:</div>
      <div style='padding:0.2em 0 0 1.2em'>By default, the decoder requires
      that CBOR numbers conform to the
      <a href='#main.deterministic'>Deterministic&nbsp;Encoding</a> rules.
      <div>The <kbd>CBOR.LENIENT_NUMBER_DECODING</kbd> option makes the decoder
      accept different representations of CBOR <code>int/bigint</code>
      and <code>float</code> objects, only limited by ${RFC8949}.</div></div>""";

  static final String INITEXT_RETURN_DESCR = """
      Decoder object to be used with
      <a href='#decoder.decoder.decodewithoptions'><i>Decoder</i>.decodeWithOptions()</a>.""";

  // Decoder.decodeWithOptions()

  static final String DECODEEXT_DESCR = """
      Decode CBOR data with options.
      <div style='margin-top:0.5em'>
      Unsupported or malformed CBOR data cause a <a href='#main.errors'>CborException</a> to be thrown.</div>""";

  static final String DECODEEXT_RETURN_DESCR = """
      Object or <code>null</code> (for EOF sequences only).""";

  // Decoder.getByteCount()

  static final String GETBYTECOUNT_DESCR = """
      Get decoder byte count.
      <div style='margin-top:0.5em'>
      This is equivalent to the position of the next item to be read.</div>""";

  static final String GETBYTECOUNT_RETURN_DESCR = """
      The number of bytes read so far.""";

  // CBOR.fromDiagnostic()

  static final String DIAGDEC_DESCR = """
      Decode a CBOR object provided in <a href='#main.diagnostic'>Diagnostic&nbsp;Notation</a>.
      See also <a href='#decoder.cbor.fromdiagnosticseq'>CBOR.fromDiagnosticSeq()</a>.
      <div style='margin-top:0.5em'>This method always returns CBOR data using
      <a href='#main.deterministic'>Deterministic Encoding</a>.</div>
      <div style='margin-top:0.5em'>This method can also be used for decoding
      JSON data.</div>""";

  static final String DIAGDEC_P1_DESCR = """
      CBOR in textual format.""";

  static final String DIAGDEC_RETURN_DESCR = """
      Object.""";

  // CBOR.fromDiagnosticSeq()

  static final String DIAGDECSEQ_DESCR = """
      Decode CBOR objects provided in <a href='#main.diagnostic'>Diagnostic&nbsp;Notation</a>.
      Unlike <a href='#decoder.cbor.fromdiagnostic'>CBOR.fromDiagnostic()</a>,
      this method also accepts CBOR sequences, using a comma
      character (<kbd>','</kbd>) as a separator.
      <div style='margin-top:0.5em'>Note: empty sequences are permitted.</div>""";

  static final String DIAGDECSEQ_P1_DESCR = DIAGDEC_P1_DESCR;

  static final String DIAGDECSEQ_RETURN_DESCR = "JavaScript array holding zero or more objects.";

  static final String INTRO = "${INTRO}";

  static final String WRAPPER_INTRO = "${WRAPPER_INTRO}";

  static final String TIME_OBJECTS = "${TIME_OBJECTS}";

  static final String TIME_METHODS = "${TIME_METHODS}";

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

  static final String EXAMPLES_SEQ_ENC = "${EXAMPLES_SEQ_ENC}";

  static final String EXAMPLES_SEQ_DEC = "${EXAMPLES_SEQ_DEC}";

  static final String EXAMPLES_VARIANT = "${EXAMPLES_VARIANT}";

  static final String ERROR_HANDLING = "${ERROR_HANDLING}";

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
    int[] header = { 1, 1, 1, 1 };
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
    CBOR_NONFIN("CBOR.NonFinite"),
    CBOR_STRING("CBOR.String"),
    CBOR_BYTES("CBOR.Bytes"),
    CBOR_NULL("CBOR.Null"),
    CBOR_BOOLEAN("CBOR.Boolean"),
    CBOR_ARRAY("CBOR.Array"),
    CBOR_MAP("CBOR.Map"),
    CBOR_TAG("CBOR.Tag"),
    CBOR_SIMPLE("CBOR.Simple"),

    JS_THIS("this"),

    JS_NUMBER("Number"),
    JS_NUMBER_BIGINT("Number</kbd>&nbsp;<code>/</code>&nbsp;<kbd>BigInt"),
    JS_ARRAY("[CBOR.<i>Wrapper</i>...]"),
    JS_BIGINT("BigInt"),
    JS_DATE("Date"),
    JS_BOOLEAN("Boolean"),
    JS_STRING("String"),
    JS_DYNAMIC("function|=&gt;"),
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

  enum ExternalReferences {
    CBOR_CORE ("CBOR::Core", "https://www.ietf.org/archive/id/draft-rundgren-cbor-core-23.html"),
    CBOR_CDDL_EXT ("CDDL-EXT", "https://www.ietf.org/archive/id/draft-rundgren-cbor-core-23.html#name-additional-cddl-types"),
    CBOR   ("RFC8949", "https://www.rfc-editor.org/rfc/rfc8949.html"),
    CDDL   ("RFC8610", "https://www.rfc-editor.org/rfc/rfc8610.html"),
    ISO_TIME ("RFC3339", "https://www.rfc-editor.org/rfc/rfc3339.html#section-5.6"),
    EPOCH_TIME ("TIME", "https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap04.html#tag_04_19"),
    COTX ("COTX", "https://datatracker.ietf.org/doc/draft-rundgren-cotx/");

    String moniker;
    String url;

    ExternalReferences(String moniker, String url) {
        this.moniker = moniker;
        this.url = url;
    }
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
    String header = "<h4 id='" + link + "'>" + title + "</h4>\n";
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
    String iFix = method.name.replace("<i>", "").replace("</i>", "");
    String link = (prefix + "." + iFix).toLowerCase();
    if (link.lastIndexOf(prefix.toLowerCase()) > 0 && prefix.startsWith("CBOR.")) {
        link = link.substring(prefix.length() + 1);
    }
    s.append(printSubHeader(link, method.name +(method instanceof Wrapper ? "" : "()")));
    beginTable();
    rowBegin();
    tableHeader("Syntax");
    StringBuilder syntax = new StringBuilder("<kbd>")
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
    syntax.append(")</kbd>");
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
        centeredTableCell("<kbd><i>" + parameter.name + "</i></kbd>");
        centeredTableCell("<kbd>" + parameter.dataType + "</kbd>");
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
      centeredTableCell("<kbd>" + method.optionalReturnValue.dataType + "</kbd>");
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

  String printTimeMethods() {
    s = new StringBuilder();
    outline.indent();
    for (Method method : timeMethods) {
      printMethod("time", method);
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
      if (!wrapper.properties.isEmpty()) {
        outline.increment();
        s.append(printSubHeader("properties." + suffix, wrapper.name + " Properties"));
        outline.indent();
        for (Property property : wrapper.properties) {
          printProperty(wrapper.name, property);
        }
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
    centeredTableCell("<kbd><i>" + property.name + "</i></kbd>");
    centeredTableCell("<kbd>" + property.dataType + "</kbd>");
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

  ArrayList<Method> timeMethods = new ArrayList<>();

  Method addTimeMethod(String name, String description) {
    Method method = new Method();
    method.name = name;
    method.description = description;
    timeMethods.add(method);
    return method;
  }

  static class Property {
    String name;
    DataTypes dataType;
    String description;
  }

  ArrayList<Wrapper> wrappers = new ArrayList<>();

  static class Wrapper extends Method {

    ArrayList<Property> properties = new ArrayList<>();

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
      Property property = new Property();
      properties.add(property);
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

  static final Pattern CONSOLE_LOG_PATTERN = Pattern.compile("%%(.*?)%%", Pattern.DOTALL);

  String htmlize(String text) {
    return CONSOLE_LOG_PATTERN.matcher(text
            .replace("&", "&amp;")
            .replace("\"", "&quot;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace(" ", "&nbsp;")
            .replace("\n", "<br>"))
        .replaceAll("<span style='color:#007fdd'>$1</span>");
  }

  String codeBlock(String rawCode) {
    return "<div class='webpkifloat'><div class='webpkibox' style='margin-left:2em;width:50em'>" +
        htmlize(rawCode) +
        "</div></div>";
  }

  String exampleEncode() {
    return """
        The following code shows how you can create CBOR-encoded data:
        """ +
        codeBlock("""
            let cbor = CBOR.Map()
                           .set(CBOR.Int(1), CBOR.Float(45.7))
                           .set(CBOR.Int(2), CBOR.String("Hi there!")).encode();

            console.log(CBOR.toHex(cbor));
            %%a201fb4046d9999999999a0269486920746865726521%%
                  """);
  }

  String exampleDecode() {
    return """
        The following code shows how you can decode CBOR-encoded data,
        here using the result of the previous encoding example:
        """ +
        codeBlock("""
            let map = CBOR.decode(cbor);

            console.log(map.toString());  // Diagnostic notation
            %%{
              1: 45.7,
              2: "Hi there!"
            }%%

            console.log('Value=' + map.get(CBOR.Int(1)).getFloat64());
            %%Value=45.7%%
                  """);
  }

  String exampleVariantCBOR() {
    return """
        The following code shows how you can decode variant CBOR-encoded data:
        """ +
        codeBlock("""
            let intOrString = CBOR.decode(cbor);
            if (intOrString instanceof CBOR.Int) {
              let i = intOrString.getInt32();
              // Do something with i...
            } else {
              // Throws a CborException if the object is not a CBOR.String
              let s = intOrString.getString();
              // Do something with s...
            }
                  """);
  }

  String exampleDNDecode() {
    return """
        The following code shows how you can decode CBOR provided in
        <a href='#main.diagnostic'>Diagnostic&nbsp;Notation</a>:
        """ +
        codeBlock("""
            let cbor = CBOR.fromDiagnostic(`{
            # Comments are also permitted
              1: 45.7,
              2: "Hi there!"
            }`).encode();

            console.log(CBOR.toHex(cbor));
            %%a201fb4046d9999999999a0269486920746865726521%%
                  """);
  }

  String exampleSeqEncode() {
    return """
        The following code shows how you can create CBOR sequences:
        """ +
        codeBlock("""
            let cbor = CBOR.Array()
              .add(CBOR.Map().set(CBOR.Int(7), CBOR.String("Hi!")))
              .add(CBOR.Float(4.5))
              .encodeAsSequence();

            console.log(CBOR.toHex(cbor));
            %%a10763486921f94480%%
                  """);
  }

  String exampleSeqDecode() {
    return """
        The following code shows how you can decode CBOR sequences,
        here using the result of the previous encoding example:
        """ +
        codeBlock("""
            let decoder = CBOR.initDecoder(cbor, CBOR.SEQUENCE_MODE);
            let object;
            while (object = decoder.decodeWithOptions()) {
              console.log('\\n' + object.toString());
            }
            
            %%{
              7: "Hi!"
            }%%
                   
            %%4.5%%
                  """);
  }

  void replace(String handle, String with) {
    int length = template.length();
    template = template.replace(handle, with);
    if (length == template.length())
      throw new RuntimeException("handle: " + handle);
  }

  void rangedIntMethod(Wrapper wrapper, String bits, String min, String max, String optionalText) {
    String type = (min.equals("0") ? "Uint" : "Int") + bits;
    String method = "get" + type;
    StringBuilder description = new StringBuilder(
        "Get CBOR <code>")
        .append(type.toLowerCase())
        .append("</code> object.<div style='margin-top:0.5em'>If the return value is outside the range <code>")
        .append(min).append(" </code>to<code> ")
        .append(max).append("</code>, a <a href='#main.errors'>CborException</a> is thrown.");
    if (optionalText != null) {
      description.append(" ").append(optionalText);
    }
    description.append("</div>");
    wrapper.addMethod(method, description.toString())
        .setReturn(DataTypes.JS_NUMBER, "Decoded integer.");
  }

  void rangedBigIntMethod(Wrapper wrapper, String bits, String min, String max) {
    String type = (min.equals("0") ? "Uint" : "Int") + bits;
    StringBuilder description = new StringBuilder(
        "Get CBOR <code>")
        .append(type.toLowerCase())
        .append("</code> object.<div style='margin-top:0.5em'>If the return value is outside the range <code>")
        .append(min).append(" </code>to<code> ")
        .append(max).append("</code>, a <a href='#main.errors'>CborException</a> is thrown.</div>");
    wrapper.addMethod("get" + type, description.toString())
        .setReturn(DataTypes.JS_BIGINT, W_GETBIGINT_RETURN_DESCR);
  }

  void createRangedMethod(Wrapper wrapper, String bits, String min, String max) {
    boolean i128 = bits.equals("128");
    String type = (min.equals("0") ? "Uint" : "Int") + bits;
    String method = "CBOR." + (i128 ? "BigInt" : "Int") + ".create" + type;
    StringBuilder description = new StringBuilder(
        "Create CBOR <code>")
        .append(type.toLowerCase())
        .append("</code> object.<div style='margin-top:0.5em'>If <kbd><i>value</i></kbd> is outside the range <code>")
        .append(min).append(" </code>to<code> ")
        .append(max).append("</code>, a <a href='#main.errors'>CborException</a> is thrown.</div>" +
        "<div style='margin-top:0.5em'>See also <a href='#cbor.")
        .append(i128 ? "bigint" : "int")
        .append(".get")
        .append(type.toLowerCase())
        .append("'>get")
        .append(type)
        .append("()</a>.</div>");
    wrapper.addMethod(method, description.toString())
        .addParameter("value", DataTypes.JS_NUMBER_BIGINT, "Integer to be wrapped.")
        .setReturn(i128 ? DataTypes.CBOR_BIGINT : DataTypes.CBOR_INT,
                   "Instantiated <a href='#wrapper.cbor." +
                      (i128 ? "bigint" : "int") + "'>CBOR." + 
                      (i128 ? "BigInt" : "Int") + "</a> object.");
  }

  void bigIntMethods(Wrapper wrapper, boolean i64Flag) {
    if (i64Flag) {
        rangedBigIntMethod(wrapper, "64",
            "-0x8000000000000000",
            "0x7fffffffffffffff");

        rangedBigIntMethod(wrapper, "64",
            "0",
            "0xffffffffffffffff");

        createRangedMethod(wrapper, "8",
            "-0x80",
            "0x7f");

        createRangedMethod(wrapper, "8",
            "0",
            "0xff");

        createRangedMethod(wrapper, "16",
            "-0x8000",
            "0x7fff");

        createRangedMethod(wrapper, "16",
            "0",
            "0xffff");

        createRangedMethod(wrapper, "32",
            "-0x80000000",
            "0x7fffffff");

        createRangedMethod(wrapper, "32",
            "0",
            "0xffffffff");

        createRangedMethod(wrapper, "53",
            "</code><kbd>Number.MIN_SAFE_INTEGER</kbd>&nbsp;(<code>-9007199254740991</code>)<code>",
            "</code><kbd>Number.MAX_SAFE_INTEGER</kbd>&nbsp;(<code>9007199254740991</code>)<code>");

        createRangedMethod(wrapper, "64",
            "-0x8000000000000000",
            "0x7fffffffffffffff");

        createRangedMethod(wrapper, "64",
            "0",
            "0xffffffffffffffff");
    } else {
         rangedBigIntMethod(wrapper, "128",
            "-0x80000000000000000000000000000000",
            "0x7fffffffffffffffffffffffffffffff");

        rangedBigIntMethod(wrapper, "128",
            "0",
            "0xffffffffffffffffffffffffffffffff");
            
        createRangedMethod(wrapper, "128", 
            "-0x80000000000000000000000000000000",
            "0x7fffffffffffffffffffffffffffffff");

        createRangedMethod(wrapper, "128", 
            "0", 
            "0xffffffffffffffffffffffffffffffff");
    }

    wrapper.addMethod("getBigInt", W_GETBIGINT_DESCR)
        .setReturn(DataTypes.JS_BIGINT, W_GETBIGINT_RETURN_DESCR);
  }

  void intMethods(Wrapper wrapper) {

    rangedIntMethod(wrapper, "8",
        "-0x80",
        "0x7f",
        null);

    rangedIntMethod(wrapper, "8",
        "0",
        "0xff",
        null);

    rangedIntMethod(wrapper, "16",
        "-0x8000",
        "0x7fff",
        null);

    rangedIntMethod(wrapper, "16",
        "0",
        "0xffff",
        null);

    rangedIntMethod(wrapper, "32",
        "-0x80000000",
        "0x7fffffff",
        null);

    rangedIntMethod(wrapper, "32",
        "0",
        "0xffffffff",
        null);

    rangedIntMethod(wrapper, "53",
        "</code><kbd>Number.MIN_SAFE_INTEGER</kbd>&nbsp;(<code>-9007199254740991</code>)<code>",
        "</code><kbd>Number.MAX_SAFE_INTEGER</kbd>&nbsp;(<code>9007199254740991</code>)<code>",
        "</div><div style='margin-top:0.5em'>" +
        "Since 53-bit integers are specific to JavaScript, this method " +
        "should be used with caution in cross-platform scenarios.");

    bigIntMethods(wrapper, true);
  }

  CreateDocument(String templateFileName, String documentFileName) {
    template = UTF8.decode(IO.readFile(templateFileName));

    // CBOR.Int

    intMethods(addWrapper(DataTypes.CBOR_INT, W_INT_DESCR)
        .addWrapperParameter("value", DataTypes.JS_NUMBER_BIGINT, W_INT_P1_DESCR));

    // CBOR.BigInt

    bigIntMethods(addWrapper(DataTypes.CBOR_BIGINT, W_BIGINT_DESCR)
        .addWrapperParameter("value", DataTypes.JS_NUMBER_BIGINT, W_BIGINT_P1_DESCR), false);

    // CBOR.Float

    addWrapper(DataTypes.CBOR_FLOAT, W_FLOAT_DESCR)
        .addWrapperParameter("value", DataTypes.JS_NUMBER, W_FLOAT_P1_DESCR)

        .addMethod("getFloat16", W_GETFLOAT_DESCR +
            "<div style='margin-top:0.5em'>" +
            "If the CBOR object is not a 16-bit <span style='white-space:nowrap'><code>IEEE</code> <code>754</code></span> item, " +
            "a <a href='#main.errors'>CborException</a> is thrown.</div>")
        .setReturn(DataTypes.JS_NUMBER, W_GETFLOAT_RETURN_DESCR)

        .addMethod("getFloat32", W_GETFLOAT_DESCR +
            "<div style='margin-top:0.5em'>" +
            "If the CBOR object is not a 16-bit or 32-bit <span style='white-space:nowrap'><code>IEEE</code> <code>754</code></span> item, " +
            "a <a href='#main.errors'>CborException</a> is thrown.</div>")
        .setReturn(DataTypes.JS_NUMBER, W_GETFLOAT_RETURN_DESCR)

        .addMethod("getFloat64", W_GETFLOAT_DESCR)
        .setReturn(DataTypes.JS_NUMBER, W_GETFLOAT_RETURN_DESCR)

        .addMethod("CBOR.Float.createExtendedFloat", W_CREEXTFLOAT_DESCR)
        .addParameter("value", DataTypes.JS_NUMBER, W_CREEXTFLOAT_P1_DESCR)
        .setReturn(DataTypes.CBOR_Any, W_CREEXTFLOAT_RETURN_DESCR)

        .addMethod("getExtendedFloat64", W_GETEXTFLOAT_DESCR)
        .setReturn(DataTypes.JS_NUMBER, W_GETEXTFLOAT_RETURN_DESCR)
        
        .addMethod("CBOR.Float.createFloat16", W_CREFLOAT16_DESCR)
        .addParameter("value", DataTypes.JS_NUMBER, W_CREFLOAT16_P1_DESCR)
        .setReturn(DataTypes.CBOR_FLOAT, W_CREFLOAT16_RETURN_DESCR)

        .addMethod("CBOR.Float.createFloat32", W_CREFLOAT32_DESCR)
        .addParameter("value", DataTypes.JS_NUMBER, W_CREFLOAT32_P1_DESCR)
        .setReturn(DataTypes.CBOR_FLOAT, W_CREFLOAT32_RETURN_DESCR)

        .setProperty("length", DataTypes.JS_NUMBER, W_FLOAT_PROP_DESCR);

    // CBOR.NonFinite

    addWrapper(DataTypes.CBOR_NONFIN, W_NONFIN_DESCR)
        .addWrapperParameter("value", DataTypes.JS_BIGINT, W_NONFIN_P1_DESCR)

        .addMethod("getNonFinite", W_GET_NONFIN_DESCR)
        .setReturn(DataTypes.JS_BIGINT, W_GET_NONFIN_RETURN_DESCR)

        .addMethod("getNonFinite64", W_GET_NONFIN64_DESCR)
        .setReturn(DataTypes.JS_BIGINT, W_GET_NONFIN64_RETURN_DESCR)

        .addMethod("isNaN", W_ISNAN_NONFIN_DESCR)
        .setReturn(DataTypes.JS_BOOLEAN, W_ISNAN_NONFIN_RETURN_DESCR)

        .addMethod("isSimple", W_ISSIMPLE_NONFIN_DESCR)
        .setReturn(DataTypes.JS_BOOLEAN, W_ISSIMPLE_NONFIN_RETURN_DESCR)

        .addMethod("getSign", W_GETSIGN_NONFIN_DESCR)
        .setReturn(DataTypes.JS_BOOLEAN, W_GETSIGN_NONFIN_RETURN_DESCR)

        .addMethod("setSign", W_SETSIGN_NONFIN_DESCR)
        .addParameter("sign", DataTypes.JS_BOOLEAN, W_SETSIGN_NONFIN_P1_DESCR)
        .setReturn(DataTypes.JS_THIS, W_SETSIGN_NONFIN_RETURN_DESCR)

        .addMethod("CBOR.NonFinite.createPayload", W_CREPAYLOAD_NONFIN_DESCR)
        .addParameter("payload", DataTypes.JS_BIGINT, W_CREPAYLOAD_NONFIN_P1_DESCR)
        .setReturn(DataTypes.CBOR_NONFIN, W_CREPAYLOAD_NONFIN_RETURN_DESCR)

        .addMethod("getPayload", W_GETPAYLOAD_NONFIN_DESCR)
        .setReturn(DataTypes.JS_BIGINT, W_GETPAYLOAD_NONFIN_RETURN_DESCR)

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

        .addMethod("getBoolean", W_GETBOOL_DESCR)
        .setReturn(DataTypes.JS_BOOLEAN, W_GETBOOL_RETURN_DESCR);

    // CBOR.Null

    addWrapper(DataTypes.CBOR_NULL, W_NULL_DESCR);

    // CBOR.Array

    addWrapper(DataTypes.CBOR_ARRAY, W_ARRAY_DESCR)

        .addMethod("add", W_ARRAY_ADD_DESCR)
        .addParameter("object", DataTypes.CBOR_Any, W_ARRAY_ADD_P1_DESCR)
        .setReturn(DataTypes.JS_THIS, CURRENT_RETURN_DESCR)

        .addMethod("get", W_ARRAY_GET_DESCR)
        .addParameter("index", DataTypes.JS_NUMBER, ARRAY_INDEX_P1_DESCR)
        .setReturn(DataTypes.CBOR_Any, W_ARRAY_GET_RETURN_DESCR)

        .addMethod("remove", W_ARRAY_REMOVE_DESCR)
        .addParameter("index", DataTypes.JS_NUMBER, ARRAY_INDEX_P1_DESCR)
        .setReturn(DataTypes.CBOR_Any, W_ARRAY_UPDATE_RETURN_DESCR)

        .addMethod("update", W_ARRAY_UPDATE_DESCR)
        .addParameter("index", DataTypes.JS_NUMBER, ARRAY_INDEX_P1_DESCR)
        .addParameter("object", DataTypes.CBOR_Any, W_ARRAY_UPDATE_P2_DESCR)
        .setReturn(DataTypes.CBOR_Any, W_ARRAY_UPDATE_RETURN_DESCR)

        .addMethod("insert", W_ARRAY_INSERT_DESCR)
        .addParameter("index", DataTypes.JS_NUMBER, ARRAY_INDEX_INSERT_P1_DESCR)
        .addParameter("object", DataTypes.CBOR_Any, W_ARRAY_UPDATE_P2_DESCR)
        .setReturn(DataTypes.JS_THIS, CURRENT_RETURN_DESCR)

        .addMethod("toArray", W_ARRAY_TOARR_DESCR)
        .setReturn(DataTypes.JS_ARRAY, W_ARRAY_TOARR_RETURN_DESCR)

        .addMethod("encodeAsSequence", W_ARRAY_ENC_AS_SEQ_DESCR)
        .setReturn(DataTypes.JS_UINT8ARRAY, W_ARRAY_ENC_AS_SEQ_RETURN_DESCR)

        .setProperty("length", DataTypes.JS_NUMBER, W_ARRAY_PROP_DESCR);

    // CBOR.Map

    addWrapper(DataTypes.CBOR_MAP, W_MAP_DESCR)

        .addMethod("set", W_MAP_SET_DESCR)
        .addParameter("key", DataTypes.CBOR_Any, KEY_PARAMETER_DESCR)
        .addParameter("object", DataTypes.CBOR_Any, OBJECT_PARAMETER_DESCR)
        .setReturn(DataTypes.JS_THIS, CURRENT_RETURN_DESCR)

        .addMethod("setDynamic", W_MAP_SET_DYN_DESCR)
        .addParameter("dynamic", DataTypes.JS_DYNAMIC, W_MAP_SET_DYN_PARAMETER_DESCR)
        .setReturn(DataTypes.JS_THIS, CURRENT_RETURN_DESCR)

        .addMethod("merge", W_MAP_MERGE_DESCR)
        .addParameter("map", DataTypes.CBOR_MAP, W_MAP_MERGE_P1_DESCR)
        .setReturn(DataTypes.JS_THIS, CURRENT_RETURN_DESCR)

        .addMethod("update", W_MAP_UPDATE_DESCR)
        .addParameter("key", DataTypes.CBOR_Any, KEY_PARAMETER_DESCR)
        .addParameter("object", DataTypes.CBOR_Any, OBJECT_PARAMETER_DESCR)
        .addParameter("existing", DataTypes.JS_BOOLEAN, W_MAP_UPDATE_P3_DESCR)
        .setReturn(DataTypes.CBOR_Any, W_MAP_UPDATE_RETURN_DESCR)

        .addMethod("get", W_MAP_GET_DESCR)
        .addParameter("key", DataTypes.CBOR_Any, KEY_PARAMETER_DESCR)
        .setReturn(DataTypes.CBOR_Any, W_MAP_GET_RETURN_DESCR)

        .addMethod("getConditionally", W_MAP_GETCOND_DESCR)
        .addParameter("key", DataTypes.CBOR_Any, KEY_PARAMETER_DESCR)
        .addParameter("defaultObject", DataTypes.CBOR_Any, W_MAP_GETCOND_P2_DESCR)
        .setReturn(DataTypes.CBOR_Any, W_MAP_GETCOND_RETURN_DESCR)

        .addMethod("containsKey", W_MAP_CONTAINS_DESCR)
        .addParameter("key", DataTypes.CBOR_Any, KEY_PARAMETER_DESCR)
        .setReturn(DataTypes.JS_BOOLEAN, W_MAP_CONTAINS_RETURN_DESCR)

        .addMethod("remove", W_MAP_REMOVE_DESCR)
        .addParameter("key", DataTypes.CBOR_Any, KEY_PARAMETER_DESCR)
        .setReturn(DataTypes.CBOR_Any, W_MAP_REMOVE_RETURN_DESCR)

        .addMethod("getKeys", W_MAP_GETKEYS_DESCR)
        .setReturn(DataTypes.JS_ARRAY, W_MAP_GETKEYS_RETURN_DESCR)

        .addMethod("setSortingMode", W_MAP_SET_SORTING_MODE_DESCR)
        .addParameter("preSortedKeys", DataTypes.JS_BOOLEAN, W_MAP_SET_SORTING_MODE_P1_DESCR)
        .setReturn(DataTypes.JS_THIS, CURRENT_RETURN_DESCR)

        .setProperty("length", DataTypes.JS_NUMBER, W_MAP_PROP_DESCR);

    // CBOR.Tag

    addWrapper(DataTypes.CBOR_TAG, W_TAG_DESCR)
        .addWrapperParameter("tagNumber", DataTypes.JS_NUMBER_BIGINT, W_TAG_P1_DESCR)
        .addWrapperParameter("object", DataTypes.CBOR_Any, W_TAG_P2_DESCR)

        .addMethod("getTagNumber", W_TAG_GETNUM_DESCR)
        .setReturn(DataTypes.JS_BIGINT, W_TAG_GETNUM_RETURN_DESCR)

        .addMethod("get", W_TAG_GET_DESCR)
        .setReturn(DataTypes.CBOR_Any, W_TAG_GET_RETURN_DESCR)

        .setProperty("cotxId", DataTypes.JS_STRING, W_TAG_PROP_COTX_ID_DESCR)
        .setProperty("cotxObject", DataTypes.CBOR_Any, W_TAG_PROP_COTX_OBJECT_DESCR);

    // CBOR.Simple

    addWrapper(DataTypes.CBOR_SIMPLE, W_SIMPLE_DESCR)
        .addWrapperParameter("value", DataTypes.JS_NUMBER, W_SIMPLE_PARAM_DESCR)

        .addMethod("getSimple", W_SIMPLE_GETVAL_DESCR)
        .setReturn(DataTypes.JS_NUMBER, W_SIMPLE_GETVAL_RETURN_DESCR);

    // Time

    addTimeMethod("getDateTime", W_GETDATETIME_DESCR)
        .setReturn(DataTypes.JS_DATE, W_GETDATETIME_RETURN_DESCR);

    addTimeMethod("getEpochTime", W_GETEPOCHTIME_DESCR)
        .setReturn(DataTypes.JS_DATE, W_GETEPOCHTIME_RETURN_DESCR);

    // Common

    addCommonMethod("encode", ENCODE_DESCR)
        .setReturn(DataTypes.JS_UINT8ARRAY, ENCODE_RETURN_DESCR);

    addCommonMethod("clone", CLONE_DESCR)
        .setReturn(DataTypes.CBOR_Any, CLONE_RETURN_DESCR);

    addCommonMethod("equals", EQUALS_DESCR)
        .addParameter("object", DataTypes.CBOR_Any, EQUALS_P1_DESCR)
        .setReturn(DataTypes.JS_BOOLEAN, EQUALS_RETURN_DESCR);

    addCommonMethod("toDiagnostic", TODIAG_DESCR)
        .addParameter("prettyPrint", DataTypes.JS_BOOLEAN, TODIAG_P1_DESCR)
        .setReturn(DataTypes.JS_STRING, TODIAG_RETURN_DESCR);

    addCommonMethod("toString", TOSTRING_DESCR)
        .setReturn(DataTypes.JS_STRING, TODIAG_RETURN_DESCR);

    addCommonMethod("isNull", ISNULL_DESCR)
        .setReturn(DataTypes.JS_BOOLEAN, ISNULL_RETURN_DESCR);

    addCommonMethod("checkForUnread", CHECK4_DESCR)
        .setReturn(DataTypes.JS_THIS, CURRENT_RETURN_DESCR);

    addCommonMethod("scan", SCAN_DESCR)
        .setReturn(DataTypes.JS_THIS, CURRENT_RETURN_DESCR);

    // CBOR.decode()

    addDecoderMethod("CBOR.decode", DECODE_DESCR)
        .addParameter("cbor", DataTypes.JS_UINT8ARRAY, DECODE_P1_DESCR)
        .setReturn(DataTypes.CBOR_Any, DECODE_RETURN_DESCR);

    // CBOR.initDecoder()

    addDecoderMethod("CBOR.initDecoder", INITEXT_DESCR)
        .addParameter("cbor", DataTypes.JS_UINT8ARRAY, INITEXT_P1_DESCR)
        .addParameter("options", DataTypes.JS_NUMBER, INITEXT_P2_DESCR)
        .setReturn(DataTypes.ExtendedDecoder, INITEXT_RETURN_DESCR);

    // Decoder.decodeWithOptions()

    addDecoderMethod("<i>Decoder</i>.decodeWithOptions", DECODEEXT_DESCR)
        .setReturn(DataTypes.CBOR_Any, DECODEEXT_RETURN_DESCR);

    // Decoder.getByteCount()

    addDecoderMethod("<i>Decoder</i>.getByteCount", GETBYTECOUNT_DESCR)
        .setReturn(DataTypes.JS_NUMBER, GETBYTECOUNT_RETURN_DESCR);

    // CBOR.fromDiagnostic()

    addDecoderMethod("CBOR.fromDiagnostic", DIAGDEC_DESCR)
        .addParameter("cborText", DataTypes.JS_STRING, DIAGDEC_P1_DESCR)
        .setReturn(DataTypes.CBOR_Any, DIAGDEC_RETURN_DESCR);

    // CBOR.fromDiagnosticSeq()

    addDecoderMethod("CBOR.fromDiagnosticSeq", DIAGDECSEQ_DESCR)
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

    // CBOR.toBigInt()

    addUtilityMethod("CBOR.toBigInt", TOBIGINT_DESCR)
        .addParameter("byteArray", DataTypes.JS_UINT8ARRAY, TOBIGINT_P1_DESCR)
        .setReturn(DataTypes.JS_BIGINT, TOBIGINT_RETURN_DESCR);

    // CBOR.fromBigInt()

    addUtilityMethod("CBOR.fromBigInt", FROMBIGINT_DESCR)
        .addParameter("value", DataTypes.JS_BIGINT, FROMBIGINT_P1_DESCR)
        .setReturn(DataTypes.JS_UINT8ARRAY, FROMBIGINT_RETURN_DESCR);

     // CBOR.createDateTime()

    addUtilityMethod("CBOR.createDateTime", CREATE_DATETIME_DESCR)
        .addParameter("instant", DataTypes.JS_DATE, CREATE_TIME_P_DATE)
        .addParameter("millis", DataTypes.JS_BOOLEAN, CREATE_TIME_P_MILLIS)
        .addParameter("utc", DataTypes.JS_BOOLEAN, CREATE_TIME_P_UTC)
        .setReturn(DataTypes.CBOR_STRING, CREATE_DATETIME_RETURN_DESCR);

     // CBOR.createEpochTime()

    addUtilityMethod("CBOR.createEpochTime", CREATE_EPOCHTIME_DESCR)
        .addParameter("instant", DataTypes.JS_DATE, CREATE_TIME_P_DATE)
        .addParameter("millis", DataTypes.JS_BOOLEAN, CREATE_TIME_P_MILLIS)
        .setReturn(DataTypes.CBOR_Any, CREATE_EPOCHTIME_RETURN_DESCR);

    replace(INTRO, printMainHeader("intro", "Introduction"));
    outline.increment();

    replace(WRAPPER_INTRO, printMainHeader("wrappers", "CBOR Wrapper Objects"));
    replace(CBOR_WRAPPERS, printCborWrappers());
    outline.increment();

    replace(TIME_OBJECTS, printMainHeader("time", "Time Objects"));
    replace(TIME_METHODS, printTimeMethods());
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
    replace(JS_NUMBER_CONS_FP, printSubHeader("jsnumbers.fp", "Floating-Point Numbers"));
    outline.undent();
    outline.increment();

    replace(DIAGNOSTIC_NOTATION, printMainHeader("diagnostic", "Diagnostic Notation"));
    outline.increment();

    replace(DETERMINISTIC_ENCODING, printMainHeader("deterministic", "Deterministic Encoding"));
    outline.increment();

    replace(EXAMPLES, printMainHeader("examples", "Using the CBOR API"));
    outline.indent();
    replace(EXAMPLES_ENC, printSubHeader("examples.encoding", "Encode CBOR Data") +
        exampleEncode());
    outline.increment();
    replace(EXAMPLES_DEC, printSubHeader("examples.decoding", "Decode CBOR Data") +
        exampleDecode());
    outline.increment();
    replace(EXAMPLES_VARIANT, printSubHeader("examples.variant-decoding", "Decode Variant CBOR Data") +
        exampleVariantCBOR());
    outline.increment();
    replace(EXAMPLES_DN_DEC, printSubHeader("examples.dn-decoding", "Decode CBOR Diagnostic Notation") +
        exampleDNDecode());
    outline.increment();
    replace(EXAMPLES_SEQ_ENC, printSubHeader("examples.seq-encoding", "Encode CBOR Sequence") +
        exampleSeqEncode());
    outline.increment();
    replace(EXAMPLES_SEQ_DEC, printSubHeader("examples.seq-decoding", "Decode CBOR Sequence") +
        exampleSeqDecode());
    outline.undent();
    outline.increment();

    replace(ERROR_HANDLING, printMainHeader("errors", "Error Handling"));
    outline.increment();

    replace(VERSION_INFO, printMainHeader("version", "Version"));
    outline.increment();

    replace(TOC, printTableOfContents());

    for (ExternalReferences ref: ExternalReferences.values()) {
        replace("${" + ref.moniker + "}",
                "<span style='white-space:nowrap'>[<a href='" + ref.url + "' " +
                "title='" + ref.moniker + "'>" + ref.moniker + 
                "<img src='xtl.svg' alt='link'></a>]</span>");
    }

    IO.writeFile(documentFileName, template);
  }

  public static void main(String[] args) {
    new CreateDocument(args[0], args[1]);
  }
}