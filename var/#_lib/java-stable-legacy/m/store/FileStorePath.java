package m.store;

import m.conf.*;
import m.object.*;
import m.file.*;
import m.stream.*;
import m.util.*;

//public class FileStorePath extends ConfigurableWrapper<StoreFile> implements StorePath
public class FileStorePath
{
  protected FSStoreFile storeFile;
  protected String linkPath;
  
//  public void configure(Obj conf) throws Exception
//  {
//    super.configure(conf);
//    
//    storeFile = m.Global.objects.get(FSStoreFile.class, conf.get(Conf.STORE));
//    
//    linkPath = get().relativize(get().root(), storeFile.get().root()) + "/";
//  }
//  
//  public void file(String path) throws Exception
//  {
//    nodes(parent(path));
//    get().link(path(path), linkPath + storeFile.fileCreate());
//  }
//  
//  public StreamSeekable stream(String path) throws Exception
//  {
//    if(!get().exists(path))
//    {
//      file(path);
//    }
//    
//    return get().stream(path);
//  }
}
