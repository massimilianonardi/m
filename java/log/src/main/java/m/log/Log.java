package m.log;

import java.util.*;
import java.text.*;

import com.google.gson.*;

public class Log
{
  static protected Gson gson = new GsonBuilder().serializeNulls().setPrettyPrinting().create();
  
  static protected int level = LogLevel.ALL;
  static protected String levelString = "all";
  
  static protected Logger logger = new LogLineStandardOutput();
  
  static public void logger(Logger logger) throws Exception
  {
    if(logger == null)
    {
      Log.logger = new LogLineStandardOutput();
    }
    else
    {
      Log.logger = logger;
    }
  }
  
  static public void level(int level) throws Exception
  {
    Log.level = level;
    levelString = LogLevel.get(level);
  }
  
  static public void level(String level) throws Exception
  {
    Log.level = LogLevel.get(level);
    levelString = level.toLowerCase();
  }
  
  static public int level()
  {
    return level;
  }
  
  static public String levelString()
  {
    return levelString;
  }
  
  static public void fatal(Object... obj)
  {
    log(LogLevel.FATAL, "FATAL", obj);
  }
  
  static public void error(Object... obj)
  {
    log(LogLevel.ERROR, "ERROR", obj);
  }
  
  static public void warn(Object... obj)
  {
    log(LogLevel.WARN, "WARN", obj);
  }
  
  static public void info(Object... obj)
  {
    log(LogLevel.INFO, "INFO", obj);
  }
  
  static public void debug(Object... obj)
  {
    log(LogLevel.DEBUG, "DEBUG", obj);
  }
  
  static public void trace(Object... obj)
  {
    log(LogLevel.TRACE, "TRACE", obj);
  }
  
  static protected void log(int level, String levelString, Object... obj)
  {
    if(level <= Log.level)
    {
      log(System.currentTimeMillis(), level, levelString, obj);
    }
  }
  
  static protected void log(long timestamp, int level, String levelString, Object... obj)
  {
    Date d = new Date();
    String date = new SimpleDateFormat("yyyy-MM-dd").format(d);
    String time = new SimpleDateFormat("HH:mm:ss").format(d);
    
//    String caller = Thread.currentThread().getStackTrace()[4].toString();
    StackTraceElement callerStack = Thread.currentThread().getStackTrace()[4];
    String caller = callerStack.getClassLoaderName() + "/" + callerStack.getClassName() + "." + callerStack.getMethodName() + ":" + callerStack.getLineNumber();
    String object = objectToString(obj);
    
    try
    {
      log(timestamp, date, time, level, levelString, caller, object);
    }
    catch(Exception e)
    {
      e.printStackTrace();
    }
  }
  
  static protected String objectToString(Object... obj)
  {
    for(int i = 0; i < obj.length; i++)
    {
      try
      {
        if(obj[i] instanceof Throwable)
        {
          Throwable e = (Throwable) obj[i];
          java.util.List<String> stackTrace = new java.util.ArrayList();
          stackTrace.add(e.getClass().getName());
          stackTrace.add(e.getMessage());
          for(StackTraceElement k: e.getStackTrace())
          {
            stackTrace.add(k.getClassLoaderName() + "/" + k.getClassName() + "." + k.getMethodName()+ " | " + k.getLineNumber() + " | " + k.getFileName());
          }
          obj[i] = stackTrace;
        }
        else
        {
          gson.toJson(obj[i]);
        }
      }
      catch(Exception e)
      {
        obj[i] = "Log: object not serializable! Class: " + obj[i].getClass().getName();
      }
    }
    
    String object = null;
    
    try
    {
      object = gson.toJson(obj);
    }
    catch(Exception e)
    {
      object = "Log: objects not serializable!";
      e.printStackTrace();
    }
    
    return object;
  }
  
  static protected void log(long timestamp, String date, String time, int level, String levelString, String caller, String object) throws Exception
  {
    logger.log(timestamp, date, time, level, levelString, caller, object);
  }
  
  static public void log(LogEvent event)
  {
    Date d = new Date();
    String date = new SimpleDateFormat("yyyy-MM-dd").format(d);
    String time = new SimpleDateFormat("HH:mm:ss").format(d);
    
    try
    {
      log(event.timestamp, date, time, LogLevel.get(event.level), event.level, event.caller, event.object);
    }
    catch(Exception e)
    {
      e.printStackTrace();
    }
  }
  
  static public void log(List<LogEvent> events)
  {
    for(int i = 0; i < events.size(); i++)
    {
      log(events.get(i));
    }
  }
}
