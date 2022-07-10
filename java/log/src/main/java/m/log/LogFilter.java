package m.log;

import java.util.*;

import m.collection.*;

public class LogFilter implements Logger
{
  protected Logger logger;
  
  protected PrefixSet callers = new PrefixSet();
  protected List<String> patterns = new ArrayList();
  
  public LogFilter() throws Exception
  {
  }
  
  public LogFilter setLogger(Logger logger) throws Exception
  {
    if(logger != null)
    {
      this.logger = logger;
    }
    
    return this;
  }
  
  public LogFilter setCallers(List<String> callerList) throws Exception
  {
    if(callerList != null)
    {
      callers.addAll(callerList);
    }
    
    return this;
  }
  
  public LogFilter setPatterns(List<String> patternList) throws Exception
  {
    if(patternList != null)
    {
      patterns.addAll(patternList);
    }
    
    return this;
  }
  
  public void log(long timestamp, String date, String time, int level, String levelString, String caller, String object) throws Exception
  {
    if(callers.unemptyPrefix(caller) != null)
    {
      logger.log(timestamp, date, time, level, levelString, caller, object);
    }
  }
}
