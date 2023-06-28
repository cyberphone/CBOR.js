import java.util.ArrayList;

import org.webpki.util.IO;
import org.webpki.util.UTF8;

public class CreateDocument {

  static final String CLONE_DESCRIPTION = 
  """
  This is blah
  and more blah""";
  static final String CLONE_RETURN_DESCRIPTION = 
  """
  This is blah
  and more blah""";

 static final String EQUALS_DESCRIPTION = 
  """
  This is blah
  and more blah""";
  static final String EQUALS_RETURN_DESCRIPTION = 
  """
  This is blah
  and more blah""";

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
    CBOR_Any(),
    JS_NUMBER(),
    JS_ARRAY(),
    JS_BIGINT(),
    JS_BOOLEAN(),
    JS_STRING(),
    JS_UINT8ARRAY();

    DataTypes() {

    }
  }

  enum JSType {

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
    String methodName;
    String description;
    ArrayList<Parameter> parameters = new ArrayList<>();
    ReturnValue optionalReturnValue;

    Method setReturnValue(DataTypes dataType, String description) {
      optionalReturnValue = new ReturnValue();
      optionalReturnValue.dataType = dataType;
      optionalReturnValue.description = description;
      return this;
    }
  }

  ArrayList<Method> commonMethods = new ArrayList<>();

  Method addCommonMethod(String methodName, String description) {
    Method method = new Method();
    method.methodName = methodName;
    method.description = description;
    commonMethods.add(method);
    return method;
  }

  CreateDocument(String templateFileName, String documentFileName) {
    template = UTF8.decode(IO.readFile(templateFileName));
    addCommonMethod("clone", CLONE_DESCRIPTION)
      .setReturnValue(DataTypes.CBOR_Any, CLONE_RETURN_DESCRIPTION);
   // addCommonMethod("encode()", "");
    addCommonMethod("equals", EQUALS_DESCRIPTION)
      .setReturnValue(DataTypes.CBOR_Any, EQUALS_RETURN_DESCRIPTION);
   // addCommonMethod("toString()", "");
   // addCommonMethod("toDiagnosticNotation()","");
    addTocEntry("Table of Contents");
    addTocEntry("CBOR Objects");
    addTocEntry("CBOR.Int").indent = true;
    addTocEntry("CBOR.BigInt").indent = true;
    addTocEntry("CBOR.Float").indent = true;
    IO.writeFile(documentFileName, template);
  }
  public static void main(String[] args) {
    System.out.println("HI");
    new CreateDocument(args[0], args[1]);
  }
}