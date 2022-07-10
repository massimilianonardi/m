package m.conf;

import m.object.*;

public class Configuration extends Obj implements ConfigurableObject
{
  protected String path;
  protected Configurable listener;
  
  public Configuration(String confPath, Configurable object) throws Exception
  {
    configure(confPath, object);
  }
  
  public void construct(Obj args) throws Exception
  {
  }
  
  public void destruct() throws Exception
  {
  }
  
  public void configure(Obj params) throws Exception
  {
    configure(params.string(Conf.PATH), m.Global.objects.get(params.get(Conf.OBJECT)));
  }
  
  public void configure(String confPath, Configurable object) throws Exception
  {
    path = confPath;
    listener = object;
    
    loadConfiguration();
  }
  
  public Configurable listener() throws Exception
  {
    return listener;
  }
  
  public void listener(Configurable obj) throws Exception
  {
    listener = obj;
  }
  
  public void notifyListener() throws Exception
  {
    listener.configure(this);
  }
  
  public void loadConfiguration() throws Exception
  {
    load(path);
    notifyListener();
  }
  
  public void saveConfiguration() throws Exception
  {
    save(path);
  }
}
