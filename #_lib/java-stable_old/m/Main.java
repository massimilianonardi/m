package m;

import java.io.*;

public class Main
{
  static protected String CONF_INIT_CONTRUCT;
  static protected String CONF_INIT_CONFIGURE;
  
  static public void main(String[] args)
  {
    System.out.println("[m.Main.main, start],");
    
    try
    {
      if(0 < args.length)
      {
        System.out.println("[m.Main.main, m.Global.get().construct, " + args[0] + "],");
        CONF_INIT_CONTRUCT = args[0];
        File f = new File(CONF_INIT_CONTRUCT);
        if(f.exists() && !f.isDirectory())
        {
          System.out.println("[m.Main.main, m.Global.get().construct, " + args[0] + ", true],");
          m.Global.get().construct(new m.object.Obj().load(CONF_INIT_CONTRUCT));
        }
        else
        {
          System.out.println("[m.Main.main, m.Global.get().construct, " + args[0] + ", false],");
        }
      }
      
      for(int i = 1; i < args.length; i++)
      {
        System.out.println("[m.Main.main, m.Global.get().configure, " + args[i] + "],");
        CONF_INIT_CONFIGURE = args[i];
        File f = new File(CONF_INIT_CONFIGURE);
        if(f.exists() && !f.isDirectory())
        {
          System.out.println("[m.Main.main, m.Global.get().configure, " + args[i] + ", true],");
          m.Global.get().configure(new m.object.Obj().load(CONF_INIT_CONFIGURE));
        }
        else
        {
          System.out.println("[m.Main.main, m.Global.get().configure, " + args[i] + ", false],");
        }
      }
      
      m.Global.get().destruct();
    }
    catch(Exception e)
    {
      e.printStackTrace();
    }
    
    System.out.println("[m.Main.main, end]");
  }
}
