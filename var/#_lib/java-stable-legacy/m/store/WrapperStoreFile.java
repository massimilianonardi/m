package m.store;

import m.conf.*;
import m.stream.*;

public class WrapperStoreFile extends ConfigurableWrapper<StoreFile> implements StoreFile
{
  public boolean fileExists(String index) throws Exception
  {
    return get().fileExists(index);
  }
  
  public String fileCreate() throws Exception
  {
    return get().fileCreate();
  }
  
  public String fileCreate(StreamInput stream) throws Exception
  {
    return get().fileCreate(stream);
  }
  
  public void fileCreate(String index) throws Exception
  {
    get().fileCreate(index);
  }
  
  public void fileIndex(String index, String newIndex) throws Exception
  {
    get().fileIndex(index, newIndex);
  }
  
  public String fileCopy(String index) throws Exception
  {
    return get().fileCopy(index);
  }
  
  public void fileDelete(String index) throws Exception
  {
    get().fileDelete(index);
  }
  
  public StreamInput fileSealedStream(String index) throws Exception
  {
    return get().fileSealedStream(index);
  }
  
  public StreamSeekableInput fileReadOnlyStream(String index) throws Exception
  {
    return get().fileReadOnlyStream(index);
  }
  
  public StreamSeekable fileStream(String index) throws Exception
  {
    return get().fileStream(index);
  }
  
  public StreamInput fileIndexList() throws Exception
  {
    return get().fileIndexList();
  }
}
