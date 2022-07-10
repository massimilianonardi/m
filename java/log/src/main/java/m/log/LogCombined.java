package m.log;

import java.util.*;

public class LogCombined implements Logger
{
  protected List<Logger> loggers = new ArrayList<Logger>();
  
  public List<Logger> get()
  {
    return loggers;
  }
  
  public void set(List<Logger> loggers)
  {
    if(loggers != null)
    {
      this.loggers = loggers;
    }
  }
  
  public void log(long timestamp, String date, String time, int level, String levelString, String caller, String object) throws Exception
  {
    for(int i = 0; i < loggers.size(); i++)
    {
      loggers.get(i).log(timestamp, date, time, level, levelString, caller, object);
    }
  }
}
