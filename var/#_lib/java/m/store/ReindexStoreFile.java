package m.store;

import m.conf.*;
import m.object.*;
import m.stream.*;

// todo think if it is good to convert to abstract class
public class ReindexStoreFile extends WrapperStoreFile
{
  public String index(String index) throws Exception
  {
    return index;
  }
  
  public String rindex(String index) throws Exception
  {
    return index;
  }
  
  public boolean fileExists(String index) throws Exception
  {
    return get().fileExists(index(index));
  }
  
  public String fileCreate() throws Exception
  {
//    return rindex(get().fileCreate());
    String index = get().fileCreate();
    get().fileDelete(index);
    get().fileCreate(index(index));
    return index;
  }
  
  public String fileCreate(StreamInput stream) throws Exception
  {
//    return rindex(get().fileCreate(stream));
    String index = get().fileCreate(stream);
    get().fileIndex(index, index(index));
    return index;
  }
  
  public void fileCreate(String index) throws Exception
  {
    get().fileCreate(index(index));
  }
  
  public void fileIndex(String index, String newIndex) throws Exception
  {
    get().fileIndex(index(index), index(newIndex));
  }
  
  public String fileCopy(String index) throws Exception
  {
    return rindex(get().fileCopy(index(index)));
  }
  
  public void fileDelete(String index) throws Exception
  {
    get().fileDelete(index(index));
  }
  
  public StreamInput fileSealedStream(String index) throws Exception
  {
    return get().fileSealedStream(index(index));
  }
  
  public StreamSeekableInput fileReadOnlyStream(String index) throws Exception
  {
    return get().fileReadOnlyStream(index(index));
  }
  
  public StreamSeekable fileStream(String index) throws Exception
  {
    return get().fileStream(index(index));
  }
  
  public ObjInput fileIndexList() throws Exception
  {
    throw new Exception();
    // todo stream to convert back indexes
//    return get().fileIndexList();
  }
}
