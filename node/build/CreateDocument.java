import java.util.ArrayList;

import org.webpki.util.IO;
import org.webpki.util.UTF8;

public class CreateDocument {
  String template;

  ArrayList<TOCEntry> tocEntries = new ArrayList<>();

  static class TOCEntry {
    String title;

    TOCEntry(String title) {
      this.title = title;
    }
  }

  void addTocEntry(String title) {
    tocEntries.add(new TOCEntry(title));
  }

  CreateDocument(String templateFileName, String documentFileName) {
    template = UTF8.decode(IO.readFile(templateFileName));
    addTocEntry("CBOR JavaScript API");
    IO.writeFile(documentFileName, template);
  }
  public static void main(String[] args) {
    System.out.println("HI");
    new CreateDocument(args[0], args[1]);
  }
}