package m.log;

import m.conf.*;

public class LogCombined extends ConfigurableList<Logger> implements Logger
{
  public void add(Logger logger) throws Exception
  {
    objects.add(logger);
  }
  
  public void remove(Logger logger) throws Exception
  {
    objects.remove(logger);
  }
  
  public void log(long timestamp, String date, String time, int level, String levelString, String caller, String object) throws Exception
  {
    for(int i = 0; i < objects.size(); i++)
    {
      objects.get(i).log(timestamp, date, time, level, levelString, caller, object);
    }
  }
}
