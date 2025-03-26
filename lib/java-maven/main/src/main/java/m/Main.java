package m;

import java.io.*;

import m.log.*;
import m.json.*;
import m.reflect.*;

public class Main
{
  static public JsonReflector global = new JsonReflector();
  static public JsonReflectorWatch watch;
  
  static public void main(String[] args)
  {
    try
    {
      Log.info("start", args);
      
      watch = global.watch("./conf/runtime");
      
      for(String arg: args)
      {
        Log.debug(arg);
        
        File f = new File(arg);
        if(f.exists() && !f.isDirectory())
        {
          Log.debug(arg, true);
          
          global.process(new Json().load(arg));
        }
        else
        {
          Log.debug(arg, false);
        }
      }
      
      Log.info("end");
    }
    catch(Exception e)
    {
      Log.fatal("exception", e);
      e.printStackTrace();
    }
  }
}
