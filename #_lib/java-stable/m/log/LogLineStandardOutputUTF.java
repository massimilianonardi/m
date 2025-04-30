package m.log;

public class LogLineStandardOutputUTF extends LogLine
{
  public void log(String logLine)
  {
    System.out.println(m.enc.Encoding.decodeUTF(logLine.replaceAll("\\\\n", "\n").replaceAll("\\\\t", "\t")));
  }
}
