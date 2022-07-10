package m.web.jetty;

import org.eclipse.jetty.util.log.*;

public class JettyLoggerNoLog implements Logger
{
  public String getName()
  {
    return this.getClass().getName();
  }
  
  public void warn(String string, Object... os)
  {
  }
  
  public void warn(Throwable thrwbl)
  {
  }
  
  public void warn(String string, Throwable thrwbl)
  {
  }
  
  public void info(String string, Object... os)
  {
  }
  
  public void info(Throwable thrwbl)
  {
  }
  
  public void info(String string, Throwable thrwbl)
  {
  }
  
  public boolean isDebugEnabled()
  {
    return false;
  }
  
  public void setDebugEnabled(boolean bln)
  {
  }
  
  public void debug(String string, Object... os)
  {
  }
  
  public void debug(String string, long l)
  {
  }
  
  public void debug(Throwable thrwbl)
  {
  }
  
  public void debug(String string, Throwable thrwbl)
  {
  }
  
  public Logger getLogger(String string)
  {
    return this;
  }
  
  public void ignore(Throwable thrwbl)
  {
  }
}
