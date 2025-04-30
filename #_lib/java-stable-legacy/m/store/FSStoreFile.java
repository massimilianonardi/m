package m.store;

import m.conf.*;
import m.object.*;
import m.file.*;
import m.stream.*;
import m.util.*;

//public class FSStoreFile extends ConfigurableWrapper<FileSystem> implements StoreFile
public class FSStoreFile extends CHRootFileSystem implements StoreFile
{
  protected IDGenerator idGenerator;
  
  public FSStoreFile() throws Exception
  {
//    idGenerator = new IDGenerator().dateFormat("yyyy/MM/dd/HH/mm/ss");
    idGenerator = new IDGenerator().dateFormat("yyyy-MM-dd_HH-mm-ss");
  }
  
  public boolean fileExists(String index) throws Exception
  {
    return get().exists(index) && get().isFile(index);
  }
  
  synchronized public String fileCreate() throws Exception
  {
    String index = idGenerator.dateRandom();
    
    if(fileExists(index))
    {
      index = idGenerator.dateRandom();
    }
    
    if(fileExists(index))
    {
      index = idGenerator.dateRandom();
    }
    
    if(fileExists(index))
    {
      throw new Exception();
    }
    
    get().nodes(get().parent(index));
    get().file(index);
    
    return index;
  }
  
  public void fileCreate(String index) throws Exception
  {
    get().nodes(get().parent(index));
    get().file(index);
  }
  
  public void fileIndex(String index, String newIndex) throws Exception
  {
    get().nodes(get().parent(newIndex));
    get().move(index, newIndex);
  }
  
  public String fileCreate(StreamInput stream) throws Exception
  {
    String index = fileCreate();
    fileStream(index).streamFromInput(stream);
    
    return index;
  }
  
  public String fileCopy(String index) throws Exception
  {
    String newIndex = fileCreate();
    get().copy(index, newIndex, true, false);
    
    return newIndex;
  }
  
  public void fileDelete(String index) throws Exception
  {
    get().delete(index);
  }
  
  public StreamSeekable fileStream(String index) throws Exception
  {
    return get().stream(index);
  }
  
  public StreamSeekableInput fileReadOnlyStream(String index) throws Exception
  {
    return fileStream(index);
  }
  
  public StreamInput fileSealedStream(String index) throws Exception
  {
    return fileStream(index);
  }
  
  public StreamInput fileIndexList() throws Exception
  {
    return get().list("");
  }
}
