package m.store;

import m.conf.*;
import m.object.*;
import m.file.*;
import m.stream.*;
import m.util.*;

// todo correct implementation overriding all needed methods to map to store file and keep only original methods that act on paths
public class FSStorePath extends CHRootFileSystem implements StorePath
{
  static final public String PREFIX = "/m.${StoreFile}/";
  
  protected StoreFile storeFile;
  
  public void configure(Obj conf) throws Exception
  {
    super.configure(conf);
    
    storeFile = m.Global.objects.get(StoreFile.class, conf.get(Conf.STORE));
  }
  
  public StoreFile getStoreFile() throws Exception
  {
    return storeFile;
  }
  
//  public Attributes attributes(String path) throws Exception
//  {
//    return get().attributes(path(path));
//  }
  
//  public void attributes(String path, Attributes attributes) throws Exception
//  {
//    get().attributes(path(path), attributes);
//  }
  
  public void file(String path) throws Exception
  {
    get().link(path(path), PREFIX + storeFile.fileCreate());
  }
  
//  public void file(String path, StreamInput stream) throws Exception
//  {
//    get().link(path(path), PREFIX + storeFile.fileCreate(stream));
//  }
  public String file(String path, StreamInput stream) throws Exception
  {
    String index = storeFile.fileCreate(stream);
    get().link(path(path), PREFIX + index);
    
    return index;
  }
  
  public StreamSeekable stream(String path) throws Exception
  {
    return storeFile.fileStream(link(path).substring(PREFIX.length()));
  }
  
  public StreamSeekableInput read(String path) throws Exception
  {
    return storeFile.fileReadOnlyStream(link(path).substring(PREFIX.length()));
  }
}

//public class FSStorePath extends _CHRootFileSystem implements StorePath
//{
//  protected FSStoreFile storeFile;
//  protected String linkPath;
//  
//  public void configure(Obj conf) throws Exception
//  {
//    super.configure(conf);
//    
//    storeFile = m.Global.objects.get(FSStoreFile.class, conf.get(Conf.STORE));
//    
//    linkPath = get().relativize(get().root(), storeFile.get().root()) + "/";
//  }
//  
////  public void file(String path) throws Exception
////  {
////    get().nodes(get().parent(path));
////    get().link(path, linkPath + storeFile.fileCreate());
////  }
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
//}
