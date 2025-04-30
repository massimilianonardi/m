package m.log;

import java.util.*;

import m.object.*;
import m.conf.*;

public class LogFilter extends ConfigurableWrapper<Logger> implements Logger
{
  protected PrefixSet callers;
  protected List<String> patterns;
  
  public LogFilter() throws Exception
  {
    construct(null);
  }
  
  public void construct(Obj args) throws Exception
  {
    destruct();
    
    callers = new PrefixSet();
    patterns = new ArrayList();
    
    configure(args);
  }
  
  public void destruct() throws Exception
  {
    if(callers != null)
    {
      callers.clear();
      callers = null;
    }
    
    if(patterns != null)
    {
      patterns.clear();
      patterns = null;
    }
  }
  
  public void configure(Obj params) throws Exception
  {
    if(params != null)
    {
      super.configure(params.get(Conf.LOGGER));
      configure(params.list(Conf.CALLER), params.list(Conf.PATTERN));
    }
  }
  
  public void configure(List<String> callerList, List<String> patternList) throws Exception
  {
    if(callerList != null)
    {
      callers.addAll(callerList);
    }
    
    if(patternList != null)
    {
      patterns.addAll(patternList);
    }
  }
  
  public void log(long timestamp, String date, String time, int level, String levelString, String caller, String object) throws Exception
  {
    if(callers.unemptyPrefix(caller) != null)
    {
      this.object.log(timestamp, date, time, level, levelString, caller, object);
    }
  }
}
