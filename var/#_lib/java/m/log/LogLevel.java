package m.log;

public class LogLevel
{
  static public final int OFF = 0;
  static public final int FATAL = 1;
  static public final int ERROR = 2;
  static public final int WARN = 3;
  static public final int INFO = 4;
  static public final int DEBUG = 5;
  static public final int TRACE = 6;
  static public final int ALL = 9;
  
  static public String get(int level) throws Exception
  {
    String res = "";
    switch(level)
    {
      case OFF:
        res = "off";
        break;
      case FATAL:
        res = "fatal";
        break;
      case ERROR:
        res = "error";
        break;
      case WARN:
        res = "warn";
        break;
      case INFO:
        res = "info";
        break;
      case DEBUG:
        res = "debug";
        break;
      case TRACE:
        res = "trace";
        break;
      case ALL:
        res = "all";
        break;
      default:
        throw new Exception();
//        break;
    }
    return res;
  }
  
  static public int get(String level) throws Exception
  {
    return LogLevel.class.getDeclaredField(level.toUpperCase()).getInt(null);
  }
}
