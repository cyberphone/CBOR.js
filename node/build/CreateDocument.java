import java.util.ArrayList;

import org.webpki.util.IO;
import org.webpki.util.UTF8;

public class CreateDocument {
  
  static final String WRAPPER_RETURN_DESCR = 
  """
  Wrapper object.""";

  static final String W_INT_DESCR = 
  """
  Constructor.  Creates a CBOR integer wrapper object.""";
  
  static final String W_INT_P1_DESCR = 
  """
  Integer to be wrapped.""";


  static final String GETINT_DESCR = 
  """
  Reads CBOR integer.""";
  
  static final String GETINT_RETURN_DESCR = 
  """
  Decoded CBOR integer.""";


  static final String W_ARRAY_DESCR = 
  """
  Constructor.  Creates a CBOR array wrapper object.""";
  

  static final String ARRAY_ADD_DESCR = 
  """
  Adds CBOR array element.""";

  static final String ARRAY_ADD_P1_DESCR = 
  """
  Element to add.""";
  
  static final String ARRAY_ADD_RETURN_DESCR = 
  """
  Current object.""";


  static final String ARRAY_GET_DESCR = 
  """
  Fetches CBOR array element.""";

  static final String ARRAY_GET_P1_DESCR = 
  """
  Index (0..length-1) of element.""";
  
  static final String ARRAY_GET_RETURN_DESCR = 
  """
  Element.""";    
  
  static final String ARRAY_PROP_DESCR = 
  """
  Number of elements in the array."""; 


  static final String CLONE_DESCR = 
  """
  Creates a new instance of this object, initialized
  with the original CBOR content.""";
  static final String CLONE_RETURN_DESCR = 
  """
  Copy of object.""";


  static final String EQUALS_DESCR = 
  """
  Compare objects with respect to CBOR data.""";
  
  static final String EQUALS_P1_DESCR = 
  """
  The object to compare with.""";

  static final String EQUALS_RETURN_DESCR = 
  """
  <code>true</code> if this object is equal to <code><i>object</i></code>;
  <code>false</code> otherwise.""";


  static final String TODIAG_DESCR = 
  """
  Renders object in ${DIAGNOSTIC_NOTATION}.""";
  
  static final String TODIAG_P1_DESCR = 
  """
  If <code><i>prettyPrint</i></code> is <code>true</code>,
  additional white space is inserted between elements to make the result
  easier to read.""";

  static final String TODIAG_RETURN_DESCR = 
  """
  Textual version of the encapsulated CBOR content.""";


  static final String COMMON_METHODS = "${COMMON_METHODS}";
  
  static final String CBOR_WRAPPERS = "${CBOR_WRAPPERS}";

    String template;

  ArrayList<TOCEntry> tocEntries = new ArrayList<>();

  static class Outline implements Cloneable {
    int[] header = {0,0,0,0};
    int ind = 0;

    String getHeader() {
      StringBuilder h = new StringBuilder().append(header[0]);
      for (int q = 1; q <= ind; q++) {
        h.append('.').append(header[q]);
      }
      return h.toString();
    }

    void increment() {
      header[ind]++;
    }

    void indent() {
      header[++ind] = 0;
    }

    void undent() {
      --ind;
    }
  }

  Outline outline;

  static class TOCEntry {
    String title;
    boolean indent;

    TOCEntry(String title) {
      this.title = title;
    }
  }

  TOCEntry addTocEntry(String title) {
    TOCEntry tocEntry = new TOCEntry(title);
    tocEntries.add(tocEntry);
    return tocEntry;
  }

  enum DataTypes {
    CBOR_Any("CBOR.<i>Wrapper</i>"),

    CBOR_INT("CBOR.Int"),
    CBOR_BIG_INT("CBOR.BigInt"),
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
    s.append("<div class='webpkifloat'>\n<table class='webpkitable' style='margin-left:2em'>\n");
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
    s.append(">").append(text).append("</td>");
  }

  void tableCell(String text) {
    tableCell(text, 1);
  }

  void centeredTableCell(String text) {
    s.append("<td style='text-align:center'>").append(text).append("</td>");
  }

  void printMethod(String numberPrefix, Method method) {
    s.append("<h5>" + numberPrefix + " " + method.name);
    if (!(method instanceof Wrapper)) {
      s.append("()");
    }
    s.append("</h5>\n");
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

  void printCommonMethods(String numberPrefix) {
    int subSection = 0;
    for (Method method : commonMethods) {
      printMethod(numberPrefix + (++subSection), method);
    }
  }

  void printCborWrappers(String numberPrefix) {
    int subSection1 = 0;
    for (Wrapper wrapper : wrappers) {
      String wrapperNumber = numberPrefix + (++subSection1);
      printMethod(wrapperNumber, wrapper);
      int subSection2 = 0;
      if (!wrapper.methods.isEmpty()) {
        String headerNumber = wrapperNumber + "." + (++subSection2);
        s.append("<h5>" + headerNumber + " Methods</h5>\n");
        int subSection3 = 0;
        for (Method method : wrapper.methods) {
          printMethod(headerNumber + "." + (++subSection3), method);
        }
      }
      if (wrapper.property != null) {
        String headerNumber = wrapperNumber + "." + (++subSection2);
        s.append("<h5>" + headerNumber + " Properties</h5>\n");
        int subSection3 = 0;
        printProperty(headerNumber + "." + (++subSection3), wrapper.property);
      }
    }
  }

  void printProperty(String numberPrefix, Property property) {
    s.append("<h5>" + numberPrefix + " " + property.name + "</h5>");
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

  void replace(String handle, String with) {
    template = template.replace(handle, with);
  }

  CreateDocument(String templateFileName, String documentFileName) {
    template = UTF8.decode(IO.readFile(templateFileName));

    addWrapper(DataTypes.CBOR_INT, W_INT_DESCR)
      .addWrapperParameter("value", DataTypes.JS_NUMBER, W_INT_P1_DESCR)

      .addMethod("getInt", GETINT_DESCR)
      .setReturn(DataTypes.JS_NUMBER, GETINT_RETURN_DESCR);


    addWrapper(DataTypes.CBOR_ARRAY, W_ARRAY_DESCR)

      .addMethod("add", ARRAY_ADD_DESCR)
      .addParameter("element", DataTypes.CBOR_Any, ARRAY_ADD_P1_DESCR)
      .setReturn(DataTypes.JS_THIS, ARRAY_ADD_RETURN_DESCR)

      .addMethod("get", ARRAY_GET_DESCR)
      .addParameter("index", DataTypes.JS_NUMBER, ARRAY_GET_P1_DESCR)
      .setReturn(DataTypes.CBOR_Any, ARRAY_GET_RETURN_DESCR)

      .setProperty("length", DataTypes.JS_NUMBER, ARRAY_PROP_DESCR);

    addCommonMethod("clone", CLONE_DESCR)
      .setReturn(DataTypes.CBOR_Any, CLONE_RETURN_DESCR);
    // addCommonMethod("encode()", "");

    addCommonMethod("equals", EQUALS_DESCR)
      .addParameter("object", DataTypes.CBOR_Any, EQUALS_P1_DESCR)
      .setReturn(DataTypes.JS_BOOLEAN, EQUALS_RETURN_DESCR);
    // addCommonMethod("toString()", "");
 
    addCommonMethod("toDiagnosticNotation", TODIAG_DESCR)
      .addParameter("prettyPrint", DataTypes.JS_BOOLEAN, TODIAG_P1_DESCR)
      .setReturn(DataTypes.JS_STRING, TODIAG_RETURN_DESCR);
      
    addTocEntry("Table of Contents");
    addTocEntry("CBOR Objects");
    addTocEntry("CBOR.Int").indent = true;
    addTocEntry("CBOR.BigInt").indent = true;
    addTocEntry("CBOR.Float").indent = true;
    s = new StringBuilder();
    printCborWrappers("3.");
    replace(CBOR_WRAPPERS, s.toString());
    s = new StringBuilder();
    printCommonMethods("4.");
    replace(COMMON_METHODS, s.toString());
    IO.writeFile(documentFileName, template);
  }
  public static void main(String[] args) {
    System.out.println("HI");
    new CreateDocument(args[0], args[1]);
  }
}