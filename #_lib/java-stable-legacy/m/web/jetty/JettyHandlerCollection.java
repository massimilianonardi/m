package m.web.jetty;

import org.eclipse.jetty.server.*;
import org.eclipse.jetty.server.handler.*;

import m.object.*;
import m.conf.*;

public class JettyHandlerCollection extends HandlerCollection implements ConfigurableObject
{
  ConfigurableList<ConfigurableObject> configurables = new ConfigurableList<ConfigurableObject>();
  
  public void construct(Obj args) throws Exception
  {
    configurables.construct(args);
  }
  
  public void destruct() throws Exception
  {
    configurables.destruct();
    destroy();
  }
  
  public void configure(Obj conf) throws Exception
  {
    configurables.configure(conf);
    
    int size = conf.list().size();
    for(int i = 0; i < size; i++)
    {
      Handler handler = (Handler) configurables.get(i);
      addHandler(handler);
    }
  }
}
