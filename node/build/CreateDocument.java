import java.util.ArrayList;

import org.webpki.util.IO;
import org.webpki.util.UTF8;

public class CreateDocument {

  static final String W_INT_DESCRIPTION = 
  """
  Constructor.  Creates a CBOR integer wrapper object.""";
  
  static final String W_INT_P1_DESCRIPTION = 
  """
  Wrapped integer.""";

  static final String W_INT_RETURN_DESCRIPTION = 
  """
  Intitialized wrapper object.""";


  static final String CLONE_DESCRIPTION = 
  """
  Creates a deep copy of this object.""";
  static final String CLONE_RETURN_DESCRIPTION = 
  """
  Copy of object.""";


  static final String EQUALS_DESCRIPTION = 
  """
  Compare objects with respect to CBOR data.""";
  
  static final String EQUALS_P1_DESCRIPTION = 
  """
  The object to compare with.""";

  static final String EQUALS_RETURN_DESCRIPTION = 
  """
  <code>true</code> if this object is equal to <code><i>object</i></code>;
  <code>false</code> otherwise.""";


  static final String TODIAG_DESCRIPTION = 
  """
  Renders object in ${DIAGNOSTIC_NOTATION}.""";
  
  static final String TODIAG_P1_DESCRIPTION = 
  """
  If <code><i>prettyPrint</i></code> is <code>true</code>,
  additional white space is inserted between elements to make the result
  easier to read.""";

  static final String TODIAG_RETURN_DESCRIPTION = 
  """
  Textual version of the encapsulated CBOR object.""";


  static final String COMMON_METHODS = "${COMMON_METHODS}";

    String template;

  ArrayList<TOCEntry> tocEntries = new ArrayList<>();

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

    JS_NUMBER("Number"),
    JS_ARRAY("[]"),
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

  void printMethods(String numberPrefix, ArrayList<Method> methods) {
    int subSection = 0;
    for (Method method : methods) {
      s.append("<h5>" + numberPrefix + (++subSection) + " " + method.name + "()</h5>\n");
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

  ArrayList<Wrapper> wrappers = new ArrayList<>();

  static class Wrapper extends Method {

    ArrayList<Method> methods = new ArrayList<>();

    Method addMethod(String name, String description) {
      Method method = new Method();
      method.name = name;
      method.description = description;
      methods.add(method);
      return method;
    }

  } 

  Wrapper addWrapper(String name, String description) {
    Wrapper wrapper = new Wrapper();
    wrapper.name = name;
    wrapper.description = description;
    wrappers.add(wrapper);
    return wrapper;
  }

  void replace(String handle, String with) {
    template = template.replace(handle, with);
  }

  CreateDocument(String templateFileName, String documentFileName) {
    template = UTF8.decode(IO.readFile(templateFileName));

    addWrapper("Int", W_INT_DESCRIPTION)
      .addParameter("value", DataTypes.JS_NUMBER, W_INT_P1_DESCRIPTION)
      .setReturn(DataTypes.CBOR_INT, W_INT_RETURN_DESCRIPTION);

    addCommonMethod("clone", CLONE_DESCRIPTION)
      .setReturn(DataTypes.CBOR_Any, CLONE_RETURN_DESCRIPTION);
    // addCommonMethod("encode()", "");

    addCommonMethod("equals", EQUALS_DESCRIPTION)
      .addParameter("object", DataTypes.CBOR_Any, EQUALS_P1_DESCRIPTION)
      .setReturn(DataTypes.JS_BOOLEAN, EQUALS_RETURN_DESCRIPTION);
    // addCommonMethod("toString()", "");
 
    addCommonMethod("toDiagnosticNotation", TODIAG_DESCRIPTION)
      .addParameter("prettyPrint", DataTypes.JS_BOOLEAN, TODIAG_P1_DESCRIPTION)
      .setReturn(DataTypes.JS_STRING, TODIAG_RETURN_DESCRIPTION);
      
    addTocEntry("Table of Contents");
    addTocEntry("CBOR Objects");
    addTocEntry("CBOR.Int").indent = true;
    addTocEntry("CBOR.BigInt").indent = true;
    addTocEntry("CBOR.Float").indent = true;
    s = new StringBuilder();
    printMethods("3.", commonMethods);
    replace(COMMON_METHODS, s.toString());
    IO.writeFile(documentFileName, template);
  }
  public static void main(String[] args) {
    System.out.println("HI");
    new CreateDocument(args[0], args[1]);
  }
}