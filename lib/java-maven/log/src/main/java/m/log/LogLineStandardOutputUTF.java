package m.log;

import java.util.regex.*;

public class LogLineStandardOutputUTF extends LogLine
{
  public void log(String logLine)
  {
    System.out.println(decodeUTF(logLine.replaceAll("\\\\n", "\n").replaceAll("\\\\t", "\t")));
  }
  
  static protected StringBuffer decodeUTF(String text)
  {
    Pattern p = Pattern.compile("\\\\u(\\p{XDigit}{4})");
    Matcher m = p.matcher(text);
    StringBuffer buffer = new StringBuffer(text.length());
    while(m.find())
    {
      String ch = String.valueOf((char) Integer.parseInt(m.group(1), 16));
      m.appendReplacement(buffer, Matcher.quoteReplacement(ch));
    }
    m.appendTail(buffer);
    return buffer;
  }
}
