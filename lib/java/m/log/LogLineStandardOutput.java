package m.log;

public class LogLineStandardOutput extends LogLine
{
  public void log(String logLine)
  {
    System.out.println(logLine);
  }
}
