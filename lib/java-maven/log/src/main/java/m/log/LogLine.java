package m.log;

abstract public class LogLine implements Logger
{
  abstract public void log(String logLine);
  
  public void log(long timestamp, String date, String time, int level, String levelString, String caller, String object) throws Exception
  {
    String logSeparator = ", ";
    String logLine = "[";
    logLine += field("Timestamp", timestamp) + logSeparator;
    logLine += field("Date", date) + logSeparator;
    logLine += field("Time", time) + logSeparator;
    logLine += field("LogLevel", level) + logSeparator;
    logLine += field("LogLevelString", levelString) + logSeparator;
    logLine += field("Caller", caller) + logSeparator;
//    logLine += field("Object", object);
    logLine += object;
    logLine += "]";
    logLine += ",";
    
    log(logLine);
  }
  
  protected static String field(String name, long value)
  {
    return field(name, "" + value);
  }
  
  protected static String field(String name, String value)
  {
//    return "\"" + name + "\": \"" + value + "\"";
    return "\"" + value + "\"";
  }
}
