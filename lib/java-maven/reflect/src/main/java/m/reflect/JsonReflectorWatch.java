package m.reflect;

import java.nio.file.*;
import java.util.*;

import m.log.*;
import m.json.*;

public class JsonReflectorWatch
{
  protected JsonReflector jsonReflector;
  protected WatchService watchService;
  protected WatchKey watchKey;
  protected Path path;
  protected Thread thread;
  protected boolean jsonWatchContinuousLoop = true;
  
  protected JsonReflectorWatch(JsonReflector jsonReflector, String directoryPath) throws Exception
  {
    this.jsonReflector = jsonReflector;
    watchService = FileSystems.getDefault().newWatchService();
    path = Paths.get(directoryPath);
    path.register(watchService, StandardWatchEventKinds.ENTRY_CREATE, StandardWatchEventKinds.ENTRY_DELETE, StandardWatchEventKinds.ENTRY_MODIFY);
    
    thread = new Thread(new Runnable()
    {
      @Override
      public void run()
      {
        while(jsonWatchContinuousLoop)
        {
          try
          {
            watchKey = watchService.take();
          }
          catch(Exception e)
          {
            Log.error(e);
            if(!jsonWatchContinuousLoop) break;
          }

          Set<String> files = new HashSet<String>();
          for(WatchEvent<?> event: watchKey.pollEvents()) 
          {
            if(event.kind() == StandardWatchEventKinds.ENTRY_CREATE) 
            {
              Log.debug("File created: " + event.context());
              files.add(event.context().toString());
            } 
            else if(event.kind() == StandardWatchEventKinds.ENTRY_DELETE) 
            {
              Log.debug("File deleted: " + event.context());
              files.remove(event.context().toString());
            } 
            else if(event.kind() == StandardWatchEventKinds.ENTRY_MODIFY) 
            {
              Log.debug("File modified: " + event.context());
              files.add(event.context().toString());
            }
          }
          
          Log.debug("files", files);
          try
          {
            for(String fileName: files)
            {
              Json json = new Json().load(path.resolve(fileName).toString());
              jsonReflector.process(json);
            }
          }
          catch(Exception e)
          {
            Log.error(e);
          }

          watchKey.reset();
        }
      }
    });
    
    thread.start();
    
    Log.debug("END - create watching thread on directory: " + path);
  }
  
  public void stop()
  {
    jsonWatchContinuousLoop = false;
    
    try
    {
      watchService.close();
    }
    catch(Exception e)
    {
      Log.error(e);
    }
  }
}
