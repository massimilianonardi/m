package m;

import java.io.*;

import m.log.*;
import m.json.*;
import m.reflect.*;

public class Main
{
  static JsonReflector global = new JsonReflector();
  public static JsonReflectorWatch watch;
  
  static public void main(String[] args)
  {
    try
    {
      Log.info("start", args);
//      Log.logger(new LogLineFile("./logile.log"));
      
//      new m.conf.ConfWatcher().watchThread("./conf");
      watch = global.watch("./conf/runtime");
      
      for(String arg: args)
      {
        Log.debug(arg);
        
        File f = new File(arg);
        if(f.exists() && !f.isDirectory())
        {
          Log.debug(arg, true);
          
          global.process(new Json().load(arg));
//      w.stop();
        }
        else
        {
          Log.debug(arg, false);
        }
      }
      
      Log.info("end");
      
      Log.debug(new File("."));
      throw new FileNotFoundException("TEST EXCEPTION");
    }
    catch(Exception e)
    {
      Log.fatal("exception", e);
      e.printStackTrace();
    }
  }
}
