package m.log;

import java.io.*;

public class LogLineFile extends LogLine
{
  protected BufferedWriter writer;
  
  public LogLineFile(String filePath) throws Exception
  {
    writer = new BufferedWriter(new FileWriter(filePath));
  }
  
  public LogLineFile(String filePath, boolean append) throws Exception
  {
    writer = new BufferedWriter(new FileWriter(filePath, append));
  }
  
  public void log(String logLine)
  {
    try
    {
      writer.write(logLine);
      writer.newLine();
      writer.flush();
    }
    catch(Exception e)
    {
      e.printStackTrace();
    }
  }
}
