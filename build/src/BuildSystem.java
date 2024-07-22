import org.webpki.util.IO;
import org.webpki.util.UTF8;

public class BuildSystem {
  String template;
  String testFileDirectory;
  Integer index;
  static final String TEST = "let TESTS=[\n";

  void addFile(String testFileName) {
    String content = UTF8.decode(IO.readFile(testFileDirectory + testFileName));
    content = content.substring(0, content.indexOf("\n") + 1) +
              content.substring(content.indexOf("\n\n") + 1);
    content = "\n{name:'" + testFileName + "',\nfile:String.raw`" + content + "`}\n";
    if (index == null) {
      index = template.indexOf(TEST) + TEST.length();
    } else {
      content = "," + content;
    }
    template = template.substring(0, index) + content + template.substring(index);
    index += content.length();
  }

  BuildSystem(String templateFileName, String browserTestFileName, String testFileDirectory) {
    template = UTF8.decode(IO.readFile(templateFileName));
    this.testFileDirectory = testFileDirectory;
    addFile("base64.js");
    addFile("check-for-unread.js");
    addFile("clone.js");
    addFile("cotx.js");
    addFile("diagnostic.js");
    addFile("float.js");
    addFile("hex.js");
    addFile("integer.js");
    addFile("int-ranges.js");
    addFile("maps.js");
    addFile("miscellaneous.js");
    addFile("nondeterministic.js");
    addFile("out-of-range.js");
    addFile("sequence.js");
    addFile("tags.js");
    addFile("utf8.js");
    addFile("xyz-encoder.js");
    addFile("xyz-decoder.js");
    IO.writeFile(browserTestFileName, template);
  }
  public static void main(String[] args) {
    new BuildSystem(args[0], args[1], args[2]);
  }
}