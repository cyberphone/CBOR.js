import java.util.ArrayList;

import org.webpki.util.IO;
import org.webpki.util.UTF8;

public class CreateDocument {
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

  ArrayList<String> commonMethods = new ArrayList<>();

  void addCommonMethod(String methodName) {
    commonMethods.add(methodName);
  }

  CreateDocument(String templateFileName, String documentFileName) {
    template = UTF8.decode(IO.readFile(templateFileName));
    addCommonMethod("clone()");
    addCommonMethod("encode()");
    addCommonMethod("equals()");
    addCommonMethod("toString()");
    addCommonMethod("toDiagnosticNotation()");
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