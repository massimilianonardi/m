package m.log;

import java.util.*;
import java.text.*;

import com.google.gson.*;

import m.conf.*;
import m.object.*;

public class Log implements ConfigurableObject
{
//  static protected Gson gson = new Gson();
  static protected Gson gson = new GsonBuilder().serializeNulls().setPrettyPrinting().create();
  
  protected int level = LogLevel.ALL;
  protected String levelString = "all";
  
  protected Logger logger;
  
  public Log() throws Exception
  {
    configure(null, null);
  }
  
  public Log(Logger logger) throws Exception
  {
    configure(logger, null);
  }
  
  public void construct(Obj args) throws Exception
  {
    configure(args);
  }
  
  public void destruct() throws Exception
  {
    if(logger != null)
    {
      ((ConfigurableObject) logger).destruct();
      logger = null;
    }
  }
  
  public void configure(Obj params) throws Exception
  {
    if(params != null)
    {
      configure((Logger) m.Global.objects.get(params.get(Conf.LOGGER)), params.string(Conf.LEVEL));
    }
    else
    {
      configure(null, null);
    }
  }
  
  public void configure(Logger logger, String level) throws Exception
  {
    destruct();
    
    this.logger = logger;
    
    if(logger == null && m.Global.objects != null)
    {
      this.logger = (Logger) m.Global.objects.iface(Logger.class.getName());
    }
    
    if(logger == null)
    {
      this.logger = new LogLineStandardOutput();
    }
    
    if(level != null && !"".equals(level))
    {
      level(level);
    }
  }
  
  public void level(int level) throws Exception
  {
    this.level = level;
    levelString = LogLevel.get(level);
  }
  
  public void level(String level) throws Exception
  {
    this.level = LogLevel.get(level);
    levelString = level.toLowerCase();
  }
  
  public int level()
  {
    return level;
  }
  
  public String levelString()
  {
    return levelString;
  }
  
  public void fatal(Object ... obj)
  {
    log(LogLevel.FATAL, "FATAL", obj);
  }
  
  public void error(Object ... obj)
  {
    log(LogLevel.ERROR, "ERROR", obj);
  }
  
  public void warn(Object ... obj)
  {
    log(LogLevel.WARN, "WARN", obj);
  }
  
  public void info(Object ... obj)
  {
    log(LogLevel.INFO, "INFO", obj);
  }
  
  public void debug(Object ... obj)
  {
    log(LogLevel.DEBUG, "DEBUG", obj);
  }
  
  public void trace(Object ... obj)
  {
    log(LogLevel.TRACE, "TRACE", obj);
  }
  
  protected void log(int level, String levelString, Object ... obj)
  {
    if(level <= this.level)
    {
      log(System.currentTimeMillis(), level, levelString, obj);
    }
  }
  
  protected void log(long timestamp, int level, String levelString, Object ... obj)
  {
    Date d = new Date();
    String date = new SimpleDateFormat("yyyy-MM-dd").format(d);
    String time = new SimpleDateFormat("HH:mm:ss").format(d);
    
//    String caller = Thread.currentThread().getStackTrace()[4].toString();
    StackTraceElement callerStack = Thread.currentThread().getStackTrace()[4];
    String caller = callerStack.getClassLoaderName() + "/" + callerStack.getClassName() + "." + callerStack.getMethodName() + ":" + callerStack.getLineNumber();
    
    try
    {
      String object = gson.toJson(obj);
      log(timestamp, date, time, level, levelString, caller, object);
    }
    catch(Exception e)
    {
      e.printStackTrace();
    }
  }
  
  protected void log(long timestamp, String date, String time, int level, String levelString, String caller, String object) throws Exception
  {
    logger.log(timestamp, date, time, level, levelString, caller, object);
  }
  
  public void log(LogEvent event)
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
  
  public void log(List<LogEvent> events)
  {
    for(int i = 0; i < events.size(); i++)
    {
      log(events.get(i));
    }
  }
}
