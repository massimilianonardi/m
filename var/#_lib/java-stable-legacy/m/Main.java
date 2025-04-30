package m;

import java.io.*;

public class Main
{
  static public String CONF_FILE = "conf/conf.json";
  static protected String CONF_PWD = "OBF:123";
  
  static public void init() throws Exception
  {
    File f = new File(CONF_FILE);
    System.out.println("m.Main.init - conf: " + f.getAbsolutePath());
    if(f.exists() && !f.isDirectory())
    {
      m.Global.get().construct(new m.object.Obj().load("conf/conf_init.json"));
      m.Global.get().configure(new m.object.Obj().load("conf/conf_run.json"));
    }
  }
  
  static public void end() throws Exception
  {
    m.Global.get().destruct();
  }
  
  static public void main(String[] args)
  {
    try
    {
      if(0 < args.length)
      {
        CONF_PWD = args[0];
      }
      if(1 < args.length)
      {
        CONF_FILE = args[1];
      }
      System.out.println("m.Main.main - conf password: " + CONF_PWD + " - conf file: " + CONF_FILE);
      init();
      end();
    }
    catch(Exception e)
    {
      e.printStackTrace();
    }
  }
}
