package m.conf;

import java.nio.file.*;
import java.util.concurrent.*;

import m.log.*;

public class ConfWatcher
{
  public boolean loop = true;
  
  public void watch(String path) throws Exception
  {
    Path directoryPath = Paths.get(path);
    WatchService watchService = FileSystems.getDefault().newWatchService();
    directoryPath.register(watchService, StandardWatchEventKinds.ENTRY_CREATE, StandardWatchEventKinds.ENTRY_DELETE, StandardWatchEventKinds.ENTRY_MODIFY);

    Log.debug("Watching directory: " + directoryPath);

    while(loop)
    {
      WatchKey key = watchService.take();

      for(WatchEvent<?> event: key.pollEvents()) 
      {
        if(event.kind() == StandardWatchEventKinds.ENTRY_CREATE) 
        {
          Log.debug("File created: " + event.context());
        } 
        else if(event.kind() == StandardWatchEventKinds.ENTRY_DELETE) 
        {
          Log.debug("File deleted: " + event.context());
        } 
        else if(event.kind() == StandardWatchEventKinds.ENTRY_MODIFY) 
        {
          Log.debug("File modified: " + event.context());
        }
      }

      key.reset();
    }
  }
  
  public void watchThread(String path) throws Exception
  {
    Log.debug("started watching thread on directory: " + path);
    
    ConfWatcher confWatcher = this;
    
    Executors.newSingleThreadExecutor().execute(new Runnable()
    {
      @Override
      public void run()
      {
        try
        {
          confWatcher.watch(path);
        }
        catch(Exception e)
        {
          e.printStackTrace();
        }
      }
    });
  }
}
